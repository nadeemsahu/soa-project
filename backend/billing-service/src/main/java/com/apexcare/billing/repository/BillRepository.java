package com.apexcare.billing.repository;

import com.apexcare.billing.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, String> {
    List<Bill> findByPatientIdOrderByDateDesc(String patientId);
    boolean existsByAppointmentId(String appointmentId);
}
