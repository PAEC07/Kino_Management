package de.kinoapplikation.kino.repository;

import de.kinoapplikation.kino.entity.PreisZuschlag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PreisZuschlagRepository extends JpaRepository<PreisZuschlag, Long> {
    List<PreisZuschlag> findByBeschreibungContainingIgnoreCase(String beschreibung);
}
