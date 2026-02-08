package de.kinoapplikation.kino.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "username" }),
        @UniqueConstraint(columnNames = { "email" })
})
public class Benutzer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    // bcrypt hash (niemals im JSON ausgeben!)
    @JsonIgnore
    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role = "USER";

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Benutzer() {}

    public Benutzer(String username, String email, String passwordHash) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    // --- Getter ---
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // --- Setter ---
    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Passwort nur intern benutzen (Service), nicht fürs JSON
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
}
