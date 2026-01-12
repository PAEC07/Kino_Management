package de.kinoapplikation.kino.repository;

import de.kinoapplikation.kino.entity.Vorstellung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface VorstellungRepository extends JpaRepository<Vorstellung, Long> {
    @Query("select v from Vorstellung v where v.filmId.filmId = :filmId")
    List<Vorstellung> findByFilmIdValue(@Param("filmId") Long filmId);
}
