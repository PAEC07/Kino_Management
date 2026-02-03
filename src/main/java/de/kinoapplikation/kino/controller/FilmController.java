package de.kinoapplikation.kino.controller;

import de.kinoapplikation.kino.entity.Film;
import de.kinoapplikation.kino.service.FilmService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/filme")
public class FilmController {

    private final FilmService filmService;

    public FilmController(FilmService filmService) {
        this.filmService = filmService;
    }

    @GetMapping("/list")
    public List<Film> alleFilme() {
        return filmService.getAlleFilme();
    }


    @GetMapping("/{id}/get")
    public Film getFilm(@PathVariable Long id) {
        return filmService.getFilm(id);
    }

    @GetMapping("/filter")
    public List<Film> filter(@RequestParam String genre) {
        return filmService.filterByGenre(genre);
    }

    @PostMapping("/add")
    public Film addFilm(@RequestBody Film film) {
        return filmService.addFilm(film);
    }

    @DeleteMapping("/{id}/delete")
    public void deleteFilm(@PathVariable Long id) {
        filmService.deleteFilm(id);
    }
}
