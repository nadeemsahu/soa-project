package com.apexcare.billing.kafka;

import com.apexcare.billing.event.AppointmentCompletedEvent;
import com.apexcare.billing.service.BillingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaBillingConsumer {

    private static final Logger log = LoggerFactory.getLogger(KafkaBillingConsumer.class);

    private final BillingService billingService;

    public KafkaBillingConsumer(BillingService billingService) {
        this.billingService = billingService;
    }

    /**
     * Section 11: Kafka Event Choreography Consumer
     * Listens to appointment-completed topic and triggers bill generation
     */
    @KafkaListener(topics = "appointment-completed", groupId = "apexcare-billing-group", autoStartup = "${apexcare.kafka.consumer.enabled:true}")
    public void handleAppointmentCompleted(AppointmentCompletedEvent event) {
        log.info("Received Kafka event [appointment-completed]: appointmentId={}, fee={}, patientId={}",
                event.getAppointmentId(), event.getFee(), event.getPatientId());
        try {
            billingService.createBillFromEvent(event);
        } catch (Exception e) {
            log.error("Failed to process appointment completed event for billing: {}", e.getMessage(), e);
        }
    }
}
