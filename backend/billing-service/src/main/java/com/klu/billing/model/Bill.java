package com.klu.billing.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    private String id;
    private String appointmentId;
    private String patientId;
    private String date;
    private Double amount;
    private Double tax;
    private Double totalAmount;
    private String status; // "Pending", "Paid"
    private String description;

    public Bill() {}

    public Bill(String id, String appointmentId, String patientId, String date, Double amount, String status, String description) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.date = date;
        this.amount = amount != null ? amount : 150.00;
        this.tax = Math.round(this.amount * 0.05 * 100.0) / 100.0; // 5% facility tax
        this.totalAmount = Math.round((this.amount + this.tax) * 100.0) / 100.0;
        this.status = status != null ? status : "Pending";
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) {
        this.amount = amount;
        this.tax = Math.round(this.amount * 0.05 * 100.0) / 100.0;
        this.totalAmount = Math.round((this.amount + this.tax) * 100.0) / 100.0;
    }

    public Double getTax() { return tax; }
    public void setTax(Double tax) { this.tax = tax; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
