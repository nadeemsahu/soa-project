package com.klu.patient;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    private String id;
    private String name;
    private String specialty;
    private String experience;
    private Double fee;
    private String nextAvailable;
    private String email;
    private String image; // Initials

    public Doctor() {}

    public Doctor(String id, String name, String specialty, String experience, Double fee, String nextAvailable, String email, String image) {
        this.id = id;
        this.name = name;
        this.specialty = specialty;
        this.experience = experience;
        this.fee = fee;
        this.nextAvailable = nextAvailable;
        this.email = email;
        this.image = image;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public Double getFee() { return fee; }
    public void setFee(Double fee) { this.fee = fee; }

    public String getNextAvailable() { return nextAvailable; }
    public void setNextAvailable(String nextAvailable) { this.nextAvailable = nextAvailable; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
