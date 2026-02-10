package de.kinoapplikation.kino.repository;

import de.kinoapplikation.kino.entity.Sitzplatz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SitzplatzRepository extends JpaRepository<Sitzplatz, Long> {

    // WICHTIG: Nutze hier den Feldnamen aus der Saal-Klasse
    List<Sitzplatz> findBySaalSaalId(Long saalId);

    /**
     * Retrieves all occupied seats for a specific movie showing.
     * 
     * @param vorstellungId the unique identifier of the movie showing (Vorstellung)
     * @return a list of {@link Sitzplatz} objects representing all seats that have been booked
     *         for the specified movie showing. Returns an empty list if no seats are occupied.
     */
    @Query("SELECT t.sitzplatz FROM Tickets t WHERE t.vorstellungId.vorstellungId = :vorstellungId")
    List<Sitzplatz> findOccupiedSeats(@Param("vorstellungId") Long vorstellungId);
}