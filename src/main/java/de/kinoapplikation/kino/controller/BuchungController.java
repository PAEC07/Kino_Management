package de.kinoapplikation.kino.controller;

import de.kinoapplikation.kino.dto.CheckoutDtos;
import de.kinoapplikation.kino.entity.Buchung;
import de.kinoapplikation.kino.service.BuchungService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST-Controller für Buchungs- und Checkout-Operations.
 * 
 * Provides endpoints for:
 * - POST /api/buchungen/checkout - Haupt-Endpoint zum Buchen von Sitzplätzen
 * - GET /api/buchungen/list - Alle Buchungen (ADMIN)
 * - GET /api/buchungen/list/{benutzerId} - Buchungen eines Benutzers
 * - GET /api/buchungen/{id}/get - Einzelne Buchung abrufen
 * - DELETE /api/buchungen/{id}/delete - Buchung stornieren\n * 
 * Der Checkout-Prozess ist transaktional und erstellt zusätzlich Tickets für jede Buchung.
 * 
 * @version 1.0
 * @see BuchungService für Business-Logik
 * @see TicketsService für Ticket-Verwaltung
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

        @GetMapping("/list/{id}")
    public List<Buchung> alleBuchungen(@PathVariable Long id) {
        return buchungService.alleBuchungenByBenutzer(id);
    }

    @GetMapping("/{id}/get")
    public Buchung getBuchung(@PathVariable Long id) {
        return buchungService.getBuchung(id);
    }

    @DeleteMapping("/{id}/delete")
    public void stornieren(@PathVariable Long id) {
        buchungService.stornieren(id);
    }

    // Checkout
    @PostMapping("/checkout")
    public ResponseEntity<CheckoutDtos.CheckoutResponse> checkout(@RequestBody CheckoutDtos.CheckoutRequest req) {
        try {
            CheckoutDtos.CheckoutResponse resp = buchungService.checkout(req);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new CheckoutDtos.CheckoutResponse(false, e.getMessage(), null, 0));
        }
    }

}
