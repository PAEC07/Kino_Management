package de.kinoapplikation.kino.repository;


import de.kinoapplikation.kino.entity.Vorstellung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VorstellungRepository extends JpaRepository<Vorstellung, Long> {
    List<Vorstellung> findByFilmIdAndZeitAfter(Long filmId, LocalDateTime zeit);
}
