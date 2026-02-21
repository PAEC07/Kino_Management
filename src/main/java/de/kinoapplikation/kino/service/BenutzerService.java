package de.kinoapplikation.kino.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import de.kinoapplikation.kino.dto.AuthDtos;
import de.kinoapplikation.kino.entity.Benutzer;
import de.kinoapplikation.kino.repository.BenutzerRepository;
import de.kinoapplikation.kino.security.JwtUtil;

@Service
public class BenutzerService {

    private final BenutzerRepository benutzerRepo;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public BenutzerService(BenutzerRepository benutzerRepo, BCryptPasswordEncoder encoder, JwtUtil jwtUtil) {
        this.benutzerRepo = benutzerRepo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
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
        if (benutzerRepo.existsByUsername(username)) {
            return new AuthDtos.AuthResponse(false, "Username ist bereits vergeben.");
        }
        if (benutzerRepo.existsByEmail(email)) {
            return new AuthDtos.AuthResponse(false, "E-Mail ist bereits registriert.");
        }

        String hash = encoder.encode(password);
        Benutzer saved = benutzerRepo.save(new Benutzer(username, email, hash));

        // Standard USER
        saved.setRole("USER");
        benutzerRepo.save(saved);

        return new AuthDtos.AuthResponse(true, "Registrierung erfolgreich.");
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest req) {
        String username = (req.username == null) ? "" : req.username.trim();
        String password = (req.password == null) ? "" : req.password;

        return benutzerRepo.findByUsername(username)
                .map(u -> {
                    boolean ok = encoder.matches(password, u.getPasswordHash());
                    if (!ok) return new AuthDtos.AuthResponse(false, "Falsches Passwort");

                    String role = (u.getRole() == null || u.getRole().isBlank()) ? "USER" : u.getRole().trim().toUpperCase();
                    String token = jwtUtil.generateToken(u.getId(), u.getUsername(), role);

                    return new AuthDtos.AuthResponse(
                            true,
                            "Login ok",
                            u.getId(),
                            u.getUsername(),
                            u.getEmail(),
                            role,
                            token
                    );
                })
                .orElseGet(() -> new AuthDtos.AuthResponse(false, "User nicht gefunden"));
    }

    public Benutzer datenAendern(Long id, AuthDtos.UpdateRequest req) {
        if (id == null) throw new IllegalArgumentException("ID darf nicht null sein");

        Benutzer benutzer = benutzerRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden"));

        if (req.username != null && !req.username.isBlank()) {
            benutzer.setUsername(req.username);
        }
        if (req.email != null && !req.email.isBlank()) {
            benutzer.setEmail(req.email);
        }
        if (req.password != null && !req.password.isBlank()) {
            benutzer.setPasswordHash(encoder.encode(req.password));
        }
        return benutzerRepo.save(benutzer);
    }

    public List<Benutzer> alleBenutzer() {
        return benutzerRepo.findAll();
    }

    public Benutzer benutzerById(Long id) {
        if (id == null) throw new IllegalArgumentException("ID cannot be null");
        return benutzerRepo.findById(id).orElse(null);
    }
}
