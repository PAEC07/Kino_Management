package de.kinoapplikation.kino.service;

import java.util.List;

import org.springframework.stereotype.Service;

import de.kinoapplikation.kino.entity.Film;
import de.kinoapplikation.kino.repository.FilmRepository;

@Service
public class FilmService {

    private final FilmRepository filmRepo;

    public FilmService(FilmRepository filmRepo) {
        this.filmRepo = filmRepo;
    }

    public Film addFilm(Film film) {
        if (film == null) {
            throw new IllegalArgumentException("Film cannot be null");
        }
        return filmRepo.save(film);
    }

    public void deleteFilm(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        filmRepo.deleteById(id);
    }

    public List<Film> getAlleFilme() {
        return filmRepo.findAll();
    }

    public Film getFilm(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return filmRepo.findById(id).orElse(null);
    }

    public List<Film> filterByGenre(String genre) {
        return filmRepo.findAll().stream()
                .filter(f -> f.getKategorie().equalsIgnoreCase(genre))
                .toList();
    }
}