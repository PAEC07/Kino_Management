package de.kinoapplikation.kino.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.kinoapplikation.kino.dto.VorstellungDto;
import de.kinoapplikation.kino.entity.Vorstellung;
import de.kinoapplikation.kino.service.VorstellungService;

/**
 * REST-Controller für Vorstellungs-Management.
 * 
 * Provides endpoints for:
 * - GET /api/vorstellungen/list - Alle geplanten Filmvorstellungen
 * - GET /api/vorstellungen/{id}/get - Einzelne Vorstellung abrufen
 * - POST /api/vorstellungen/add - Neue Vorstellung planen (ADMIN)
 * - DELETE /api/vorstellungen/{id}/delete - Vorstellung löschen (ADMIN)
 * 
 * Vorstellungen sind zentral: Sie verbinden Film + Saal + Zeitpunkt.
 * Sie bilden die Basis für den Buchungsprozess.
 * 
 * @author Niklas
 * @see VorstellungService für Business-Logik
 */
@RestController
@RequestMapping("/api/vorstellungen")
public class VorstellungController {

    private final VorstellungService vorstellungService;

    public VorstellungController(VorstellungService vorstellungService) {
        this.vorstellungService = vorstellungService;
    }

    @GetMapping("/list")
    public List<VorstellungDto> alleVorstellungen() {
        return vorstellungService.alleVorstellungen()
                .stream()
                .map(VorstellungDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/{id}/get")
    public VorstellungDto getVorstellung(@PathVariable Long id) {
        return VorstellungDto.fromEntity(vorstellungService.getVorstellung(id));
    }

    @PostMapping("/add")
    public org.springframework.http.ResponseEntity<?> addVorstellung(@RequestBody Vorstellung v) {
        try {
            Vorstellung saved = vorstellungService.addVorstellung(v);
            return org.springframework.http.ResponseEntity.ok(VorstellungDto.fromEntity(saved));
        } catch (IllegalArgumentException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/delete")
    public void deleteVorstellung(@PathVariable Long id) {
        vorstellungService.deleteVorstellung(id);
    }

}
