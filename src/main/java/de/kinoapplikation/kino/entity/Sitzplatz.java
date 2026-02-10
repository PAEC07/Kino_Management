package de.kinoapplikation.kino.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "Sitzplatz")
public class Sitzplatz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SitzplatzId")
    private Long sitzplatzId;

    @Column(name = "Reihe")
    private int reihe;
    @Column(name = "PlatzNr")
    private int platzNr;
    @Column(name = "Bereich")
    private String bereich;

    @ManyToOne
    @JoinColumn(name = "Saal_SaalId")
    private Saal saal;

    @ManyToOne
    @JoinColumn(name = "SitzTyp_SitzTypId")
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

    public void setSaal(Saal saal) {
        this.saal = saal;
    }
}