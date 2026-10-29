package com.klu.appointment;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.klu.appointment.model.Appointment;
import com.klu.appointment.repository.AppointmentRepository;

import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AppointmentServiceTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @BeforeEach
    void setupUpcomingAppointment() {
        appointmentRepository.findAll().stream()
                .filter(a -> "d3".equals(a.getDoctorId()) && "2023-11-20".equals(a.getDate()) && "11:00".equals(a.getTime()))
                .forEach(appointmentRepository::delete);

        Optional<Appointment> opt = appointmentRepository.findById("a1");
        if (opt.isPresent()) {
            Appointment a1 = opt.get();
            a1.setStatus("Upcoming");
            appointmentRepository.save(a1);
        } else {
            Appointment a1 = new Appointment(
                    "a1", "u1", "d1", "Dr. Sarah Jenkins", "Cardiology",
                    "2023-10-15", "14:00", "Upcoming", "Routine Heart Checkup", 150.00
            );
            appointmentRepository.save(a1);
        }
    }

    @Test
    void testGetAppointments_ReturnsList() throws Exception {
        mockMvc.perform(get("/api/appointments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))));
    }

    @Test
    void testBookAppointment_ValidSlot_ReturnsCreated() throws Exception {
        String payload = """
            {
                "patientId": "u1",
                "doctorId": "d3",
                "doctorName": "Dr. Emily Chen",
                "specialty": "Dermatology",
                "date": "2023-11-20",
                "time": "11:00",
                "reason": "Skin screening"
            }
            """;

        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.status", is("Upcoming")));
    }

    @Test
    void testBookAppointment_ConflictSlot_Returns409Conflict() throws Exception {
        // Attempt to book Dr. Sarah Jenkins (d1) on 2023-10-15 at 14:00 which already exists in seed data
        String conflictPayload = """
            {
                "patientId": "u2",
                "doctorId": "d1",
                "doctorName": "Dr. Sarah Jenkins",
                "specialty": "Cardiology",
                "date": "2023-10-15",
                "time": "14:00",
                "reason": "Double booking test"
            }
            """;

        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(conflictPayload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.error", containsString("Schedule conflict")));
    }

    @Test
    void testCompleteAppointment_PublishesKafkaEvent() throws Exception {
        String completePayload = """
            {
                "diagnosis": "Cardiovascular stability confirmed",
                "notes": "ECG within normal parameters",
                "fee": 150.0
            }
            """;

        mockMvc.perform(post("/api/appointments/a1/complete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(completePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("published to Kafka")))
                .andExpect(jsonPath("$.appointment.status", is("Completed")));
    }

    @Test
    void testOrchestratedCheckout_DemonstratesCoordinatedFlow() throws Exception {
        String orchPayload = """
            {
                "appointmentId": "a2",
                "notes": "Annual physical review completed",
                "diagnosis": "Healthy",
                "fee": 80.0
            }
            """;

        mockMvc.perform(post("/api/appointments/orchestrated-checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(orchPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.pattern", containsString("Synchronous Orchestration")))
                .andExpect(jsonPath("$.appointmentStatus", is("COMPLETED")));
    }
}
