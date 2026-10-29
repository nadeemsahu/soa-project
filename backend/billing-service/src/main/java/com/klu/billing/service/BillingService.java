package com.klu.billing.service;

import com.klu.billing.event.AppointmentCompletedEvent;
import com.klu.billing.model.Bill;
import com.klu.billing.repository.BillRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillingService {

    private static final Logger log = LoggerFactory.getLogger(BillingService.class);

    private final BillRepository billRepository;

    public BillingService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public List<Bill> getBillsByPatientId(String patientId) {
        return billRepository.findByPatientIdOrderByDateDesc(patientId);
    }

    public Optional<Bill> getBillById(String billId) {
        return billRepository.findById(billId);
    }

    /**
     * Section 11 & 16: Event Choreography Bill Generator
     * Generates authoritative invoice upon receiving AppointmentCompletedEvent
     */
    public Bill createBillFromEvent(AppointmentCompletedEvent event) {
        // Idempotency check: prevent duplicate billing for the same appointment
        if (event.getAppointmentId() != null && billRepository.existsByAppointmentId(event.getAppointmentId())) {
            log.info("Bill already exists for appointment {}, skipping duplicate event", event.getAppointmentId());
            return null;
        }

        String billId = "b" + System.currentTimeMillis();
        String description = "Consultation - " + (event.getDiagnosis() != null ? event.getDiagnosis() : "Standard Review");
        Double amount = event.getFee() != null ? event.getFee() : 150.00;

        Bill bill = new Bill(
                billId,
                event.getAppointmentId(),
                event.getPatientId(),
                event.getDate(),
                amount,
                "Pending",
                description
        );

        Bill saved = billRepository.save(bill);
        log.info("Choreographed Bill generated successfully: billId={}, amount={}, patientId={}",
                saved.getId(), saved.getAmount(), saved.getPatientId());
        return saved;
    }

    public Bill payBill(String billId) {
        Optional<Bill> opt = billRepository.findById(billId);
        if (opt.isEmpty()) {
            throw new IllegalArgumentException("Bill not found: " + billId);
        }
        Bill bill = opt.get();
        bill.setStatus("Paid");
        Bill updated = billRepository.save(bill);
        log.info("Bill status updated to PAID for id: {}", billId);
        return updated;
    }
}
