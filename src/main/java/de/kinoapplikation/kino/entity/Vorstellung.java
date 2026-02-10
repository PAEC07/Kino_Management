package de.kinoapplikation.kino.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Entität für Vorstellungen im Kino-System.
 * Enthält Informationen über die Vorstellung-ID, den Film, den Saal, den
 * Darstellungstyp und das Datum.
 * 
 * @author Niklas
 */

@Entity
@Table(name = "Vorstellungen")
public class Vorstellung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VorstellungId")
    private Long vorstellungId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "FilmId")
    private Film filmId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "SaalId")
    private Saal saalId;

    @Column(name = "Datum")
    private LocalDateTime datum;

    // Getter & Setter
    public Long getId() {
        return vorstellungId;
    }

    public void setId(Long vorstellungId) {
        this.vorstellungId = vorstellungId;
    }

    public Film getFilmId() {
        return filmId;
    }

    public void setFilmId(Film filmId) {
        this.filmId = filmId;
    }

    public Saal getSaalId() {
        return saalId;
    }

    public void setSaalId(Saal saalId) {
        this.saalId = saalId;
    }

    public LocalDateTime getDatum() {
        return datum;
    }

    public void setDatum(LocalDateTime datum) {
        this.datum = datum;
    }
}