package de.kinoapplikation.kino.dto;

import java.util.List;

public class MeineBuchungDTO {
    public Long buchungId;
    public String filmname;
    public String datumIso;
    public String uhrzeit;
    public String saalName;
    public List<String> sitze; // z.B. "R3-P8 (Parkett)"

    public long totalCents;

    public MeineBuchungDTO() {}
}
