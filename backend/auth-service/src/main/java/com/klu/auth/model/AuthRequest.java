package com.klu.auth.model;

public class AuthRequest {
    private String identity;
    private String username;
    private String password;
    private String role;

    public AuthRequest() {}

    public AuthRequest(String identity, String password, String role) {
        this.identity = identity;
        this.username = identity;
        this.password = password;
        this.role = role;
    }

    public String getIdentity() {
        return identity != null && !identity.isEmpty() ? identity : username;
    }
    public void setIdentity(String identity) {
        this.identity = identity;
        if (this.username == null) this.username = identity;
    }

    public String getUsername() {
        return username != null && !username.isEmpty() ? username : identity;
    }
    public void setUsername(String username) {
        this.username = username;
        if (this.identity == null) this.identity = username;
    }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
