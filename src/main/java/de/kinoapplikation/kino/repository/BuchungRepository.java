package de.kinoapplikation.kino.repository;

import de.kinoapplikation.kino.entity.Buchung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface BuchungRepository extends JpaRepository<Buchung, Long> {
    List<Buchung> findByDatumBetween(LocalDateTime from, LocalDateTime to);
    
    @Query("SELECT b FROM Buchung b WHERE b.benutzer.id = :benutzerId")
    List<Buchung> findByBenutzerId(@Param("benutzerId") Long benutzerId);
}
