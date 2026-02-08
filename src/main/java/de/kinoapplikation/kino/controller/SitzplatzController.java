package de.kinoapplikation.kino.controller;

import de.kinoapplikation.kino.dto.SeatStatusDTO;
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
    public List<SeatStatusDTO> getSitzplan(@PathVariable Long vorstellungId, @PathVariable Long saalId) {

        // Alle Sitze im Saal
        List<Sitzplatz> alleSitze = sitzplatzRepository.findBySaalSaalId(saalId);

        // Belegte Sitze dieser Vorstellung
        List<Sitzplatz> belegteSitze = sitzplatzRepository.findOccupiedSeats(vorstellungId);

        return alleSitze.stream()
                .map(sitz -> new SeatStatusDTO(
                        sitz,
                        belegteSitze.stream().anyMatch(b -> b.getId().equals(sitz.getId()))
                ))
                .toList();
    }

    @GetMapping("/list")
    public List<Sitzplatz> auflisten() {
        return sitzplatzRepository.findAll();
    }
}
