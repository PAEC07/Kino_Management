package de.kinoapplikation.kino.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Generelle Entität für Sitztypen im Kino wie z.B. VIP, Standard oder
 * Rollstuhlsitz.
 * Kein direkter Bezug zu PreisZuschlag oder Discounts.
 * 
 * @author Niklas
 */

@Entity
public class SitzTyp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sitzTypId;

    private String bezeichnung;
    private Long aufschlagWert;

    // Getter & Setter
    public Long getId() {
        return sitzTypId;
    }

    public void setId(Long sitzTypId) {
        this.sitzTypId = sitzTypId;
    }

    public String getBezeichnung() {
        return bezeichnung;
    }

    public void setBezeichnung(String bezeichnung) {
        this.bezeichnung = bezeichnung;
    }

    public Long getAufschlagWert() {
        return aufschlagWert;
    }

    public void setAufschlagWert(Long aufschlagWert) {
        this.aufschlagWert = aufschlagWert;
    }
}