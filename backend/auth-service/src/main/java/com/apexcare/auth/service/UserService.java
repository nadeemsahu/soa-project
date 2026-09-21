package com.apexcare.auth.service;

import com.apexcare.auth.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final Map<String, User> userStore = new ConcurrentHashMap<>();
    private final PasswordEncoder passwordEncoder;

    public UserService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        initUsers();
    }

    private void initUsers() {
        String encodedPw = passwordEncoder.encode("password123");

        User patient = new User("u1", "PT-894120", encodedPw, "ROLE_PATIENT", "Eleanor Vance", "eleanor.vance@example.com");
        User doctor = new User("d1", "dr.julian.vance@metrogeneral.org", encodedPw, "ROLE_DOCTOR", "Dr. Sarah Jenkins", "sarah.jenkins@apexcare.com");
        User billing = new User("b1", "revcycle.jvance@apexcare.org", encodedPw, "ROLE_BILLING_STAFF", "Julian Vance", "revcycle.jvance@apexcare.org");
        User admin = new User("adm1", "sec.admin@apexcare.net", encodedPw, "ROLE_ADMIN", "Security Admin", "sec.admin@apexcare.net");

        userStore.put(patient.getUsername().toLowerCase(), patient);
        userStore.put(doctor.getUsername().toLowerCase(), doctor);
        userStore.put(billing.getUsername().toLowerCase(), billing);
        userStore.put(admin.getUsername().toLowerCase(), admin);

        // Also index by role for quick frontend testing
        userStore.put("patient", patient);
        userStore.put("doctor", doctor);
        userStore.put("billing_staff", billing);
        userStore.put("billing", billing);
        userStore.put("admin", admin);
        userStore.put("administrator", admin);
    }

    public Optional<User> findByIdentity(String identity) {
        if (identity == null) return Optional.empty();
        return Optional.ofNullable(userStore.get(identity.trim().toLowerCase()));
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    public User registerUser(String username, String rawPassword, String role, String name, String email) {
        String id = "u" + (userStore.size() + 1);
        String formattedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role.toUpperCase();
        User user = new User(id, username, passwordEncoder.encode(rawPassword), formattedRole, name, email);
        userStore.put(username.toLowerCase(), user);
        return user;
    }
}
