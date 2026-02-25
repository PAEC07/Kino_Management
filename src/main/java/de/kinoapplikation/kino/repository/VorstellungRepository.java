package de.kinoapplikation.kino.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import de.kinoapplikation.kino.entity.Vorstellung;

public interface VorstellungRepository extends JpaRepository<Vorstellung, Long> {
    @Query("select v from Vorstellung v where v.filmId.filmId = :filmId")
    List<Vorstellung> findByFilmIdValue(@Param("filmId") Long filmId);

    @Query("select v from Vorstellung v where v.saalId.saalId = :saalId")
    List<Vorstellung> findBySaalIdValue(@Param("saalId") Long saalId);
}
