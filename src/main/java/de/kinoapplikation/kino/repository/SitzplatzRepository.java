package de.kinoapplikation.kino.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import de.kinoapplikation.kino.entity.Sitzplatz;

public interface SitzplatzRepository extends JpaRepository<Sitzplatz, Long> {
    List<Sitzplatz> findBySaalSaalId(Long saalId);
}
