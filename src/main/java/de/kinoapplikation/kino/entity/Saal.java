package de.kinoapplikation.kino.entity;

import jakarta.persistence.*;
import java.util.List;

/**
 * Entität für Säle im Kino-System.
 * Enthält Informationen über die Anzahl der Plätze pro Reihe und die maximale Anzahl der Reihen.
 * @author Niklas
 */

@Entity
public class Saal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long saalId;

    private int plaetzePerReihe;
    private int MaxReihen;

    @OneToMany(mappedBy = "saal", cascade = CascadeType.ALL)
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
        return MaxReihen;
    }
    public void setMaxReihen(int maxReihen) {
        MaxReihen = maxReihen;
    }
}