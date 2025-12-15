package de.kinoapplikation.kino.repository;


import de.kinoapplikation.kino.entity.Benutzer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BenutzerRepository extends JpaRepository<Benutzer, Long> {
    // Optional: Benutzer per Username suchen
    Benutzer findByUsername(String username);

}
