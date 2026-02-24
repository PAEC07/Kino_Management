package de.kinoapplikation.kino.service;

import java.util.List;

import org.springframework.stereotype.Service;

import de.kinoapplikation.kino.entity.Vorstellung;
import de.kinoapplikation.kino.repository.VorstellungRepository;

@Service
public class VorstellungService {

    private final VorstellungRepository vorstellungRepo;

    public VorstellungService(VorstellungRepository vorstellungRepo) {
        this.vorstellungRepo = vorstellungRepo;
    }

    public Vorstellung addVorstellung(Vorstellung v) {
        if (v == null) {
            throw new IllegalArgumentException("Vorstellung cannot be null");
        }
        // Prevent double-booking of the same Saal: check for overlapping Vorstellungen
        if (v.getSaalId() != null && v.getDatum() != null) {
            Long saalId = v.getSaalId().getId();
            try {
                var existing = vorstellungRepo.findBySaalIdValue(saalId);
                java.time.LocalDateTime newStart = v.getDatum();
                java.time.Duration newDur = java.time.Duration.ZERO;
                if (v.getFilmId() != null && v.getFilmId().getFilmdauer() != null) newDur = v.getFilmId().getFilmdauer();
                java.time.LocalDateTime newEnd = newStart.plus(newDur == null ? java.time.Duration.ZERO : newDur);

                // Buffer time between Vorstellungen (default 15 minutes)
                java.time.Duration buffer = java.time.Duration.ofMinutes(15);
                for (var ex : existing) {
                    if (ex.getDatum() == null) continue;
                    java.time.Duration exDur = java.time.Duration.ZERO;
                    if (ex.getFilmId() != null && ex.getFilmId().getFilmdauer() != null) exDur = ex.getFilmId().getFilmdauer();
                    java.time.LocalDateTime exStart = ex.getDatum();
                    java.time.LocalDateTime exEnd = exStart.plus(exDur == null ? java.time.Duration.ZERO : exDur);

                    // Überlappung prüfen inkl. Pufferzeit: zwei Vorstellungen gelten als
                    // überschneidend, wenn der Start der einen vor dem Ende der anderen
                    // plus Puffer liegt und vice versa.
                    boolean overlap = newStart.isBefore(exEnd.plus(buffer)) && exStart.isBefore(newEnd.plus(buffer));
                    if (overlap) {
                        throw new IllegalArgumentException("Vorstellung überschneidet sich mit einer bestehenden Vorstellung im selben Saal (inkl. Puffer): " + ex.getId());
                    }
                }
            } catch (IllegalArgumentException e) {
                throw e;
            } catch (Exception ignored) {}
        }

        return vorstellungRepo.save(v);
    }

    public void deleteVorstellung(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        vorstellungRepo.deleteById(id);
    }

    public Vorstellung getVorstellung(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return vorstellungRepo.findById(id).orElse(null);
    }

    public List<Vorstellung> alleVorstellungen() {
        return vorstellungRepo.findAll();
    }

}
