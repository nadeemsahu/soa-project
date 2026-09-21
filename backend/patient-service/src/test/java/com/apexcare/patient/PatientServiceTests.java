package com.apexcare.patient;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class PatientServiceTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetPatientById_Authorized_ReturnsPatient() throws Exception {
        mockMvc.perform(get("/api/patients/u1")
                .header("X-User-Id", "u1")
                .header("X-User-Role", "ROLE_PATIENT"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Eleanor Vance")))
                .andExpect(jsonPath("$.bloodGroup", is("O+")));
    }

    @Test
    void testGetPatientRecords_OwnRecords_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/patients/u1/records")
                .header("X-User-Id", "u1")
                .header("X-User-Role", "ROLE_PATIENT"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].doctorName", is("Dr. Marcus Vance")));
    }

    @Test
    void testGetPatientRecords_IDOR_AttemptToAccessOtherPatient_ReturnsForbidden() throws Exception {
        // Patient u1 attempts to access patient u2's private records
        mockMvc.perform(get("/api/patients/u2/records")
                .header("X-User-Id", "u1")
                .header("X-User-Role", "ROLE_PATIENT"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", containsString("Insecure Direct Object Reference (IDOR)")));
    }

    @Test
    void testGetPatientRecords_DoctorAccess_ReturnsOk() throws Exception {
        // Doctor is allowed to access any patient's records
        mockMvc.perform(get("/api/patients/u2/records")
                .header("X-User-Id", "d1")
                .header("X-User-Role", "ROLE_DOCTOR"))
                .andExpect(status().isOk());
    }

    @Test
    void testSoapWsdlAvailable() throws Exception {
        mockMvc.perform(get("/ws/patients.wsdl"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_XML))
                .andExpect(xpath("//*[local-name()='definitions']").exists());
    }

    @Test
    void testSoapGetPatientStatusOperation() throws Exception {
        String soapXml = """
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://apexcare.com/patient/soap">
               <soapenv:Header/>
               <soapenv:Body>
                  <soap:getPatientStatusRequest>
                     <soap:patientId>u1</soap:patientId>
                  </soap:getPatientStatusRequest>
               </soapenv:Body>
            </soapenv:Envelope>
            """;

        mockMvc.perform(post("/ws")
                .contentType("text/xml;charset=UTF-8")
                .content(soapXml))
                .andExpect(status().isOk())
                .andExpect(xpath("//*[local-name()='getPatientStatusResponse']").exists())
                .andExpect(xpath("//*[local-name()='status']").string("ACTIVE"))
                .andExpect(xpath("//*[local-name()='insuranceVerified']").string("true"));
    }
}
