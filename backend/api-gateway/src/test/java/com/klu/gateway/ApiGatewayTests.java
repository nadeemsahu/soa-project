package com.klu.gateway;

import com.klu.gateway.filter.JwtAuthenticationFilter;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ApiGatewayTests {

    private static final String SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private JwtAuthenticationFilter filter;
    private GatewayFilterChain filterChain;

    @BeforeEach
    void setUp() {
        filter = new JwtAuthenticationFilter(SECRET);
        filterChain = mock(GatewayFilterChain.class);
        when(filterChain.filter(any())).thenReturn(Mono.empty());
    }

    private String generateTestToken(String userId, String role, String username) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);
        claims.put("username", username);

        return Jwts.builder()
                .subject(username)
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(key)
                .compact();
    }

    @Test
    void testOpenEndpoint_AllowsWithoutToken() {
        MockServerHttpRequest request = MockServerHttpRequest.get("/api/auth/login").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        filter.filter(exchange, filterChain).block();
        assertEquals(null, exchange.getResponse().getStatusCode());
    }

    @Test
    void testProtectedEndpoint_MissingToken_ReturnsUnauthorized() {
        MockServerHttpRequest request = MockServerHttpRequest.get("/api/patients/u1").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        filter.filter(exchange, filterChain).block();
        assertEquals(HttpStatus.UNAUTHORIZED, exchange.getResponse().getStatusCode());
    }

    @Test
    void testProtectedEndpoint_InvalidToken_ReturnsUnauthorized() {
        MockServerHttpRequest request = MockServerHttpRequest.get("/api/patients/u1")
                .header(HttpHeaders.AUTHORIZATION, "Bearer invalid.token.value")
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        filter.filter(exchange, filterChain).block();
        assertEquals(HttpStatus.UNAUTHORIZED, exchange.getResponse().getStatusCode());
    }

    @Test
    void testProtectedEndpoint_ValidToken_InjectsDownstreamHeaders() {
        String token = generateTestToken("u1", "ROLE_PATIENT", "PT-894120");

        MockServerHttpRequest request = MockServerHttpRequest.get("/api/patients/u1")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        when(filterChain.filter(any())).thenAnswer(invocation -> {
            org.springframework.web.server.ServerWebExchange passedExchange = invocation.getArgument(0);
            assertEquals("u1", passedExchange.getRequest().getHeaders().getFirst("X-User-Id"));
            assertEquals("ROLE_PATIENT", passedExchange.getRequest().getHeaders().getFirst("X-User-Role"));
            return Mono.empty();
        });

        filter.filter(exchange, filterChain).block();
    }
}
