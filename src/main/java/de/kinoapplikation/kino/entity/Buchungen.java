package de.kinoapplikation.kino.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class Buchungen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long buchungsId;
    private LocalDateTime datum;

    // Getter & Setter
    public Long getId() {
        return buchungsId;
    }
    public void setId(Long buchungsId) {
        this.buchungsId = buchungsId;
    }
    public LocalDateTime getDatum() {
        return datum;
    }
    public void setDatum(LocalDateTime datum) { 
        this.datum = datum;
    }
}
