package de.kinoapplikation.kino.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Generelle Entität für Preisnachlässe wie für Studenten, Kinder oder Senioren.
 * Kein direkter Bezug zu PreisZuschlag oder SitzTyp.
 * @author Niklas
 */

@Entity
public class Discounts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long discountId;

    private String beschreibung;
    private Long discountWert;

    // Getter & Setter
    public Long getId() {
        return discountId;
    }
    public void setId(Long discountId) {
        this.discountId = discountId;
    }
    public String getBeschreibung() {
        return beschreibung;
    }
    public void setBeschreibung(String beschreibung) {
        this.beschreibung = beschreibung;
    }
    public Long getDiscountWert() {
        return discountWert;
    }
    public void setDiscountWert(Long discountWert) {
        this.discountWert = discountWert;
    }
}