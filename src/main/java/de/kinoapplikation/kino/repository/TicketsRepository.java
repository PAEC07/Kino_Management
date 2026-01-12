package de.kinoapplikation.kino.repository;

import de.kinoapplikation.kino.entity.Tickets;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketsRepository extends JpaRepository<Tickets, Integer> {
    List<Tickets> findByVorstellungIdVorstellungId(Long vorstellungId);
}
