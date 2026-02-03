package de.kinoapplikation.kino.dto;

import de.kinoapplikation.kino.entity.Sitzplatz;

public class SeatStatusDTO {
    private Sitzplatz sitzplatz;
    private boolean belegt;

    public SeatStatusDTO(Sitzplatz sitzplatz, boolean belegt) {
        this.sitzplatz = sitzplatz;
        this.belegt = belegt;
    }

    // Getter
    public Sitzplatz getSitzplatz() { return sitzplatz; }
    public boolean isBelegt() { return belegt; }

    public void setSitzplatz(Sitzplatz sitzplatz) { this.sitzplatz = sitzplatz; }
    public void setBelegt(boolean belegt) { this.belegt = belegt; }
}