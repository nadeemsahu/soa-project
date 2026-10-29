package com.klu.auth.model;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String userId;
    private String username;
    private String name;
    private String role;
    private String email;

    public AuthResponse() {}

    public AuthResponse(String token, String userId, String username, String name, String role, String email) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.name = name;
        this.role = role;
        this.email = email;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
