package de.kinoapplikation.kino.service;

import de.kinoapplikation.kino.dto.CheckoutDtos;
import de.kinoapplikation.kino.entity.*;
import de.kinoapplikation.kino.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BuchungService {

    private final BuchungRepository buchungRepo;
    private final TicketsRepository ticketsRepo;
    private final BenutzerRepository benutzerRepo;
    private final VorstellungRepository vorstellungRepo;
    private final SitzplatzRepository sitzplatzRepo;

    public BuchungService(
            BuchungRepository buchungRepo,
            TicketsRepository ticketsRepo,
            BenutzerRepository benutzerRepo,
            VorstellungRepository vorstellungRepo,
            SitzplatzRepository sitzplatzRepo
    ) {
        this.buchungRepo = buchungRepo;
        this.ticketsRepo = ticketsRepo;
        this.benutzerRepo = benutzerRepo;
        this.vorstellungRepo = vorstellungRepo;
        this.sitzplatzRepo = sitzplatzRepo;
    }

    public List<Buchung> alleBuchungen() {
        return buchungRepo.findAll();
    }

    public List<Buchung> alleBuchungenByBenutzer(Long benutzerId) {
        return buchungRepo.findByBenutzerId(benutzerId);
    }

    public Buchung getBuchung(Long id) {
        return buchungRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Buchung not found"));
    }

    public void stornieren(Long id) {
        if (id == null) throw new IllegalArgumentException("ID cannot be null");

        // ✅ erst Tickets der Buchung löschen
        ticketsRepo.findAll().stream()
                .filter(t -> t.getBuchungId() != null && t.getBuchungId().equals(id))
                .forEach(t -> ticketsRepo.deleteById(t.getTicketId()));

        // ✅ dann Buchung löschen
        buchungRepo.deleteById(id);
    }

    @Transactional
    public CheckoutDtos.CheckoutResponse checkout(CheckoutDtos.CheckoutRequest req) {
        if (req == null || req.benutzerId == null || req.vorstellungId == null || req.sitzplatzIds == null || req.sitzplatzIds.isEmpty()) {
            return new CheckoutDtos.CheckoutResponse(false, "benutzerId, vorstellungId und sitzplatzIds sind Pflicht", null, 0);
        }

        Benutzer user = benutzerRepo.findById(req.benutzerId)
                .orElseThrow(() -> new IllegalArgumentException("Benutzer nicht gefunden"));

        Vorstellung show = vorstellungRepo.findById(req.vorstellungId)
                .orElseThrow(() -> new IllegalArgumentException("Vorstellung nicht gefunden"));

        long base = 0;
        Film film = show.getFilmId();
        if (film != null && film.getBasispreis() != null) {
            base = film.getBasispreis(); // cents
        }

        // Buchung anlegen
        Buchung b = new Buchung();
        b.setBenutzer(user);
        b.setDatum(LocalDateTime.now());
        Buchung savedBooking = buchungRepo.save(b);

        long total = 0;

        for (Long seatId : req.sitzplatzIds) {
            Sitzplatz seat = sitzplatzRepo.findById(seatId)
                    .orElseThrow(() -> new IllegalArgumentException("Sitzplatz nicht gefunden: " + seatId));

            // Check: Seat belegt?
            long already = sitzplatzRepo.countTicketForSeatAndShow(req.vorstellungId, seatId);
            if (already > 0) {
                throw new IllegalArgumentException("Sitz ist bereits belegt: Reihe " + seat.getReihe() + " Platz " + seat.getPlatzNr());
            }

            long seatPrice = base;

            // OPTIONAL: Loge Aufschlag (z.B. +10%)
            if (seat.getBereich() != null && seat.getBereich().toLowerCase().contains("loge")) {
                seatPrice = Math.round(seatPrice * 1.10);
            }

            total += seatPrice;

            Tickets t = new Tickets();
            t.setBenutzerId(user);
            t.setVorstellungId(show);
            t.setSitzplatz(seat);
            t.setBuchungId(savedBooking.getId());

            ticketsRepo.save(t);
        }

        return new CheckoutDtos.CheckoutResponse(true, "Buchung gespeichert", savedBooking.getId(), total);
    }
}
