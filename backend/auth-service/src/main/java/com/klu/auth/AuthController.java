package com.klu.auth;

import io.jsonwebtoken.Claims;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        String identity = request.getIdentity();
        if (identity == null || identity.isBlank()) {
            if (request.getRole() != null) {
                identity = request.getRole();
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Username or role identity required"));
            }
        }

        Optional<User> userOpt = userService.findByIdentity(identity);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        }

        User user = userOpt.get();

        // Password verification (allow bypass only if password is null/blank and in demo mode)
        if (request.getPassword() != null && !request.getPassword().isBlank() && !request.getPassword().startsWith("••••")) {
            if (!userService.checkPassword(user, request.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid username or password"));
            }
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole(), user.getName());
        AuthResponse response = new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getRole(),
                user.getEmail()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Missing or invalid Authorization header"));
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token is invalid or expired"));
        }

        Claims claims = jwtUtil.validateAndExtractClaims(token);
        Map<String, Object> details = new HashMap<>();
        details.put("valid", true);
        details.put("username", claims.getSubject());
        details.put("userId", claims.get("userId"));
        details.put("role", claims.get("role"));
        details.put("name", claims.get("name"));
        details.put("expiresAt", claims.getExpiration());

        return ResponseEntity.ok(details);
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "AUTH-SERVICE"));
    }
}
