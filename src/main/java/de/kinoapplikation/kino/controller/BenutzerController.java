package de.kinoapplikation.kino.controller;


import de.kinoapplikation.kino.entity.Benutzer;
import de.kinoapplikation.kino.service.BenutzerService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/benutzer")
public class BenutzerController {

    private final BenutzerService benutzerService;

    public BenutzerController(BenutzerService benutzerService) {
        this.benutzerService = benutzerService;
    }

    @GetMapping
    public List<Benutzer> alleBenutzer() { return benutzerService.alleBenutzer(); }

    @PostMapping("/registrieren")
    public Benutzer registrieren(@RequestBody Benutzer b) {
        b.setRolle("BENUTZER");
        return benutzerService.registrieren(b);
    }

    @PutMapping("/{id}")
    public Benutzer datenAendern(@PathVariable Long id, @RequestBody Benutzer b) {
        return benutzerService.datenAendern(id, b);
    }
}
