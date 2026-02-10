package de.kinoapplikation.kino.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Tickets")
public class Tickets {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TicketId")
    private int ticketId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "VorstellungId")
    private Vorstellung vorstellungId;

    @ManyToOne
    @JoinColumn(name = "PlatzNr")
    private Sitzplatz sitzplatz;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "AccountId")
    private Benutzer benutzerId;

    // New field for buchungId
    @JoinColumn(name = "BuchungsId")
    private Long buchungId;

    // Getter & Setter
    public Benutzer getBenutzerId() {
        return benutzerId;
    }

    public void setBenutzerId(Benutzer benutzerId) {
        this.benutzerId = benutzerId;
    }

    public int getTicketId() {
        return ticketId;
    }

    public void setTicketId(int ticketId) {
        this.ticketId = ticketId;
    }

    public Vorstellung getVorstellungId() {
        return vorstellungId;
    }

    public void setVorstellungId(Vorstellung vorstellungId) {
        this.vorstellungId = vorstellungId;
    }

    public Sitzplatz getSitzplatz() {
        return sitzplatz;
    }

    public void setSitzplatz(Sitzplatz sitzplatz) {
        this.sitzplatz = sitzplatz;
    }

    // New getter for buchungId
    public Long getBuchungId() {
        return buchungId;
    }

    public void setBuchungId(Long buchungId) {
        this.buchungId = buchungId;
    }
}