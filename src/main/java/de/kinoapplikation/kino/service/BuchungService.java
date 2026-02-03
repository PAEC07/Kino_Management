package de.kinoapplikation.kino.service;

import de.kinoapplikation.kino.entity.Buchung;
import de.kinoapplikation.kino.repository.BuchungRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BuchungService {

    private final BuchungRepository buchungRepo;

    public BuchungService(BuchungRepository buchungRepo) {
        this.buchungRepo = buchungRepo;
    }

    public Buchung buchen(Buchung b) {
        if (b == null) {
            throw new IllegalArgumentException("Buchung cannot be null");
        }
        return buchungRepo.save(b);
    }

    public void stornieren(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        buchungRepo.deleteById(id);
    }

    public Buchung getBuchung(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return buchungRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Buchung not found"));
    }

    public List<Buchung> alleBuchungen() {
        return buchungRepo.findAll();
    }
}
