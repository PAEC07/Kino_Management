package de.kinoapplikation.kino.entity;

import jakarta.persistence.*;
import java.util.List;

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
    private Saal saalId;

    @ManyToOne
    private SitzTyp sitzTypId;

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
    public Saal getSaalId() {
        return saalId;
    }
    public void setSaalId(Saal saalId) {
        this.saalId = saalId;
    }
    public SitzTyp getSitzTypId() {
        return sitzTypId;
    }
    public void setSitzTypId(SitzTyp sitzTypId) {
        this.sitzTypId = sitzTypId;
    }
}