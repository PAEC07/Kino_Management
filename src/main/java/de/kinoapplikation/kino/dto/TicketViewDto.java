package de.kinoapplikation.kino.dto;

import java.time.LocalDateTime;

public class TicketViewDto {

    public Integer ticketId;
    public Long buchungId;

    public String filmTitel;
    public String beschreibung;
    public Integer fsk;
    public String format;
    public String kategorie;

    public String saalName;
    public LocalDateTime datum;

    public Integer reihe;
    public Integer platzNr;
    public String bereich;

    public Long preisCents;
}