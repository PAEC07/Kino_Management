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
        return benutzerRepo.save(benutzer);
    }

    public Benutzer datenAendern(Long id, Benutzer updated) {
        return benutzerRepo.findById(id).map(b -> {
            b.setBenutzername(updated.getBenutzername());
            b.setEmail(updated.getEmail());
            b.setPassword(updated.getPassword());
            return benutzerRepo.save(b);
        }).orElse(null);
    }

    public List<Benutzer> alleBenutzer() {
        return benutzerRepo.findAll();
    }
}
