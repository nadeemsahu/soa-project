package com.apexcare.appointment;

import com.apexcare.appointment.model.Appointment;
import com.apexcare.appointment.repository.AppointmentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class AppointmentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AppointmentServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner initAppointments(AppointmentRepository appointmentRepository) {
        return args -> {
            Appointment a1 = new Appointment(
                    "a1", "u1", "d1", "Dr. Sarah Jenkins", "Cardiology",
                    "2023-10-15", "14:00", "Upcoming", "Routine Heart Checkup", 150.00
            );
            Appointment a2 = new Appointment(
                    "a2", "u1", "d2", "Dr. Marcus Vance", "General Practice",
                    "2023-09-10", "09:30", "Completed", "Annual Physical", 80.00
            );
            Appointment a3 = new Appointment(
                    "a3", "u2", "d1", "Dr. Sarah Jenkins", "Cardiology",
                    "2023-08-05", "11:00", "Cancelled", "Skin rash consultation", 150.00
            );

            appointmentRepository.save(a1);
            appointmentRepository.save(a2);
            appointmentRepository.save(a3);
        };
    }
}
