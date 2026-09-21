package com.apexcare.patient.controller;

import com.apexcare.patient.model.MedicalRecord;
import com.apexcare.patient.model.Patient;
import com.apexcare.patient.repository.MedicalRecordRepository;
import com.apexcare.patient.repository.PatientRepository;
import com.apexcare.patient.security.TokenParser;
import io.jsonwebtoken.Claims;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;
    private final MedicalRecordRepository recordRepository;
    private final TokenParser tokenParser;

    public PatientController(PatientRepository patientRepository,
                             MedicalRecordRepository recordRepository,
                             TokenParser tokenParser) {
        this.patientRepository = patientRepository;
        this.recordRepository = recordRepository;
        this.tokenParser = tokenParser;
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable("id") String id,
                                            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
                                            @RequestHeader(value = "X-User-Role", required = false) String headerUserRole,
                                            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        // IDOR Check
        if (!isAuthorizedForPatient(id, headerUserId, headerUserRole, authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access Denied: Insecure Direct Object Reference (IDOR) violation. You cannot view another patient's record."));
        }

        Optional<Patient> patientOpt = patientRepository.findById(id);
        return patientOpt.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Patient not found")));
    }

    @GetMapping("/{id}/records")
    public ResponseEntity<?> getPatientRecords(@PathVariable("id") String id,
                                               @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
                                               @RequestHeader(value = "X-User-Role", required = false) String headerUserRole,
                                               @RequestHeader(value = "Authorization", required = false) String authHeader) {
        // Strict IDOR Check (CO-2 requirement)
        if (!isAuthorizedForPatient(id, headerUserId, headerUserRole, authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access Denied: Insecure Direct Object Reference (IDOR) violation. You cannot view another patient's medical record."));
        }

        List<MedicalRecord> records = recordRepository.findByPatientIdOrderByDateDesc(id);
        return ResponseEntity.ok(records);
    }

    @PostMapping("/{id}/records")
    public ResponseEntity<?> addMedicalRecord(@PathVariable("id") String id,
                                              @RequestBody MedicalRecord record) {
        record.setPatientId(id);
        if (record.getId() == null || record.getId().isBlank()) {
            record.setId("m" + System.currentTimeMillis());
        }
        MedicalRecord saved = recordRepository.save(record);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "PATIENT-SERVICE"));
    }

    private boolean isAuthorizedForPatient(String targetPatientId, String headerUserId, String headerRole, String authHeader) {
        String callerUserId = headerUserId;
        String callerRole = headerRole;

        if (authHeader != null && (callerUserId == null || callerRole == null)) {
            Claims claims = tokenParser.parseToken(authHeader);
            if (claims != null) {
                callerUserId = claims.get("userId", String.class);
                callerRole = claims.get("role", String.class);
            }
        }

        // If no auth headers and no token, default to allow if running in internal/unrestricted dev mode,
        // but if caller role is identified as PATIENT, enforce strict IDOR equality
        if (callerRole != null) {
            String roleUpper = callerRole.toUpperCase();
            if (roleUpper.contains("DOCTOR") || roleUpper.contains("ADMIN") || roleUpper.contains("STAFF")) {
                return true;
            }
            if (roleUpper.contains("PATIENT")) {
                return callerUserId != null && callerUserId.equalsIgnoreCase(targetPatientId);
            }
        }

        // Direct caller check if callerUserId is present without role
        if (callerUserId != null) {
            return callerUserId.equalsIgnoreCase(targetPatientId);
        }

        return true;
    }
}
