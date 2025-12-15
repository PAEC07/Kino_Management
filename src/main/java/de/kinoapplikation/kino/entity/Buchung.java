package de.kinoapplikation.kino.entity;

import jakarta.persistence.*;

@Entity
public class Buchung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Benutzer benutzer;

    @ManyToOne
    private Vorstellung vorstellung;

    private int sitzplatzNummer;
    private boolean bezahlt;
    private double preis;
    private String ermaessigung; // STUDENT, KIND, SENIOR

    // Getter & Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Benutzer getBenutzer() { return benutzer; }
    public void setBenutzer(Benutzer benutzer) { this.benutzer = benutzer; }

    public Vorstellung getVorstellung() { return vorstellung; }
    public void setVorstellung(Vorstellung vorstellung) { this.vorstellung = vorstellung; }

    public int getSitzplatzNummer() { return sitzplatzNummer; }
    public void setSitzplatzNummer(int sitzplatzNummer) { this.sitzplatzNummer = sitzplatzNummer; }

    public boolean isBezahlt() { return bezahlt; }
    public void setBezahlt(boolean bezahlt) { this.bezahlt = bezahlt; }

    public double getPreis() { return preis; }
    public void setPreis(double preis) { this.preis = preis; }

    public String getErmaessigung() { return ermaessigung; }
    public void setErmaessigung(String ermaessigung) { this.ermaessigung = ermaessigung; }
}
