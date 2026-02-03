package de.kinoapplikation.kino.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tickets")
public class Tickets {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private int ticketId;

    @ManyToOne
    @JoinColumn(name = "vorstellung_id_vorstellung_id")
    private Vorstellung vorstellungId;

    @ManyToOne
    @JoinColumn(name = "sitzplatz_sitzplatz_id")
    private Sitzplatz sitzplatz;

    // Getter & Setter
    public int getTicketId() { return ticketId; }
    public void setTicketId(int ticketId) { this.ticketId = ticketId; }
    public Vorstellung getVorstellungId() { return vorstellungId; }
    public void setVorstellungId(Vorstellung vorstellungId) { this.vorstellungId = vorstellungId; }
    public Sitzplatz getSitzplatz() { return sitzplatz; }
    public void setSitzplatz(Sitzplatz sitzplatz) { this.sitzplatz = sitzplatz; }
}