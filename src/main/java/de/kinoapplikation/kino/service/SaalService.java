package de.kinoapplikation.kino.service;

import java.util.List;
import org.springframework.stereotype.Service;
import de.kinoapplikation.kino.entity.Saal;
import de.kinoapplikation.kino.repository.SaalRepository;

@Service
public class SaalService {
    
    private final SaalRepository saalRepo;

    public SaalService(SaalRepository saalRepo) {
        this.saalRepo = saalRepo;
    }

    public boolean addSaal(Saal saal) {
        if (saal == null) {
            throw new IllegalArgumentException("Saal cannot be null");
        }
        // Save first so we get a generated ID
        Saal saved = saalRepo.save(saal);
        if (saved == null) return false;

        // If no name was provided, set a default name "Saal <id>" and persist
        if (saved.getSaalName() == null || saved.getSaalName().trim().isEmpty()) {
            saved.setSaalName("Saal " + saved.getId());
            saalRepo.save(saved);
        }

        return true;
    }

    public List<Saal> listeSaele() {
        // Implementierung zum Auflisten der Säle
        // Diese Methode sollte die Logik enthalten, um alle Säle aus der Datenbank abzurufen und zurückzugeben
        return saalRepo.findAll();
    }

    public Saal getSaalById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return saalRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Saal not found"));
    }

    public void deleteSaal(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        saalRepo.deleteById(id);
    }
}