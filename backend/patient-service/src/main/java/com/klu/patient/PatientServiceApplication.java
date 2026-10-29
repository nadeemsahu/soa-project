package com.klu.patient;

import com.klu.patient.model.Doctor;
import com.klu.patient.model.MedicalRecord;
import com.klu.patient.model.Patient;
import com.klu.patient.repository.DoctorRepository;
import com.klu.patient.repository.MedicalRecordRepository;
import com.klu.patient.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class PatientServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PatientServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(PatientRepository patientRepository,
                                      MedicalRecordRepository recordRepository,
                                      DoctorRepository doctorRepository) {
        return args -> {
            // Seed patients only if empty
            if (patientRepository.count() == 0) {
                Patient u1 = new Patient("u1", "Eleanor Vance", 42, "Female", "O+", "Penicillin, Peanuts", "eleanor.vance@example.com");
                Patient u2 = new Patient("u2", "Marcus Vance", 18, "Male", "A+", "None", "marcus.vance@example.com");
                patientRepository.save(u1);
                patientRepository.save(u2);
            }

            // Seed medical records only if empty
            if (recordRepository.count() == 0) {
                MedicalRecord m1 = new MedicalRecord(
                        "m1", "u1", "2023-09-10", "Dr. Marcus Vance",
                        "Healthy adult",
                        "Patient is healthy. Blood pressure normal. Recommended continued regular exercise."
                );
                recordRepository.save(m1);
            }

            // Seed doctors only if empty
            if (doctorRepository.count() == 0) {
                Doctor d1 = new Doctor("d1", "Dr. Sarah Jenkins", "Cardiology", "12 years", 150.00,
                        "Today, 2:00 PM", "sarah.jenkins@apexcare.com", "SJ");
                Doctor d2 = new Doctor("d2", "Dr. Marcus Vance", "General Practice", "8 years", 80.00,
                        "Tomorrow, 9:30 AM", "m.vance@apexcare.com", "MV");
                Doctor d3 = new Doctor("d3", "Dr. Emily Chen", "Dermatology", "15 years", 120.00,
                        "Oct 14, 11:00 AM", "emily.chen@apexcare.com", "EC");
                Doctor d4 = new Doctor("d4", "Dr. Robert Hale", "Orthopedics", "20 years", 180.00,
                        "Oct 15, 3:15 PM", "robert.hale@apexcare.com", "RH");
                doctorRepository.save(d1);
                doctorRepository.save(d2);
                doctorRepository.save(d3);
                doctorRepository.save(d4);
            }
        };
    }
}
