package com.apexcare.appointment.orchestration;

import com.apexcare.appointment.event.AppointmentCompletedEvent;
import com.apexcare.appointment.kafka.KafkaProducerService;
import com.apexcare.appointment.model.Appointment;
import com.apexcare.appointment.repository.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ConsultationOrchestrator {

    private static final Logger log = LoggerFactory.getLogger(ConsultationOrchestrator.class);

    private final AppointmentRepository appointmentRepository;
    private final KafkaProducerService kafkaProducerService;

    public ConsultationOrchestrator(AppointmentRepository appointmentRepository,
                                    KafkaProducerService kafkaProducerService) {
        this.appointmentRepository = appointmentRepository;
        this.kafkaProducerService = kafkaProducerService;
    }

    /**
     * CO-1 Orchestration Workflow: Coordinated synchronous checkout process
     */
    public Map<String, Object> executeSynchronousCheckout(String appointmentId, String notes, String diagnosis, Double fee) {
        log.info("[SOA Orchestration] Starting coordinated checkout for appointment: {}", appointmentId);

        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isEmpty()) {
            throw new IllegalArgumentException("Appointment not found: " + appointmentId);
        }

        Appointment appointment = appointmentOpt.get();

        // 1. Orchestrate Appointment Service State Transition
        appointment.setStatus("Completed");
        appointment.setDiagnosis(diagnosis);
        appointment.setNotes(notes);
        if (fee != null) appointment.setFee(fee);
        appointmentRepository.save(appointment);

        // 2. Orchestrate Asynchronous Event Choreography
        AppointmentCompletedEvent event = new AppointmentCompletedEvent(
                appointment.getId(),
                appointment.getPatientId(),
                appointment.getDoctorId(),
                appointment.getDoctorName(),
                appointment.getDate(),
                appointment.getFee(),
                diagnosis,
                notes
        );
        kafkaProducerService.publishAppointmentCompleted(event);

        // 3. Assemble Orchestration Response
        Map<String, Object> result = new HashMap<>();
        result.put("orchestrationId", "orch-" + System.currentTimeMillis());
        result.put("pattern", "Synchronous Orchestration + Event Choreography Bridge");
        result.put("appointmentId", appointment.getId());
        result.put("patientId", appointment.getPatientId());
        result.put("doctorId", appointment.getDoctorId());
        result.put("appointmentStatus", "COMPLETED");
        result.put("clinicalRecordStatus", "RECORDED");
        result.put("billingStatus", "DISPATCHED_TO_KAFKA");
        result.put("fee", appointment.getFee());
        result.put("success", true);

        log.info("[SOA Orchestration] Successfully finished checkout orchestration for appointment: {}", appointmentId);
        return result;
    }
}
