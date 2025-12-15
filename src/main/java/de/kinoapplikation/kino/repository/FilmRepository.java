package de.kinoapplikation.kino.repository;

import de.kinoapplikation.kino.entity.Film;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilmRepository extends JpaRepository<Film, Long> {
    // Alle Filme eines bestimmten Genres
    List<Film> findByGenreIgnoreCase(String genre);

    // Optional: Film nach Titel suchen
    List<Film> findByTitelContainingIgnoreCase(String titel);
}
