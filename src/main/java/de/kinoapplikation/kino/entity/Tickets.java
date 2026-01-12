package de.kinoapplikation.kino.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

/**
 * Entität für Tickets im Kino-System.
 * Verknüpft Buchungen, Vorstellungen, Accounts, Discounts, PreisZuschläge und Sitzplätze.
 * @author Niklas
 */

@Entity
public class Tickets {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ticketId;

    @ManyToOne
    private Buchung buchung;

    @ManyToOne
    private Vorstellung vorstellungId;

    @ManyToOne
    private Benutzer benutzer;

    @ManyToOne
    private Discounts discountId;

    @ManyToOne
    private PreisZuschlag preisZuschlagId;

    @ManyToOne
    private int sitzplatzId;

    // Getter & Setter

    public int getTicketId() {
        return ticketId;
    }

    public void setTicketId(int ticketId) {
        this.ticketId = ticketId;
    }

    public Buchung getBuchung() {
        return buchung;
    }

    public void setBuchung(Buchung buchung) {
        this.buchung = buchung;
    }

    public Vorstellung getVorstellungId() {
        return vorstellungId;
    }

    public void setVorstellungId(Vorstellung vorstellungId) {
        this.vorstellungId = vorstellungId;
    }

    public Benutzer getBenutzer() {
        return benutzer;
    }

    public void setBenutzer(Benutzer benutzer) {
        this.benutzer = benutzer;
    }

    public Discounts getDiscountId() {
        return discountId;
    }

    public void setDiscountId(Discounts discountId) {
        this.discountId = discountId;
    }

    public PreisZuschlag getPreisZuschlagId() {
        return preisZuschlagId;
    }

    public void setPreisZuschlagId(PreisZuschlag preisZuschlagId) {
        this.preisZuschlagId = preisZuschlagId;
    }

    public int getSitzplatzId() {
        return sitzplatzId;
    }

    public void setSitzplatzId(int sitzplatzId) {
        this.sitzplatzId = sitzplatzId;
    }
}
