package de.kinoapplikation.kino.controller;

import de.kinoapplikation.kino.entity.Buchung;
import de.kinoapplikation.kino.service.BuchungService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Endpoints:
 * - GET /api/buchungen/list > Alle Buchungen auflisten
 * - GET /api/buchungen/{id}/get > Buchung mit bestimmter ID abrufen
 * - POST /api/buchungen/add > Neue Buchung hinzufügen
 * - DELETE /api/buchungen/{id}/delete > Buchung mit bestimmter ID löschen
 */

@RestController
@RequestMapping("/api/buchungen")
public class BuchungController {

    private final BuchungService buchungService;

    public BuchungController(BuchungService buchungService) {
        this.buchungService = buchungService;
    }

    @GetMapping("/list")
    public List<Buchung> alleBuchungen() {
        return buchungService.alleBuchungen();
    }

    @GetMapping("/{id}/get")
    public Buchung getBuchung(@PathVariable Long id) {
        return buchungService.getBuchung(id);
    }

    @GetMapping("/list/{id}")
    public List<Buchung> buchungenDesBenutzers(@PathVariable Long id) {
        return buchungService.buchungenDesBenutzers(id);
    }

    @PostMapping("/add")
    public Buchung buchen(@RequestBody Buchung b) {
        return buchungService.buchen(b);
    }

    @DeleteMapping("/{id}/delete")
    public void stornieren(@PathVariable Long id) {
        buchungService.stornieren(id);
    }
}
