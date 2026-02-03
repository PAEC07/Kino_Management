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
        boolean addSaalPart = saalService.addSaal(saal);
        if (addSaalPart) {
            return ResponseEntity.ok("Saal erfolgreich hinzugefügt.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Fehler beim Hinzufügen des Saals.");
        }
    }

    @GetMapping("/list")
    public List<Saal> listeSaele() {
        return saalService.listeSaele();
    }

    @GetMapping("/{id}/get")
    public ResponseEntity<Saal> getSaalById(@PathVariable Long id) {
        Saal saal = saalService.getSaalById(id);
        if (saal != null) {
            return ResponseEntity.ok(saal);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> deleteSaal(@PathVariable Long id) {
        saalService.deleteSaal(id);
        return ResponseEntity.ok("Saal erfolgreich gelöscht.");
    }
}
