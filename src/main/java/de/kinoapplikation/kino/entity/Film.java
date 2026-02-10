package de.kinoapplikation.kino.entity;

import java.time.Duration;
import java.util.List;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Entität für Filme im Kino-System.
 * Enthält Informationen über Filme wie Name, Beschreibung, FSK, Kategorie und
 * Basispreis.
 * 
 * @author Niklas
 */

@Entity
@Table(name = "Filme", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "Filmname" })
})
public class Film {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FilmId")
    private Long filmId;

    @Column(name = "Filmname", nullable = false)
    private String filmname;
    
    @Column(name = "Beschreibung")
    private String beschreibung;

    @Column(name = "FSK")
    private int fsk;

    @Column(name = "Kategorie")
    private String kategorie;

    @Column(name = "Basispreis")
    private Long basispreis;

    @Column(name = "Filmdauer")
    private Duration filmdauer;

    @Column(name = "Darstellungstyp")
    private String darstellungstyp;

    @JsonIgnore
    @OneToMany(mappedBy = "filmId", cascade = CascadeType.ALL)
    private List<Vorstellung> vorstellungen;

    // Getter & Setter
    public Long getId() {
        return filmId;
    }

    public void setId(Long filmId) {
        this.filmId = filmId;
    }

    public String getFilmname() {
        return filmname;
    }

    public void setFilmname(String filmname) {
        this.filmname = filmname;
    }

    public String getBeschreibung() {
        return beschreibung;
    }

    public void setBeschreibung(String beschreibung) {
        this.beschreibung = beschreibung;
    }

    public int getFsk() {
        return fsk;
    }

    public void setFsk(int fsk) {
        this.fsk = fsk;
    }

    public String getKategorie() {
        return kategorie;
    }

    public void setKategorie(String kategorie) {
        this.kategorie = kategorie;
    }

    public Long getBasispreis() {
        return basispreis;
    }

    public void setBasispreis(Long basispreis) {
        this.basispreis = basispreis;
    }

    public List<Vorstellung> getVorstellungen() {
        return vorstellungen;
    }

    public void setVorstellungen(List<Vorstellung> vorstellungen) {
        this.vorstellungen = vorstellungen;
    }

    public void setFilmdauer(Duration filmtime) {
        this.filmdauer = filmtime;
    }

    public Duration getFilmdauer() {
        return filmdauer;
    }

    public String getDarstellungstyp() {
        return darstellungstyp;
    }

    public void setDarstellungstyp(String darstellungstyp) {
        this.darstellungstyp = darstellungstyp;
    }
}