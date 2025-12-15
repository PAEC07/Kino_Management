package de.kinoapplikation.kino.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Vorstellung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime zeit;

    @ManyToOne
    private Film film;

    @OneToMany(mappedBy = "vorstellung", cascade = CascadeType.ALL)
    private List<Buchung> buchungen;

    // Getter & Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getZeit() { return zeit; }
    public void setZeit(LocalDateTime zeit) { this.zeit = zeit; }

    public Film getFilm() { return film; }
    public void setFilm(Film film) { this.film = film; }

    public List<Buchung> getBuchungen() { return buchungen; }
    public void setBuchungen(List<Buchung> buchungen) { this.buchungen = buchungen; }
}
