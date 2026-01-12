package de.kinoapplikation.kino.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
@Entity
public class Tickets {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketId;

    @ManyToOne
    private Buchungen buchungsId;

    @ManyToOne
    private Vorstellung vorstellungId;

    @ManyToOne
    private Accounts accountId;

    @ManyToOne
    private Discounts discountId;

    @ManyToOne
    private PreisZuschlag preisZuschlagId;

    @ManyToOne
    private int sitzplatzId;

    // Getter & Setter
    public Long getId() {
        return ticketId;
    }
    public void setId(Long ticketId) {
        this.ticketId = ticketId;
    }
    public Buchungen getBuchungsId() {
        return buchungsId;
    }
    public void setBuchungsId(Buchungen buchungsId) {
        this.buchungsId = buchungsId;
    }
    public Vorstellung getVorstellungId() {
        return vorstellungId;
    }
    public void setVorstellungId(Vorstellung vorstellungId) {       
        this.vorstellungId = vorstellungId;
    }
    public Accounts getAccountId() {
        return accountId;
    }
    public void setAccountId(Accounts accountId) {
        this.accountId = accountId;
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