package de.kinoapplikation.kino.service;

import de.kinoapplikation.kino.entity.Buchung;
import de.kinoapplikation.kino.entity.Tickets;
import de.kinoapplikation.kino.repository.BuchungRepository;
import de.kinoapplikation.kino.repository.TicketsRepository;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BuchungService {

    private final BuchungRepository buchungRepo;
    private final TicketsRepository ticketsRepo;

    public BuchungService(BuchungRepository buchungRepo, TicketsRepository ticketsRepo) {
        this.buchungRepo = buchungRepo;
        this.ticketsRepo = ticketsRepo;
    }

    public Buchung buchen(Buchung b) {
        if (b == null) {
            throw new IllegalArgumentException("Buchung cannot be null");
        }
        return buchungRepo.save(b);
    }

    public void stornieren(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        buchungRepo.deleteById(id);
    }

    public Buchung getBuchung(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return buchungRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Buchung not found"));
    }

    public List<Tickets> ticketsDesBenutzers(Long benutzerId) {
        if (benutzerId == null) {
            throw new IllegalArgumentException("Benutzer ID cannot be null");
        }
        return ticketsRepo.findAll().stream()
                .filter(f -> f.getBenutzerId().equals(benutzerId))
                .toList();
    }

    /*
    Diese Methode kann theoretisch alle tickets eines Benutzers zurückgeben. 
    Jedoch soll jetzt aus den gefundenen tickets die buchungsId herausgefiltert werden und dann sollen alle gefundenen buchungsIds mit dem buchungsRepo aufgelistet werden.
    */
    public List<Buchung> buchungenDesBenutzers(Long benutzerId) {
        if (benutzerId == null) {
            throw new IllegalArgumentException("Benutzer ID cannot be null");
        }

        List<Tickets> benutzerTickets = ticketsRepo.findAll().stream()
                .filter(f -> f.getBenutzerId().equals(benutzerId))
                .toList();

        List<Long> buchungsIds = benutzerTickets.stream()
                .map(Tickets::getBuchungId)
                .distinct()
                .toList();

        List<Buchung> buchungen = buchungsIds.stream()
                .flatMap(buchungId -> buchungRepo.findById(buchungId).stream())
                .toList();

        return buchungen;
    }

    public List<Buchung> alleBuchungen() {
        return buchungRepo.findAll();
    }
}
