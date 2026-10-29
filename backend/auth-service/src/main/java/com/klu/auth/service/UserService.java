package com.klu.auth.service;

import com.klu.auth.model.User;
import com.klu.auth.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Map<String, User> aliasStore = new ConcurrentHashMap<>();

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        initUsers();
    }

    private void initUsers() {
        String encodedPw = passwordEncoder.encode("password123");

        User patient = new User("u1", "PT-894120", encodedPw, "ROLE_PATIENT", "Eleanor Vance", "eleanor.vance@example.com");
        User doctor = new User("d1", "dr.julian.vance@metrogeneral.org", encodedPw, "ROLE_DOCTOR", "Dr. Sarah Jenkins", "sarah.jenkins@apexcare.com");
        User billing = new User("b1", "revcycle.jvance@apexcare.org", encodedPw, "ROLE_BILLING_STAFF", "Julian Vance", "revcycle.jvance@apexcare.org");
        User admin = new User("adm1", "sec.admin@apexcare.net", encodedPw, "ROLE_ADMIN", "Security Admin", "sec.admin@apexcare.net");

        if (userRepository.count() == 0) {
            userRepository.save(patient);
            userRepository.save(doctor);
            userRepository.save(billing);
            userRepository.save(admin);
        }

        // Aliases for quick role-based login tests
        aliasStore.put("patient", patient);
        aliasStore.put("doctor", doctor);
        aliasStore.put("billing_staff", billing);
        aliasStore.put("billing", billing);
        aliasStore.put("admin", admin);
        aliasStore.put("administrator", admin);
    }

    public Optional<User> findByIdentity(String identity) {
        if (identity == null) return Optional.empty();
        String trimmed = identity.trim().toLowerCase();

        // 1. Direct username match in PostgreSQL
        Optional<User> byUsername = userRepository.findByUsernameIgnoreCase(trimmed);
        if (byUsername.isPresent()) return byUsername;

        // 2. Direct role match in PostgreSQL
        String roleQuery = trimmed.startsWith("role_") ? trimmed : "role_" + trimmed;
        Optional<User> byRole = userRepository.findByRoleIgnoreCase(roleQuery);
        if (byRole.isPresent()) return byRole;

        // 3. Fallback to aliases
        return Optional.ofNullable(aliasStore.get(trimmed));
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    public User registerUser(String username, String rawPassword, String role, String name, String email) {
        String id = "u" + (userRepository.count() + 1);
        String formattedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role.toUpperCase();
        User user = new User(id, username, passwordEncoder.encode(rawPassword), formattedRole, name, email);
        return userRepository.save(user);
    }
}
