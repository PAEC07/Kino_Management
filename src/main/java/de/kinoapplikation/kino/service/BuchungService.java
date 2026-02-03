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
        return buchungRepo.save(b);
    }

    public void stornieren(Long id) {
        buchungRepo.deleteById(id);
    }

    public Buchung getBuchung(Long id) {
        return buchungRepo.findById(id).orElse(null);
    }

    public List<Buchung> alleBuchungen() {
        return buchungRepo.findAll();
    }
}
