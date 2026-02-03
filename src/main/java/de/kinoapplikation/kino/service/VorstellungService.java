package de.kinoapplikation.kino.service;

import de.kinoapplikation.kino.entity.Vorstellung;
import de.kinoapplikation.kino.repository.VorstellungRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VorstellungService {

    private final VorstellungRepository vorstellungRepo;

    public VorstellungService(VorstellungRepository vorstellungRepo) {
        this.vorstellungRepo = vorstellungRepo;
    }

    public Vorstellung addVorstellung(Vorstellung v) {
        if (v == null) {
            throw new IllegalArgumentException("Vorstellung cannot be null");
        }
        return vorstellungRepo.save(v);
    }

    public void deleteVorstellung(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        vorstellungRepo.deleteById(id);
    }

    public Vorstellung getVorstellung(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return vorstellungRepo.findById(id).orElse(null);
    }

    public List<Vorstellung> alleVorstellungen() {
        return vorstellungRepo.findAll();
    }

}
