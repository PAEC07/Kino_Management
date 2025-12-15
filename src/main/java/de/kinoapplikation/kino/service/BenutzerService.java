package de.kinoapplikation.kino.service;


import de.kinoapplikation.kino.entity.Benutzer;
import de.kinoapplikation.kino.repository.BenutzerRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BenutzerService {

    private final BenutzerRepository benutzerRepo;

    public BenutzerService(BenutzerRepository benutzerRepo) {
        this.benutzerRepo = benutzerRepo;
    }

    public Benutzer registrieren(Benutzer benutzer) {
        return benutzerRepo.save(benutzer);
    }

    public Benutzer datenAendern(Long id, Benutzer updated) {
        return benutzerRepo.findById(id).map(b -> {
            b.setUsername(updated.getUsername());
            b.setEmail(updated.getEmail());
            b.setPassword(updated.getPassword());
            return benutzerRepo.save(b);
        }).orElse(null);
    }

    public List<Benutzer> alleBenutzer() {
        return benutzerRepo.findAll();
    }
}
