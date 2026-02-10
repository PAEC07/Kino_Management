package de.kinoapplikation.kino.entity;

import java.util.List;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonAlias;
/**
 * Entität für Säle im Kino-System.
 * Enthält Informationen über die Anzahl der Plätze pro Reihe und die maximale Anzahl der Reihen.
 * @author Niklas
 */

@Entity
@Table(name = "Saal")
public class Saal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SaalId")
    private Long saalId;

    @JsonAlias({"plaetzePerReihe","sitzeProReihe","plaetzeProReihe","seatsPerRow"})
    @Column(name = "PlaetzePerReihe")
    private int plaetzePerReihe;

    @JsonAlias({"reihen","anzahlReihen","rows","maxReihen"})
    @Column(name = "MaxReihen")
    private int maxReihen;
    
    @JsonAlias({"logeAnteilProzent","logeProzent","prozentLoge","logePercent"})
    @Column(name = "LogeAnteilProzent")
    private int logeAnteilProzent;

    @JsonAlias({"saalname","name","bezeichnung","saalName"})
    @Column(name = "SaalName")
    private String saalName;

    @JsonIgnore
    @OneToMany(mappedBy = "saalId", cascade = CascadeType.ALL)
    private List<Vorstellung> vorstellungen;


    // Getter & Setter
    public Long getId() {
        return saalId;
    }
    public void setId(Long saalId) {
        this.saalId = saalId;
    }
    public int getPlaetzePerReihe() {
        return plaetzePerReihe;
    }
    public void setPlaetzePerReihe(int plaetzePerReihe) {
        this.plaetzePerReihe = plaetzePerReihe;
    }
    public int getMaxReihen() {
        return maxReihen;
    }
    public void setMaxReihen(int maxReihen) {
        this.maxReihen = maxReihen;
    }
    
    public int getLogeAnteilProzent() {
        return logeAnteilProzent;
    }

    public void setLogeAnteilProzent(int logeAnteilProzent) {
        this.logeAnteilProzent = logeAnteilProzent;
    }
    public String getSaalName() {
        if (saalName == null || saalName.trim().isEmpty()) {
            return "Saal " + (saalId != null ? saalId : "");
        }
        return saalName;
    } 

    public void setSaalName(String saalName) {
        this.saalName = saalName;
    }

    public List<Vorstellung> getVorstellungen() {
        return vorstellungen;
    }
    public void setVorstellungen(List<Vorstellung> vorstellungen) {
        this.vorstellungen = vorstellungen;
    }
}