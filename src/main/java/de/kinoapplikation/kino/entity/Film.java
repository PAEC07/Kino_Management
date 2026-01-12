package de.kinoapplikation.kino.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

/**
 * Entität für Filme im Kino-System.
 * Enthält Informationen über Filme wie Name, Beschreibung, FSK, Kategorie und Basispreis.
 * @author Niklas
 */

@Entity
public class Film {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long filmId;

    private String filmname;
    private String beschreibung;
    private int fsk;
    private String kategorie;
    private Long basispreis;

    @OneToMany(mappedBy = "film", cascade = CascadeType.ALL)
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
}