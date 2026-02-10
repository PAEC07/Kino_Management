package de.kinoapplikation.kino.dto;

import java.time.LocalDateTime;
import de.kinoapplikation.kino.entity.Vorstellung;

public class VorstellungDto {
    public Long id;
    public LocalDateTime datum;
    public Long filmId;
    public Long saalId;

    public VorstellungDto() {}

    public VorstellungDto(Long id, LocalDateTime datum, Long filmId, Long saalId) {
        this.id = id;
        this.datum = datum;
        this.filmId = filmId;
        this.saalId = saalId;
    }

    public static VorstellungDto fromEntity(Vorstellung v) {
        if (v == null) return null;
        Long fId = v.getFilmId() != null ? v.getFilmId().getId() : null;
        Long sId = v.getSaalId() != null ? v.getSaalId().getId() : null;
        return new VorstellungDto(v.getId(), v.getDatum(), fId, sId);
    }
}
