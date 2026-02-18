package de.kinoapplikation.kino.controller;

import de.kinoapplikation.kino.dto.SeatStatusDTO;
import de.kinoapplikation.kino.entity.Sitzplatz;
import de.kinoapplikation.kino.repository.SitzplatzRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sitze")
public class SitzplatzController {

    private final SitzplatzRepository sitzplatzRepository;

    public SitzplatzController(SitzplatzRepository sitzplatzRepository) {
        this.sitzplatzRepository = sitzplatzRepository;
    }

    @GetMapping("/status/{vorstellungId}/{saalId}")
    public List<SeatStatusDTO> getSitzplan(@PathVariable Long vorstellungId, @PathVariable Long saalId) {

        List<Sitzplatz> alleSitze = sitzplatzRepository.findBySaalSaalId(saalId);
        List<Sitzplatz> belegteSitze = sitzplatzRepository.findOccupiedSeats(vorstellungId);

        return alleSitze.stream().map(s -> {
            boolean belegt = belegteSitze.stream().anyMatch(b -> b.getId().equals(s.getId()));
            return new SeatStatusDTO(
                    s.getId(),
                    s.getReihe(),
                    s.getPlatzNr(),
                    s.getBereich(),
                    belegt
            );
        }).toList();
    }

    @GetMapping("/list")
    public List<Sitzplatz> auflisten() {
        return sitzplatzRepository.findAll();
    }
}
