package com.klu.appointment.model;

import jakarta.persistence.*;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    private String id;
    private String patientId;
    private String doctorId;
    private String doctorName;
    private String specialty;
    private String date; // YYYY-MM-DD
    private String time; // e.g. "14:00" or "02:00 PM"
    private String status; // "Upcoming", "Completed", "Cancelled"
    private String reason;
    private Double fee;
    private String diagnosis;

    @Column(length = 2000)
    private String notes;

    public Appointment() {}

    public Appointment(String id, String patientId, String doctorId, String doctorName,
                       String specialty, String date, String time, String status, String reason, Double fee) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.specialty = specialty;
        this.date = date;
        this.time = time;
        this.status = status;
        this.reason = reason;
        this.fee = fee != null ? fee : 150.00;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Double getFee() { return fee != null ? fee : 150.00; }
    public void setFee(Double fee) { this.fee = fee; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
