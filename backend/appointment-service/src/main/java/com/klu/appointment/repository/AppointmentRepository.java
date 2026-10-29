package com.klu.appointment.repository;

import com.klu.appointment.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {

    boolean existsByDoctorIdAndDateAndTimeAndStatus(String doctorId, String date, String time, String status);

    List<Appointment> findByPatientIdOrderByDateDesc(String patientId);

    List<Appointment> findByDoctorIdOrderByDateDesc(String doctorId);
}
