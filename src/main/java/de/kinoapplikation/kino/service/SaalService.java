package de.kinoapplikation.kino.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.kinoapplikation.kino.entity.Saal;
import de.kinoapplikation.kino.entity.Sitzplatz;
import de.kinoapplikation.kino.repository.SaalRepository;
import de.kinoapplikation.kino.repository.SitzplatzRepository;

@Service
public class SaalService {

    private final SaalRepository saalRepo;
    private final SitzplatzRepository sitzplatzRepo;

    public SaalService(SaalRepository saalRepo, SitzplatzRepository sitzplatzRepo) {
        this.saalRepo = saalRepo;
        this.sitzplatzRepo = sitzplatzRepo;
    }

    @Transactional
    public boolean addSaal(Saal saal) {
        if (saal == null) throw new IllegalArgumentException("Saal cannot be null");

        if (saal.getMaxReihen() <= 0 || saal.getMaxReihen() > 26)
            throw new IllegalArgumentException("maxReihen muss zwischen 1 und 26 liegen");

        if (saal.getPlaetzePerReihe() <= 0)
            throw new IllegalArgumentException("plaetzePerReihe muss mindestens 1 sein");

        if (saal.getLogeAnteilProzent() < 0 || saal.getLogeAnteilProzent() > 100)
            throw new IllegalArgumentException("logeAnteilProzent muss zwischen 0 und 100 liegen");

        // Saal speichern -> ID
        Saal saved = saalRepo.save(saal);
        if (saved == null || saved.getId() == null) return false;

        // Default Name falls leer
        String n = saved.getSaalName();
        if (n == null || n.trim().isEmpty()) {
            saved.setSaalName("Saal " + saved.getId());
            saved = saalRepo.save(saved);
        }

        // Sitze nur erzeugen, wenn noch keine existieren
        long existing = sitzplatzRepo.countBySaalSaalId(saved.getId());
        if (existing == 0) generateSeats(saved);

        return true;
    }

    private void generateSeats(Saal saal) {
        int rows = saal.getMaxReihen();
        int seatsPerRow = saal.getPlaetzePerReihe();
        int logePercent = saal.getLogeAnteilProzent();

        int logeRows = (int) Math.ceil(rows * (logePercent / 100.0));
        int logeStartRow = Math.max(1, rows - logeRows + 1);

        for (int r = 1; r <= rows; r++) {
            boolean isLoge = (logeRows > 0) && (r >= logeStartRow);
            String bereich = isLoge ? "Loge" : "Parkett";

            for (int p = 1; p <= seatsPerRow; p++) {
                Sitzplatz s = new Sitzplatz();
                s.setReihe(r);
                s.setPlatzNr(p);
                s.setBereich(bereich);
                s.setSaal(saal);
                sitzplatzRepo.save(s);
            }
        }
    }

    public List<Saal> listeSaele() {
        return saalRepo.findAll();
    }

    public Saal getSaalById(Long id) {
        if (id == null) throw new IllegalArgumentException("ID cannot be null");
        return saalRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Saal not found"));
    }

    public void deleteSaal(Long id) {
        if (id == null) throw new IllegalArgumentException("ID cannot be null");
        saalRepo.deleteById(id);
    }
}
