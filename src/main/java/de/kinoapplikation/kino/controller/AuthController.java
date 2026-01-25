package de.kinoapplikation.kino.controller;

import de.kinoapplikation.kino.dto.AuthDtos;
import de.kinoapplikation.kino.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDtos.AuthResponse> register(@RequestBody AuthDtos.RegisterRequest req) {
        AuthDtos.AuthResponse resp = authService.register(req);

        if (resp.ok) return ResponseEntity.ok(resp);

        // simple Statuswahl (kannst du später feiner machen)
        if (resp.message.contains("bereits")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(resp); // 409
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp); // 400
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDtos.AuthResponse> login(@RequestBody AuthDtos.LoginRequest req) {
        AuthDtos.AuthResponse resp = authService.login(req);
        if (resp.ok) return ResponseEntity.ok(resp);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp); // 401
    }
}
