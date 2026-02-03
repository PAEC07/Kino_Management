package de.kinoapplikation.kino.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


/**
 * Entität für Buchungen im Kino-System.
 * Enthält Informationen über die Buchungs-ID und das Datum der Buchung.
 * @author Niklas
 */

@Entity
public class Buchung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long buchungsId;
    private LocalDateTime datum;

    // Getter & Setter
    public Long getId() {
        return buchungsId;
    }
    public void setId(Long buchungsId) {
        this.buchungsId = buchungsId;
    }
    public LocalDateTime getDatum() {
        return datum;
    }
    public void setDatum(LocalDateTime datum) { 
        this.datum = datum;
    }
}
