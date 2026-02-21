package de.kinoapplikation.kino.service;

import de.kinoapplikation.kino.dto.TicketViewDto;
import de.kinoapplikation.kino.entity.*;
import de.kinoapplikation.kino.repository.TicketsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketsService {

    private final TicketsRepository ticketsRepo;

    public TicketsService(TicketsRepository ticketsRepo) {
        this.ticketsRepo = ticketsRepo;
    }

    public List<TicketViewDto> ticketsFuerUser(Long userId) {
        if (userId == null) throw new IllegalArgumentException("userId darf nicht null sein");

        return ticketsRepo.findByBenutzerId_Id(userId).stream()
                .map(this::toDto)
                .toList();
    }

    private TicketViewDto toDto(Tickets t) {
        TicketViewDto dto = new TicketViewDto();

        dto.ticketId = t.getTicketId();
        dto.buchungId = t.getBuchungId();

        Vorstellung v = t.getVorstellungId();
        Film f = (v != null) ? v.getFilmId() : null;
        Saal s = (v != null) ? v.getSaalId() : null;

        dto.datum = (v != null) ? v.getDatum() : null;
        dto.saalName = (s != null) ? s.getSaalName() : null;

        if (f != null) {
            dto.filmTitel = f.getFilmname();
            dto.beschreibung = f.getBeschreibung();
            dto.fsk = f.getFsk();
            dto.format = f.getDarstellungstyp();
            dto.kategorie = f.getKategorie();
            dto.preisCents = (f.getBasispreis() != null) ? f.getBasispreis() : 0L;
        } else {
            dto.preisCents = 0L;
        }

        Sitzplatz sp = t.getSitzplatz();
        if (sp != null) {
            dto.reihe = sp.getReihe();
            dto.platzNr = sp.getPlatzNr();
            dto.bereich = sp.getBereich();

            if (dto.bereich != null && dto.bereich.toLowerCase().contains("loge")) {
                dto.preisCents = Math.round(dto.preisCents * 1.10);
            }
        }

        return dto;
    }
}