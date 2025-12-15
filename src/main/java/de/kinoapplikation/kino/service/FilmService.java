package de.kinoapplikation.kino.service;


import de.kinoapplikation.kino.entity.Film;
import de.kinoapplikation.kino.repository.FilmRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FilmService {

    private final FilmRepository filmRepo;

    public FilmService(FilmRepository filmRepo) {
        this.filmRepo = filmRepo;
    }

    public Film addFilm(Film film) { return filmRepo.save(film); }
    public void deleteFilm(Long id) { filmRepo.deleteById(id); }
    public List<Film> getAlleFilme() { return filmRepo.findAll(); }

    public List<Film> filterByGenre(String genre) {
        return filmRepo.findAll().stream()
                .filter(f -> f.getGenre().equalsIgnoreCase(genre))
                .toList();
    }
}
