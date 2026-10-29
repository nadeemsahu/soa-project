package com.klu.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, String> {
    List<Bill> findByPatientIdOrderByDateDesc(String patientId);
    boolean existsByAppointmentId(String appointmentId);
    Optional<Bill> findByAppointmentId(String appointmentId);
    void deleteByAppointmentId(String appointmentId);
}
