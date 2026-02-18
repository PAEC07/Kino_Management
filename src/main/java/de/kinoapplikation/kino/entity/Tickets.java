package de.kinoapplikation.kino.entity;

import jakarta.persistence.*;
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
    @JoinColumn(name = "SitzplatzId")
    private Sitzplatz sitzplatz;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "AccountId")
    private Benutzer benutzerId;

    // ✅ Korrekt: buchungId als Column (kein JoinColumn)
    @Column(name = "BuchungsId")
    private Long buchungId;

    public int getTicketId() { return ticketId; }
    public void setTicketId(int ticketId) { this.ticketId = ticketId; }

    public Vorstellung getVorstellungId() { return vorstellungId; }
    public void setVorstellungId(Vorstellung vorstellungId) { this.vorstellungId = vorstellungId; }

    public Sitzplatz getSitzplatz() { return sitzplatz; }
    public void setSitzplatz(Sitzplatz sitzplatz) { this.sitzplatz = sitzplatz; }

    public Benutzer getBenutzerId() { return benutzerId; }
    public void setBenutzerId(Benutzer benutzerId) { this.benutzerId = benutzerId; }

    public Long getBuchungId() { return buchungId; }
    public void setBuchungId(Long buchungId) { this.buchungId = buchungId; }
}
