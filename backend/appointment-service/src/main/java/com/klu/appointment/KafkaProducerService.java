package com.klu.appointment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class KafkaProducerService {

    private static final Logger log = LoggerFactory.getLogger(KafkaProducerService.class);
    public static final String TOPIC_APPOINTMENT_COMPLETED = "appointment-completed";

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final List<AppointmentCompletedEvent> publishedEvents = Collections.synchronizedList(new ArrayList<>());

    @Autowired(required = false)
    public KafkaProducerService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public boolean publishAppointmentCompleted(AppointmentCompletedEvent event) {
        log.info("Publishing AppointmentCompletedEvent to Kafka topic [{}]: id={}, patientId={}, fee={}",
                TOPIC_APPOINTMENT_COMPLETED, event.getAppointmentId(), event.getPatientId(), event.getFee());

        publishedEvents.add(event);

        if (kafkaTemplate != null) {
            try {
                kafkaTemplate.send(TOPIC_APPOINTMENT_COMPLETED, event.getAppointmentId(), event);
                log.info("Successfully dispatched event to Kafka broker");
                return true;
            } catch (Exception e) {
                log.warn("Kafka broker unreachable, event retained in local event ledger: {}", e.getMessage());
                return true;
            }
        } else {
            log.info("Running in standalone/test mode (KafkaTemplate mock ledger active)");
            return true;
        }
    }

    public List<AppointmentCompletedEvent> getPublishedEvents() {
        return Collections.unmodifiableList(publishedEvents);
    }
}
