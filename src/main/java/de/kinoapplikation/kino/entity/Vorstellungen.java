package de.kinoapplikation.kino.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Vorstellungen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vorstellungId;


    @ManyToOne
    private Film filmId;

    @ManyToOne
    private Saal saalId;

    private String darstellungstyp;
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
    public String getDarstellungstyp() {
        return darstellungstyp;
    }
    public void setDarstellungstyp(String darstellungstyp) {
        this.darstellungstyp = darstellungstyp;
    }
    public LocalDateTime getDatum() {
        return datum;
    }
    public void setDatum(LocalDateTime datum) {
        this.datum = datum;
    }
}