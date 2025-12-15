package de.kinoapplikation.kino.repository;


import de.kinoapplikation.kino.entity.Buchung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuchungRepository extends JpaRepository<Buchung, Long> {
    List<Buchung> findByBenutzerId(Long benutzerId);
    List<Buchung> findByVorstellungId(Long vorstellungId);
}
