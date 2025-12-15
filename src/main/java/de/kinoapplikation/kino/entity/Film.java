package de.kinoapplikation.kino.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Film {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titel;
    private String genre;
    private int laufzeit;

    @OneToMany(mappedBy = "film", cascade = CascadeType.ALL)
    private List<Vorstellung> vorstellungen;

    // Getter & Setter

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitel() { return titel; }
    public void setTitel(String titel) { this.titel = titel; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public int getLaufzeit() { return laufzeit; }
    public void setLaufzeit(int laufzeit) { this.laufzeit = laufzeit; }

    public List<Vorstellung> getVorstellungen() { return vorstellungen; }
    public void setVorstellungen(List<Vorstellung> vorstellungen) { this.vorstellungen = vorstellungen; }
}
