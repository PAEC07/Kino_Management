package de.kinoapplikation.kino.controller;

import de.kinoapplikation.kino.dto.TicketViewDto;
import de.kinoapplikation.kino.service.TicketsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketsController {

    private final TicketsService ticketsService;

    public TicketsController(TicketsService ticketsService) {
        this.ticketsService = ticketsService;
    }

    @GetMapping("/user/{userId}")
    public List<TicketViewDto> ticketsUser(@PathVariable Long userId) {
        return ticketsService.ticketsFuerUser(userId);
    }
}