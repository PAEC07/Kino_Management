package de.kinoapplikation.kino.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Entität für Vorstellungen im Kino-System.
 * Enthält Informationen über die Vorstellung-ID, den Film, den Saal, den Darstellungstyp und das Datum.
 * @author Niklas
 */

@Entity
public class Vorstellung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vorstellungId;


    @ManyToOne
    @JsonIgnoreProperties("vorstellungen")
    private Film filmId;

    @ManyToOne
    @JsonIgnoreProperties("vorstellungen")
    private Saal saalId;

    private LocalDateTime datum;

    // TODO: Baran bitte mal kommentar schreiben
    //@OneToMany(mappedBy = "vorstellung", cascade = CascadeType.ALL)
    //private List<Buchung> buchungen;


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