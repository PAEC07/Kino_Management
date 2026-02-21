package de.kinoapplikation.kino.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.kinoapplikation.kino.dto.AuthDtos;
import de.kinoapplikation.kino.entity.Benutzer;
import de.kinoapplikation.kino.service.BenutzerService;

/**
 * Endpoints:
 * - GET /api/benutzer/list > Alle Benutzer auflisten
 * - GET /api/benutzer/{id}/get > Benutzer mit bestimmter ID abrufen
 * - PUT /api/benutzer/{id}/change > Benutzerdaten ändern
 * - POST /api/benutzer/register > Neuen Benutzer registrieren
 * - POST /api/benutzer/login > Benutzer anmelden
 */

@RestController
@RequestMapping("/api/benutzer")
public class BenutzerController {

    private final BenutzerService benutzerService;

    public BenutzerController(BenutzerService benutzerService) {
        this.benutzerService = benutzerService;
    }

    @GetMapping("/list")
    public List<Benutzer> alleBenutzer() {
        return benutzerService.alleBenutzer();
    }

    @PutMapping("/{id}/change")
    public ResponseEntity<Benutzer> datenAendern(@PathVariable Long id, @RequestBody AuthDtos.UpdateRequest req) {
        try {
            Benutzer updated = benutzerService.datenAendern(id, req);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/get")
    public ResponseEntity<Benutzer> benutzerById(@PathVariable Long id) {
        Benutzer b = benutzerService.benutzerById(id);
        if (b != null) {
            return ResponseEntity.ok(b);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDtos.AuthResponse> register(@RequestBody AuthDtos.RegisterRequest req) {
        AuthDtos.AuthResponse resp = benutzerService.register(req);

        if (resp.ok) {
            return ResponseEntity.ok(resp);
        }

        if (resp.message.contains("bereits")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(resp);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDtos.AuthResponse> login(@RequestBody AuthDtos.LoginRequest req) {
        AuthDtos.AuthResponse resp = benutzerService.login(req);
        if (resp.ok) {
            return ResponseEntity.ok(resp);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
    }
}
