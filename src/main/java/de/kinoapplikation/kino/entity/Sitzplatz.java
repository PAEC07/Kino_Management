package de.kinoapplikation.kino.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sitzplatz")
public class Sitzplatz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sitzplatz_id")
    private Long sitzplatzId;

    private int reihe;
    private int platzNr;
    private String bereich;

    @ManyToOne
    @JoinColumn(name = "saal_saal_id")
    private Saal saal;

    @ManyToOne
    @JoinColumn(name = "sitz_typ_sitz_typ_id")
    private SitzTyp sitzTyp;

    // Getter & Setter
    public Long getId() { return sitzplatzId; }
    public void setId(Long sitzplatzId) { this.sitzplatzId = sitzplatzId; }
    public int getReihe() { return reihe; }
    public void setReihe(int reihe) { this.reihe = reihe; }
    public int getPlatzNr() { return platzNr; }
    public void setPlatzNr(int platzNr) { this.platzNr = platzNr; }
    public String getBereich() { return bereich; }
    public void setBereich(String bereich) { this.bereich = bereich; }
    public Saal getSaal() { return saal; }
    public void setSaal(Saal saal) { this.saal = saal; }
}