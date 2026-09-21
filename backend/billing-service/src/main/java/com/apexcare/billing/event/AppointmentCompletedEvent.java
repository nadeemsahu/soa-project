package com.apexcare.billing.event;

import java.io.Serializable;

public class AppointmentCompletedEvent implements Serializable {
    private String appointmentId;
    private String patientId;
    private String doctorId;
    private String doctorName;
    private String date;
    private Double fee;
    private String diagnosis;
    private String notes;

    public AppointmentCompletedEvent() {}

    public AppointmentCompletedEvent(String appointmentId, String patientId, String doctorId,
                                   String doctorName, String date, Double fee, String diagnosis, String notes) {
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.date = date;
        this.fee = fee;
        this.diagnosis = diagnosis;
        this.notes = notes;
    }

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Double getFee() { return fee; }
    public void setFee(Double fee) { this.fee = fee; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
