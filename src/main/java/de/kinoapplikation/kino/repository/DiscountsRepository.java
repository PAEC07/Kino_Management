package de.kinoapplikation.kino.repository;

import de.kinoapplikation.kino.entity.Discounts;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiscountsRepository extends JpaRepository<Discounts, Long> {
    List<Discounts> findByBeschreibungContainingIgnoreCase(String beschreibung);
}
