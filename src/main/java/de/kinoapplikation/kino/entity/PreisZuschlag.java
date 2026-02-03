package de.kinoapplikation.kino.entity;

import jakarta.persistence.Entity;
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
public class PreisZuschlag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long preisZuschlagId;

    private String beschreibung;
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