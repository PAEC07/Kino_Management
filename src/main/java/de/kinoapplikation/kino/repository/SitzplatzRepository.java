package de.kinoapplikation.kino.repository;

import de.kinoapplikation.kino.entity.Sitzplatz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SitzplatzRepository extends JpaRepository<Sitzplatz, Long> {

    // WICHTIG: Nutze hier den Feldnamen aus der Saal-Klasse
    List<Sitzplatz> findBySaalSaalId(Long saalId);

    @Query("SELECT t.sitzplatz FROM Tickets t WHERE t.vorstellungId.vorstellungId = :vorstellungId")
    List<Sitzplatz> findOccupiedSeats(@Param("vorstellungId") Long vorstellungId);
}