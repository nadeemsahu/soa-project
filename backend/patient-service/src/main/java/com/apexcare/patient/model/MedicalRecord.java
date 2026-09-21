package com.apexcare.patient.model;

import jakarta.persistence.*;

@Entity
@Table(name = "medical_records")
public class MedicalRecord {

    @Id
    private String id;
    private String patientId;
    private String date;
    private String doctorName;
    private String diagnosis;

    @Column(length = 2000)
    private String notes;

    public MedicalRecord() {}

    public MedicalRecord(String id, String patientId, String date, String doctorName, String diagnosis, String notes) {
        this.id = id;
        this.patientId = patientId;
        this.date = date;
        this.doctorName = doctorName;
        this.diagnosis = diagnosis;
        this.notes = notes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
