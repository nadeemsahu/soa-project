package com.klu.billing;

import com.klu.billing.model.Bill;
import com.klu.billing.repository.BillRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class BillingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BillingServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner initBilling(BillRepository billRepository) {
        return args -> {
            if (billRepository.count() == 0) {
                Bill b1 = new Bill("b1", "a2", "u1", "2023-09-10", 80.00, "Paid", "Consultation Fee - Routine Physical");
                Bill b2 = new Bill("b2", "a1", "u1", "2023-10-15", 150.00, "Pending", "Consultation Fee - Cardiology Review");

                billRepository.save(b1);
                billRepository.save(b2);
            }
        };
    }
}
