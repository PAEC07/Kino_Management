package de.kinoapplikation.kino.service;


import de.kinoapplikation.kino.entity.Vorstellung;
import de.kinoapplikation.kino.repository.VorstellungRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VorstellungService {

    private final VorstellungRepository vorstellungRepo;

    public VorstellungService(VorstellungRepository vorstellungRepo) {
        this.vorstellungRepo = vorstellungRepo;
    }

    public Vorstellung addVorstellung(Vorstellung v) {
        return vorstellungRepo.save(v);
    }
    public void deleteVorstellung(Long id) { vorstellungRepo.deleteById(id); }
    public List<Vorstellung> alleVorstellungen() { return vorstellungRepo.findAll(); }

}
