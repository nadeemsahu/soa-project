package com.klu.billing;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class BillingServiceTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BillRepository billRepository;

    @BeforeEach
    void setupBills() {
        billRepository.findByAppointmentId("a999").ifPresent(billRepository::delete);
    }

    @Test
    void testGetAllBills_ReturnsListWithCalculations() throws Exception {
        mockMvc.perform(get("/api/billing"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$[0].tax", notNullValue()))
                .andExpect(jsonPath("$[0].totalAmount", notNullValue()));
    }

    @Test
    void testGetPatientBills_OwnBills_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/billing/patient/u1")
                .header("X-User-Id", "u1")
                .header("X-User-Role", "ROLE_PATIENT"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void testGetPatientBills_IDOR_AttemptToAccessOtherPatient_ReturnsForbidden() throws Exception {
        // Patient u1 attempts to access patient u2's private bills
        mockMvc.perform(get("/api/billing/patient/u2")
                .header("X-User-Id", "u1")
                .header("X-User-Role", "ROLE_PATIENT"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", containsString("Insecure Direct Object Reference (IDOR)")));
    }

    @Test
    void testPayBill_TransitionsStatusToPaid() throws Exception {
        mockMvc.perform(post("/api/billing/b2/pay"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is("b2")))
                .andExpect(jsonPath("$.status", is("Paid")));
    }

    @Test
    void testGenerateBillFromEvent_CalculatesTaxAndTotal() throws Exception {
        String eventPayload = """
            {
                "appointmentId": "a999",
                "patientId": "u1",
                "doctorId": "d1",
                "doctorName": "Dr. Sarah Jenkins",
                "date": "2023-11-25",
                "fee": 200.0,
                "diagnosis": "Hypertension Assessment",
                "notes": "Prescription issued"
            }
            """;

        mockMvc.perform(post("/api/billing/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(eventPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.appointmentId", is("a999")))
                .andExpect(jsonPath("$.amount", is(200.0)))
                .andExpect(jsonPath("$.tax", is(10.0))) // 5% of 200
                .andExpect(jsonPath("$.totalAmount", is(210.0)))
                .andExpect(jsonPath("$.status", is("Pending")));
    }
}
