package de.kinoapplikation.kino.repository;

import de.kinoapplikation.kino.entity.Sitzplatz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SitzplatzRepository extends JpaRepository<Sitzplatz, Long> {

    List<Sitzplatz> findBySaalSaalId(Long saalId);

    long countBySaalSaalId(Long saalId);

    @Query("SELECT t.sitzplatz FROM Tickets t WHERE t.vorstellungId.vorstellungId = :vorstellungId")
    List<Sitzplatz> findOccupiedSeats(@Param("vorstellungId") Long vorstellungId);

    @Query("SELECT COUNT(t) FROM Tickets t WHERE t.vorstellungId.vorstellungId = :vorstellungId AND t.sitzplatz.sitzplatzId = :sitzplatzId")
    long countTicketForSeatAndShow(@Param("vorstellungId") Long vorstellungId, @Param("sitzplatzId") Long sitzplatzId);
}
