package de.kinoapplikation.kino.repository;

import de.kinoapplikation.kino.entity.Film;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FilmRepository extends JpaRepository<Film, Long> {
    Optional<Film> findByFilmnameIgnoreCase(String filmname);
}
