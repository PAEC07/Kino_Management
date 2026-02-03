package de.kinoapplikation.kino.controller;

import de.kinoapplikation.kino.entity.Sitzplatz;
import de.kinoapplikation.kino.repository.SitzplatzRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/sitze")
public class SitzplatzController {

    @Autowired
    private SitzplatzRepository sitzplatzRepository;

    @GetMapping("/status/{vorstellungId}/{saalId}")
    public List<Map<String, Object>> getSitzplan(@PathVariable Long vorstellungId, @PathVariable Long saalId) {
        // Alle Sitze im Saal laden
        List<Sitzplatz> alleSitze = sitzplatzRepository.findBySaalSaalId(saalId);
        // Belegte Sitze dieser Vorstellung laden
        List<Sitzplatz> belegteSitze = sitzplatzRepository.findOccupiedSeats(vorstellungId);

        List<Map<String, Object>> response = new ArrayList<>();
        for (Sitzplatz sitz : alleSitze) {
            Map<String, Object> item = new HashMap<>();
            item.put("sitzId", sitz.getId());
            item.put("reihe", sitz.getReihe());
            item.put("platzNr", sitz.getPlatzNr());
            item.put("bereich", sitz.getBereich());

            // Check ob belegt
            boolean istBelegt = belegteSitze.stream()
                    .anyMatch(b -> b.getId().equals(sitz.getId()));

            item.put("belegt", istBelegt);
            response.add(item);
        }
        return response;
    }

    // Zum Testen, ob überhaupt Daten da sind
    @GetMapping("/list")
    public List<Sitzplatz> auflisten() {
        return sitzplatzRepository.findAll();
    }
}