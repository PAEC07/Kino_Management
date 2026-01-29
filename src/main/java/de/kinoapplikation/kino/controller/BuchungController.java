package de.kinoapplikation.kino.controller;

import de.kinoapplikation.kino.entity.Buchung;
import de.kinoapplikation.kino.service.BuchungService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/buchungen")
public class BuchungController {

    private final BuchungService buchungService;

    public BuchungController(BuchungService buchungService) {
        this.buchungService = buchungService;
    }

    @GetMapping
    public List<Buchung> alleBuchungen() {
        return buchungService.alleBuchungen();
    }

    @GetMapping("/{id}")
    public Buchung getBuchung(@PathVariable Long id) {
        return buchungService.getBuchung(id);
    }

    @PostMapping
    public Buchung buchen(@RequestBody Buchung b) {
        return buchungService.buchen(b);
    }

    @DeleteMapping("/{id}")
    public void stornieren(@PathVariable Long id) {
        buchungService.stornieren(id);
    }
}
