package de.kinoapplikation.kino.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * Utility-Klasse für JWT-Token Generation und Validierung.
 * 
 * Verantwortlich für:
 * - Generierung von signierten JWT-Tokens mit HMAC SHA-256
 * - Validierung und Parsing von Token-Signatures
 * - Extraktion von Claims (userId, username, role)
 * - Token-Expiration-Handling
 * 
 * Token-Payload enthält:
 * - subject: userId (Benutzer ID)
 * - username: Benutzername
 * - role: Benutzerrolle (USER oder ADMIN)
 * - issuedAt: Zeitstempel der Erstellung
 * - expiration: Ablaufzeit (konfigurierbar via kino.jwt.expirationMinutes)
 * Der Secret-Key wird mit HS256 (HMAC SHA-256) signiert und muss mindestens 32 Zeichen lang sein.
 * 
 * @see JwtAuthFilter für die Verwendung in Request-Filtern
 */
@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationMillis;

    public JwtUtil(
            @Value("${kino.jwt.secret}") String secret,
            @Value("${kino.jwt.expirationMinutes:720}") long expirationMinutes) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMillis = expirationMinutes * 60_000L;
    }

    public String generateToken(Long userId, String username, String role) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("username", username)
                .claim("role", role) // "USER" oder "ADMIN"
                .issuedAt(now)
                .expiration(exp)
                .signWith(key)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
