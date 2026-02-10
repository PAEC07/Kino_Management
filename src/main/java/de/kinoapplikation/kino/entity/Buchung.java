package de.kinoapplikation.kino.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

/**
 * Entität für Buchungen im Kino-System.
 * Enthält Informationen über die Buchungs-ID und das Datum der Buchung.
 * 
 * @author Niklas
 */

@Entity
@Table(name = "Buchungen")
public class Buchung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BuchungsId")
    private Long buchungsId;

    @Column(name = "Datum")
    private LocalDateTime datum;
    @ManyToOne
    @JoinColumn(name = "AccountId")
    private Benutzer benutzer;

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

    public Benutzer getBenutzer() {
        return benutzer;
    }

    public void setBenutzer(Benutzer benutzer) {
        this.benutzer = benutzer;
    }
}
