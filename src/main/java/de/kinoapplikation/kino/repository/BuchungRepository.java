package de.kinoapplikation.kino.repository;

import de.kinoapplikation.kino.entity.Buchung;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface BuchungRepository extends JpaRepository<Buchung, Long> {
    List<Buchung> findByDatumBetween(LocalDateTime from, LocalDateTime to);
}
