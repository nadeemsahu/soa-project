package com.apexcare.patient;

import com.apexcare.patient.model.MedicalRecord;
import com.apexcare.patient.model.Patient;
import com.apexcare.patient.repository.MedicalRecordRepository;
import com.apexcare.patient.repository.PatientRepository;
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
    public CommandLineRunner initData(PatientRepository patientRepository, MedicalRecordRepository recordRepository) {
        return args -> {
            Patient u1 = new Patient("u1", "Eleanor Vance", 42, "Female", "O+", "Penicillin, Peanuts", "eleanor.vance@example.com");
            Patient u2 = new Patient("u2", "Marcus Vance", 18, "Male", "A+", "None", "marcus.vance@example.com");
            patientRepository.save(u1);
            patientRepository.save(u2);

            MedicalRecord m1 = new MedicalRecord(
                    "m1",
                    "u1",
                    "2023-09-10",
                    "Dr. Marcus Vance",
                    "Healthy adult",
                    "Patient is healthy. Blood pressure normal. Recommended continued regular exercise."
            );
            recordRepository.save(m1);
        };
    }
}
