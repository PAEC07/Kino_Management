package de.kinoapplikation.kino.service;

import de.kinoapplikation.kino.dto.AuthDtos;
import de.kinoapplikation.kino.entity.Benutzer;
import de.kinoapplikation.kino.repository.BenutzerRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final BenutzerRepository userRepo;
    private final BCryptPasswordEncoder encoder;

    public AuthService(BenutzerRepository userRepo, BCryptPasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest req) {
        String username = (req.username == null) ? "" : req.username.trim();
        String email = (req.email == null) ? "" : req.email.trim().toLowerCase();
        String password = (req.password == null) ? "" : req.password;
        String passwordConfirm = (req.passwordConfirm == null) ? "" : req.passwordConfirm;

        if (username.isBlank() || email.isBlank() || password.isBlank()) {
            return new AuthDtos.AuthResponse(false, "Bitte Username, Email und Passwort angeben.");
        }
        if (password.length() < 8) {
            return new AuthDtos.AuthResponse(false, "Passwort muss mindestens 8 Zeichen haben.");
        }
        if (!password.equals(passwordConfirm)) {
            return new AuthDtos.AuthResponse(false, "Passwörter stimmen nicht überein.");
        }
        if (userRepo.existsByUsername(username)) {
            return new AuthDtos.AuthResponse(false, "Username ist bereits vergeben.");
        }
        if (userRepo.existsByEmail(email)) {
            return new AuthDtos.AuthResponse(false, "E-Mail ist bereits registriert.");
        }

        String hash = encoder.encode(password);
        userRepo.save(new Benutzer(username, email, hash));

        return new AuthDtos.AuthResponse(true, "Registrierung erfolgreich.");
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest req) {
        String username = (req.username == null) ? "" : req.username.trim();
        String password = (req.password == null) ? "" : req.password;

        return userRepo.findByUsername(username)
                .map(u -> encoder.matches(password, u.getPasswordHash())
                        ? new AuthDtos.AuthResponse(true, "Login ok")
                        : new AuthDtos.AuthResponse(false, "Falsches Passwort"))
                .orElseGet(() -> new AuthDtos.AuthResponse(false, "User nicht gefunden"));
    }
}
