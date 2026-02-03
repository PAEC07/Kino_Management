package de.kinoapplikation.kino.controller;

import de.kinoapplikation.kino.entity.Vorstellung;
import de.kinoapplikation.kino.service.VorstellungService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vorstellungen")
public class VorstellungController {

    private final VorstellungService vorstellungService;

    public VorstellungController(VorstellungService vorstellungService) {
        this.vorstellungService = vorstellungService;
    }

    @GetMapping("/list")
    public List<Vorstellung> alleVorstellungen() {
        return vorstellungService.alleVorstellungen();
    }
    
    @GetMapping("/{id}/get")
    public Vorstellung getVorstellung(@PathVariable Long id) {
        return vorstellungService.getVorstellung(id);
    }

    @PostMapping("/add")
    public Vorstellung addVorstellung(@RequestBody Vorstellung v) {
        return vorstellungService.addVorstellung(v);
    }

    @DeleteMapping("/{id}/delete")
    public void deleteVorstellung(@PathVariable Long id) {
        vorstellungService.deleteVorstellung(id);
    }

}
