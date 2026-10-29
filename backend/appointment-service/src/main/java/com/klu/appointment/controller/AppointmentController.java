package com.klu.appointment.controller;

import com.klu.appointment.event.AppointmentCompletedEvent;
import com.klu.appointment.kafka.KafkaProducerService;
import com.klu.appointment.model.Appointment;
import com.klu.appointment.orchestration.ConsultationOrchestrator;
import com.klu.appointment.repository.AppointmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final KafkaProducerService kafkaProducerService;
    private final ConsultationOrchestrator consultationOrchestrator;

    public AppointmentController(AppointmentRepository appointmentRepository,
                                 KafkaProducerService kafkaProducerService,
                                 ConsultationOrchestrator consultationOrchestrator) {
        this.appointmentRepository = appointmentRepository;
        this.kafkaProducerService = kafkaProducerService;
        this.consultationOrchestrator = consultationOrchestrator;
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAppointments(
            @RequestParam(value = "patientId", required = false) String patientId,
            @RequestParam(value = "doctorId", required = false) String doctorId) {
        if (patientId != null && !patientId.isBlank()) {
            return ResponseEntity.ok(appointmentRepository.findByPatientIdOrderByDateDesc(patientId));
        }
        if (doctorId != null && !doctorId.isBlank()) {
            return ResponseEntity.ok(appointmentRepository.findByDoctorIdOrderByDateDesc(doctorId));
        }
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable("id") String id) {
        return appointmentRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Appointment not found: " + id)));
    }

    /**
     * Section 15: Authoritative Conflict Detection Engine
     * Rejects overlapping doctor appointments with HTTP 409 Conflict
     */
    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        // Validate required fields
        if (appointment.getDoctorId() == null || appointment.getDate() == null || appointment.getTime() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Doctor ID, date, and time are required for booking"));
        }

        // Authoritative Check: Overlapping upcoming appointment for same doctor at same date & time
        boolean hasConflict = appointmentRepository.existsByDoctorIdAndDateAndTimeAndStatus(
                appointment.getDoctorId(),
                appointment.getDate(),
                appointment.getTime(),
                "Upcoming"
        );

        if (hasConflict) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "status", 409,
                            "error", "Schedule conflict: Doctor already has an appointment scheduled at this time slot."
                    ));
        }

        if (appointment.getId() == null || appointment.getId().isBlank()) {
            appointment.setId("a" + System.currentTimeMillis());
        }
        appointment.setStatus("Upcoming");

        Appointment saved = appointmentRepository.save(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Section 11: Kafka Event Choreography trigger
     * Appointment Completed -> Kafka Event -> Billing Service
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeAppointment(
            @PathVariable("id") String id,
            @RequestBody(required = false) Map<String, Object> body) {
        Optional<Appointment> opt = appointmentRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Appointment not found: " + id));
        }

        Appointment apt = opt.get();
        apt.setStatus("Completed");

        String diagnosis = body != null && body.containsKey("diagnosis") ? String.valueOf(body.get("diagnosis")) : "Routine Assessment";
        String notes = body != null && body.containsKey("notes") ? String.valueOf(body.get("notes")) : "Consultation completed successfully";
        Double fee = body != null && body.containsKey("fee") ? Double.valueOf(String.valueOf(body.get("fee"))) : apt.getFee();

        apt.setDiagnosis(diagnosis);
        apt.setNotes(notes);
        apt.setFee(fee);
        appointmentRepository.save(apt);

        // Synchronously coordinate with Patient Service for EHR record persistence
        try {
            consultationOrchestrator.executeSynchronousCheckout(id, notes, diagnosis, fee);
        } catch (Exception e) {
            // Fallback: Kafka event published directly if inter-service coordinator encounters an issue
            AppointmentCompletedEvent event = new AppointmentCompletedEvent(
                    apt.getId(),
                    apt.getPatientId(),
                    apt.getDoctorId(),
                    apt.getDoctorName(),
                    apt.getDate(),
                    apt.getFee(),
                    diagnosis,
                    notes
            );
            kafkaProducerService.publishAppointmentCompleted(event);
        }

        return ResponseEntity.ok(Map.of(
                "message", "Appointment completed and published to Kafka event-driven pipeline",
                "appointment", apt
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable("id") String id) {
        Optional<Appointment> opt = appointmentRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Appointment not found: " + id));
        }
        Appointment apt = opt.get();
        apt.setStatus("Cancelled");
        appointmentRepository.save(apt);
        return ResponseEntity.ok(Map.of("message", "Appointment successfully cancelled", "id", id));
    }

    /**
     * Section 10: Synchronous Orchestration Endpoint
     */
    @PostMapping("/orchestrated-checkout")
    public ResponseEntity<?> orchestratedCheckout(@RequestBody Map<String, Object> request) {
        String appointmentId = (String) request.get("appointmentId");
        String notes = (String) request.getOrDefault("notes", "Clinical review completed");
        String diagnosis = (String) request.getOrDefault("diagnosis", "Standard Examination");
        Double fee = request.containsKey("fee") ? Double.valueOf(String.valueOf(request.get("fee"))) : 150.0;

        Map<String, Object> result = consultationOrchestrator.executeSynchronousCheckout(
                appointmentId, notes, diagnosis, fee
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "APPOINTMENT-SERVICE"));
    }
}
