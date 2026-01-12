package de.kinoapplikation.kino.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.kinoapplikation.kino.entity.Benutzer;

@Repository
public interface I_BenutzerRepository extends JpaRepository<Benutzer, Long> {
    // Optional: Benutzer per Username suchen
    Benutzer findByUsername(String username);

}
