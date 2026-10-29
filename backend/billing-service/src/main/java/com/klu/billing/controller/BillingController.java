package com.klu.billing.controller;

import com.klu.billing.event.AppointmentCompletedEvent;
import com.klu.billing.model.Bill;
import com.klu.billing.service.BillingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills(
            @RequestParam(value = "patientId", required = false) String patientId) {
        if (patientId != null && !patientId.isBlank()) {
            return ResponseEntity.ok(billingService.getBillsByPatientId(patientId));
        }
        return ResponseEntity.ok(billingService.getAllBills());
    }

    /**
     * CO-2 Requirement: Resource-level Authorization / IDOR Protection
     * Patients may only view their own billing statements
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getBillsByPatient(
            @PathVariable("patientId") String patientId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestHeader(value = "X-User-Role", required = false) String headerRole) {

        if (headerRole != null && headerRole.toUpperCase().contains("PATIENT")) {
            if (headerUserId != null && !headerUserId.equalsIgnoreCase(patientId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access Denied: Insecure Direct Object Reference (IDOR) violation. You cannot view another patient's billing data."));
            }
        }

        return ResponseEntity.ok(billingService.getBillsByPatientId(patientId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBillById(@PathVariable("id") String id) {
        Optional<Bill> opt = billingService.getBillById(id);
        return opt.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Bill not found: " + id)));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<?> payBill(@PathVariable("id") String id) {
        try {
            Bill updated = billingService.payBill(id);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateBill(@RequestBody AppointmentCompletedEvent event) {
        Bill bill = billingService.createBillFromEvent(event);
        if (bill == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Bill already exists for this appointment"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(bill);
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "BILLING-SERVICE"));
    }
}
