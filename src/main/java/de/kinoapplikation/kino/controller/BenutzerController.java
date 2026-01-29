package de.kinoapplikation.kino.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.kinoapplikation.kino.entity.Benutzer;
import de.kinoapplikation.kino.service.BenutzerService;

@RestController
@RequestMapping("/api/benutzer")
public class BenutzerController {

    private final BenutzerService benutzerService;

    public BenutzerController(BenutzerService benutzerService) {
        this.benutzerService = benutzerService;
    }

    @GetMapping
    public List<Benutzer> alleBenutzer() {
        return benutzerService.alleBenutzer();
    }

    @PostMapping("/registrieren")
    public Benutzer registrieren(@RequestBody Benutzer b) {
        return benutzerService.registrieren(b);
    }

    @PutMapping("/{id}")
    public Benutzer datenAendern(@PathVariable Long id, @RequestBody Benutzer b) {
        return benutzerService.datenAendern(id, b);
    }
}
