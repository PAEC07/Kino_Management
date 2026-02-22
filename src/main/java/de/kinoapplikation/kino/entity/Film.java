package de.kinoapplikation.kino.entity;

import java.time.Duration;
import java.util.List;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Entität (Entity) für Filme im Kino-Management-System.
 * 
 * Speichert alle relevanten Informationen über einen Film:
 * - Filmname (eindeutig in der Datenbank)
 * - Beschreibung und Content-Details (FSK, Kategorie, Format)
 * - Basispreis in Cents (z.B. 1000 = €10,00)
 * - Filmdauer und Darstellungsformat (2D/3D)
 * 
 * Der Basispreis wird als Basis für alle Ticketpreise verwendet.
 * Die tatsächliche Buchung berechnet Finanzierung berücksichtigt:
 * - Sitztyp-Zuschläge (z.B. +10% für Loge)
 * - Vorstellungs-Zuschläge
 * - Rabatte (Student, Senior, Kind, etc.)
 * KNOWN ISSUE: Filmdauer sollte bei der Eingabe von Minuten (z.B. \"180\") 
 * in Duration konvertiert werden. Derzeit manuelle Eingabe erforderlich.
 * 
 * @author Niklas
 * @see Vorstellung für die Verbindung zu Aufführungen
 */
@Entity
@Table(name = "Filme", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "Filmname" })
})
public class Film {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FilmId")
    private Long filmId;

    @Column(name = "Filmname", nullable = false)
    private String filmname;

    @Column(name = "Beschreibung")
    private String beschreibung;

    @Column(name = "FSK")
    private int fsk;

    @Column(name = "Kategorie")
    private String kategorie;

    @Column(name = "Basispreis")
    private Long basispreis;

    // TODO: Filmdauer beim hinzufügen eines Films in Minuten umwandeln und hier als
    // Duration speichern
    @Column(name = "Filmdauer")
    private Duration filmdauer;

    @Column(name = "Darstellungstyp")
    private String darstellungstyp;

    @JsonIgnore
    @OneToMany(mappedBy = "filmId", cascade = CascadeType.ALL)
    private List<Vorstellung> vorstellungen;

    // Getter & Setter
    public Long getId() {
        return filmId;
    }

    public void setId(Long filmId) {
        this.filmId = filmId;
    }

    public String getFilmname() {
        return filmname;
    }

    public void setFilmname(String filmname) {
        this.filmname = filmname;
    }

    public String getBeschreibung() {
        return beschreibung;
    }

    public void setBeschreibung(String beschreibung) {
        this.beschreibung = beschreibung;
    }

    public int getFsk() {
        return fsk;
    }

    public void setFsk(int fsk) {
        this.fsk = fsk;
    }

    public String getKategorie() {
        return kategorie;
    }

    public void setKategorie(String kategorie) {
        this.kategorie = kategorie;
    }

    public Long getBasispreis() {
        return basispreis;
    }

    public void setBasispreis(Long basispreis) {
        this.basispreis = basispreis;
    }

    public List<Vorstellung> getVorstellungen() {
        return vorstellungen;
    }

    public void setVorstellungen(List<Vorstellung> vorstellungen) {
        this.vorstellungen = vorstellungen;
    }

    public void setFilmdauer(Duration filmtime) {
        this.filmdauer = filmtime;
    }

    public Duration getFilmdauer() {
        return filmdauer;
    }

    public String getDarstellungstyp() {
        return darstellungstyp;
    }

    public void setDarstellungstyp(String darstellungstyp) {
        this.darstellungstyp = darstellungstyp;
    }
}