package de.kinoapplikation.kino.repository;

import de.kinoapplikation.kino.entity.Benutzer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BenutzerRepository extends JpaRepository<Benutzer, Long> {
    Optional<Benutzer> findByUsername(String username);

    Optional<Benutzer> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}