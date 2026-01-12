package de.kinoapplikation.kino.entity;

import jakarta.persistence.*;

/**
 * Entität für Accounts im Kino-System.
 * Enthält Informationen über Benutzerkonten wie Benutzername, Passwort und E-Mail.
 * @author Niklas
 */

@Entity
public class Accounts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long accountId;
    private String benutzername;
    private String password;
    private String email;

    // Getter & Setter
    public Long getId() {
        return accountId;
    }
    public void setId(Long accountId) {
        this.accountId = accountId;
    }
    public String getBenutzername() {
        return benutzername;
    }
    public void setBenutzername(String benutzername) {
        this.benutzername = benutzername;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
}
