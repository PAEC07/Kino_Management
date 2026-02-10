package de.kinoapplikation.kino.entity;

import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Generelle Entität für Preiszuschlässe wie für VIP-Sitze oder besondere
 * Sitztypen.
 * Kein direkter Bezug zu Discounts.
 * 
 * @author Niklas
 */

@Entity
@Table(name = "PreisZuschlag")
public class PreisZuschlag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PreisZuschlagId")
    private Long preisZuschlagId;

    @Column(name = "Beschreibung")
    private String beschreibung;
    @Column(name = "AufschlagWert")
    private int aufschlagWert;

    // Getter & Setter
    public Long getId() {
        return preisZuschlagId;
    }

    public void setId(Long preisZuschlagId) {
        this.preisZuschlagId = preisZuschlagId;
    }

    public String getBeschreibung() {
        return beschreibung;
    }

    public void setBeschreibung(String beschreibung) {
        this.beschreibung = beschreibung;
    }

    public int getAufschlagWert() {
        return aufschlagWert;
    }

    public void setAufschlagWert(int aufschlagWert) {
        this.aufschlagWert = aufschlagWert;
    }
}