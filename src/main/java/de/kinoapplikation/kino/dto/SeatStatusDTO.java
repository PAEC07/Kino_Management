package de.kinoapplikation.kino.dto;

public class SeatStatusDTO {
    public Long sitzId;
    public int reihe;
    public int platzNr;
    public String bereich;
    public boolean belegt;

    public SeatStatusDTO() {}

    public SeatStatusDTO(Long sitzId, int reihe, int platzNr, String bereich, boolean belegt) {
        this.sitzId = sitzId;
        this.reihe = reihe;
        this.platzNr = platzNr;
        this.bereich = bereich;
        this.belegt = belegt;
    }
}
