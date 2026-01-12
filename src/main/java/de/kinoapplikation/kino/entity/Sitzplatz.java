package de.kinoapplikation.kino.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

/**
 * Entität für Sitzplätze im Kino-System.
 * Enthält Informationen über Sitzplatz-ID, Reihe, Platznummer, Bereich, zugehörigen Saal und Sitztyp.
 * @author Niklas
 */

@Entity
public class Sitzplatz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sitzplatzId;

    private int reihe;
    private int platzNr;
    private String bereich;

    @ManyToOne
    private Saal saal;

    @ManyToOne
    private SitzTyp sitzTyp;

    // Getter & Setter
    public Long getId() {
        return sitzplatzId;
    }
    public void setId(Long sitzplatzId) {
        this.sitzplatzId = sitzplatzId;
    }
    public int getReihe() {
        return reihe;
    }
    public void setReihe(int reihe) {
        this.reihe = reihe;
    }
    public int getPlatzNr() {
        return platzNr;
    }
    public void setPlatzNr(int platzNr) {
        this.platzNr = platzNr;
    }
    public String getBereich() {
        return bereich;
    }
    public void setBereich(String bereich) {
        this.bereich = bereich;
    }
    public Saal getSaal() {
        return saal;
    }
    public void setSaalId(Saal Saal) {
        this.saal = Saal;
    }
    public SitzTyp getSitzTyp() {
        return sitzTyp;
    }
    public void setSitzTyp(SitzTyp sitzTyp1) {
        this.sitzTyp = sitzTyp1;
    }
}