package de.kinoapplikation.kino.entity;

import java.util.List;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(name = "PlaetzePerReihe")
    private int plaetzePerReihe;
    @Column(name = "MaxReihen")
    private int maxReihen;
    
    @Column(name = "LogeAnteilProzent")
    private int logeAnteilProzent;
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