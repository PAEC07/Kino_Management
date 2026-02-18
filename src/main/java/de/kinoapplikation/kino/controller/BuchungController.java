package de.kinoapplikation.kino.controller;

import de.kinoapplikation.kino.dto.CheckoutDtos;
import de.kinoapplikation.kino.entity.Buchung;
import de.kinoapplikation.kino.service.BuchungService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @DeleteMapping("/{id}/delete")
    public void stornieren(@PathVariable Long id) {
        buchungService.stornieren(id);
    }

    // ✅ NEU: Checkout
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
