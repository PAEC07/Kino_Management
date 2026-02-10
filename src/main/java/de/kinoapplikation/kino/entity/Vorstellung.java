package de.kinoapplikation.kino.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

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

    @ManyToOne
    @JoinColumn(name = "FilmId")
    private Film filmId;

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

    @com.fasterxml.jackson.annotation.JsonIgnore
    public void setFilmId(Film filmId) {
        this.filmId = filmId;
    }

    // Accept numeric filmId in JSON (e.g. 5) and map to Film reference
    @com.fasterxml.jackson.annotation.JsonProperty("filmId")
    public void setFilmId(Long id) {
        if (id == null) {
            this.filmId = null;
            return;
        }
        Film f = new Film();
        f.setId(id);
        this.filmId = f;
    }

    public Saal getSaalId() {
        return saalId;
    }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public void setSaalId(Saal saalId) {
        this.saalId = saalId;
    }

    // Accept numeric saalId in JSON (e.g. 2) and map to Saal reference
    @com.fasterxml.jackson.annotation.JsonProperty("saalId")
    public void setSaalId(Long id) {
        if (id == null) {
            this.saalId = null;
            return;
        }
        Saal s = new Saal();
        s.setId(id);
        this.saalId = s;
    }

    public LocalDateTime getDatum() {
        return datum;
    }

    public void setDatum(LocalDateTime datum) {
        this.datum = datum;
    }
}