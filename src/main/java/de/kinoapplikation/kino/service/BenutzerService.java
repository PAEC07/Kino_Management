package de.kinoapplikation.kino.service;

import java.util.List;
import org.springframework.stereotype.Service;
import de.kinoapplikation.kino.entity.Benutzer;
import de.kinoapplikation.kino.repository.BenutzerRepository;

@Service
public class BenutzerService {

    private final BenutzerRepository benutzerRepo;

    public BenutzerService(BenutzerRepository benutzerRepo) {
        this.benutzerRepo = benutzerRepo;
    }

    public Benutzer registrieren(Benutzer benutzer) {
        if (benutzer == null) {
            throw new IllegalArgumentException("Benutzer darf nicht null sein");
        }
        return benutzerRepo.save(benutzer);
    }

    public Benutzer datenAendern(Long id, Benutzer updated) {
        if (id == null) throw new IllegalArgumentException("ID darf nicht null sein");

        return benutzerRepo.findById(id).map(b -> {
            if (updated.getUsername() != null) b.setUsername(updated.getUsername());
            if (updated.getEmail() != null) b.setEmail(updated.getEmail());

            // wenn du Password ändern willst, dann nur passwordHash setzen
            if (updated.getPasswordHash() != null) b.setPasswordHash(updated.getPasswordHash());

            return benutzerRepo.save(b);
        }).orElse(null);
    }


    public List<Benutzer> alleBenutzer() {
        return benutzerRepo.findAll();
    }
}
