package de.kinoapplikation.kino.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.kinoapplikation.kino.dto.TicketViewDto;
import de.kinoapplikation.kino.service.TicketsService;

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

    @DeleteMapping("/{ticketId}")
    public void deleteTicket(@PathVariable Integer ticketId) {
        ticketsService.deleteTicketById(ticketId);
    }
}