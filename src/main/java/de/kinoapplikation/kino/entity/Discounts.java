package de.kinoapplikation.kino.entity;

import jakarta.persistence.*;

/**
 * Generelle Entität für Preisnachlässe wie für Studenten, Kinder oder Senioren.
 * Kein direkter Bezug zu PreisZuschlag oder SitzTyp.
 * @author Niklas
 */

@Entity
@Table(name = "Discounts")
public class Discounts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DiscountId")
    private Long discountId;

    @Column(name = "Beschreibung")
    private String beschreibung;
    @Column(name = "DiscountWert")
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