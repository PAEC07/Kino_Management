package de.kinoapplikation.kino.controller;

import de.kinoapplikation.kino.entity.Saal;
import de.kinoapplikation.kino.service.SaalService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/saal")
public class SaalController {

    private final SaalService saalService;

    public SaalController(SaalService saalService) {
        this.saalService = saalService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addSaal(@RequestBody Saal saal) {
        try {
            boolean ok = saalService.addSaal(saal);
            return ok
                    ? ResponseEntity.ok("Saal erfolgreich hinzugefügt (inkl. Sitze).")
                    : ResponseEntity.badRequest().body("Fehler beim Hinzufügen des Saals.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public List<Saal> listeSaele() {
        return saalService.listeSaele();
    }

    @GetMapping("/{id}/get")
    public ResponseEntity<Saal> getSaalById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(saalService.getSaalById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> deleteSaal(@PathVariable Long id) {
        saalService.deleteSaal(id);
        return ResponseEntity.ok("Saal erfolgreich gelöscht.");
    }
}
