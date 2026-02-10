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
        // Implementierung zum Hinzufügen eines Saals
        // Diese Methode sollte die Logik enthalten, um einen neuen Saal in der Datenbank zu speichern
        return saalRepo.save(saal) != null; // Rückgabe true bei Erfolg, false bei Fehler
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