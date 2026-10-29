package com.klu.auth;

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
public class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    void testValidPatientLogin_ReturnsJwtToken() throws Exception {
        String payload = """
            {
                "identity": "PT-894120",
                "password": "password123"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.role", is("ROLE_PATIENT")))
                .andExpect(jsonPath("$.name", is("Eleanor Vance")));
    }

    @Test
    void testValidDoctorLogin_ReturnsDoctorRole() throws Exception {
        String payload = """
            {
                "identity": "dr.julian.vance@metrogeneral.org",
                "password": "password123"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role", is("ROLE_DOCTOR")));
    }

    @Test
    void testInvalidPassword_ReturnsUnauthorized() throws Exception {
        String payload = """
            {
                "identity": "PT-894120",
                "password": "wrongpassword"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", containsString("Invalid username or password")));
    }

    @Test
    void testValidateToken_ValidJwt_ReturnsClaims() throws Exception {
        String token = jwtUtil.generateToken("u1", "PT-894120", "ROLE_PATIENT", "Eleanor Vance");

        mockMvc.perform(get("/api/auth/validate")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid", is(true)))
                .andExpect(jsonPath("$.username", is("PT-894120")))
                .andExpect(jsonPath("$.role", is("ROLE_PATIENT")));
    }

    @Test
    void testValidateToken_InvalidJwt_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/validate")
                .header("Authorization", "Bearer invalid.tampered.token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testValidateToken_MissingHeader_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/validate"))
                .andExpect(status().isUnauthorized());
    }
}
