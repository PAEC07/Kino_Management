/*document.addEventListener('DOMContentLoaded', () => {
    // DOM-Referenzen
    const movieListEl = document.getElementById('movieList');
    const vorstellungenTbody = document.getElementById('vorstellungenTbody');

    const listenView = document.getElementById('listenView');
    const kalenderView = document.getElementById('kalenderView');
    const btnViewList = document.getElementById('btnViewList');
    const btnViewCalendar = document.getElementById('btnViewCalendar');

    const kalenderBody = document.getElementById('kalenderBody');
    const kalMonatLabel = document.getElementById('kalMonatLabel');
    const kalPrev = document.getElementById('kalPrev');
    const kalNext = document.getElementById('kalNext');

    // Filter / Suche
    const filterFormat = document.getElementById('filterFormat');
    const filterFsk = document.getElementById('filterFsk');
    const filterStil = document.getElementById('filterStil');
    const btnFilterApply = document.getElementById('btnFilterApply');
    const filmSuche = document.getElementById('filmSuche');
    const suchBtn = document.getElementById('suchBtn');
    const filterModal = document.getElementById('filterModal');
    const btnFilterOpen = document.getElementById('btnFilterOpen');
    const filterCloseButtons = filterModal ? filterModal.querySelectorAll('[data-filter-close]') : [];

    // Modals
    const modalOverlay = document.getElementById('modalOverlay');
    const modalFilm = document.getElementById('modalFilm');
    const modalVorstellung = document.getElementById('modalVorstellung');
    const modalSitzplan = document.getElementById('modalSitzplan');
    const modalSaal = document.getElementById('modalSaal');
    const modalSaalInfo = document.getElementById('modalSaalInfo');
    const modalShowInfo = document.getElementById('modalShowInfo');

    const btnOpenFilmModal = document.getElementById('btnOpenFilmModal');
    const btnOpenVorstellungModal = document.getElementById('btnOpenVorstellungModal');
    const btnOpenSitzplanModal = document.getElementById('btnOpenSitzplanModal');
    const btnOpenSaalModal = document.getElementById('btnOpenSaalModal');
    const closeFilmModal = document.getElementById('closeFilmModal');
    const closeVorstellungModal = document.getElementById('closeVorstellungModal');
    const closeSitzplanModal = document.getElementById('closeSitzplanModal');
    const closeSaalModal = document.getElementById('closeSaalModal');
    const closeSaalInfoModal = document.getElementById('closeSaalInfoModal');
    const closeShowInfoModal = document.getElementById('closeShowInfoModal');

    // Film-Form
    const filmTitelInput = document.getElementById('filmTitelInput');
    const filmBeschreibungInput = document.getElementById('filmBeschreibungInput');
    const filmFskInput = document.getElementById('filmFskInput');
    const filmFormatInput = document.getElementById('filmFormatInput');
    const filmKategorieInput = document.getElementById('filmKategorieInput');
    const filmLaufzeitInput = document.getElementById('filmLaufzeitInput');
    const filmPreisInput = document.getElementById('filmPreisInput');
    const filmSaveBtn = document.getElementById('filmSaveBtn');

    // Vorstellung-Form
    const vorstellungFilmSelect = document.getElementById('vorstellungFilmSelect');
    const vorstellungDatumInput = document.getElementById('vorstellungDatumInput');
    const vorstellungZeitInput = document.getElementById('vorstellungZeitInput');
    const vorstellungSaalInput = document.getElementById('vorstellungSaalInput');
    const vorstellungSaveBtn = document.getElementById('vorstellungSaveBtn');

    // Sitzplan-Form
    const anzahlReihenInput = document.getElementById('anzahlReihenInput');
    const sitzeProReiheInput = document.getElementById('sitzeProReiheInput');
    const prozentLogeInput = document.getElementById('prozentLogeInput');
    const sitzplanSaveBtn = document.getElementById('sitzplanSaveBtn');

    // Säle
    const saeleTbody = document.getElementById('saeleTbody');
    const saalModalTitle = document.getElementById('saalModalTitle');
    const saalNameInput = document.getElementById('saalNameInput');
    const saalReihenInput = document.getElementById('saalReihenInput');
    const saalSitzeInput = document.getElementById('saalSitzeInput');
    const saalLogeInput = document.getElementById('saalLogeInput');
    const saalSaveBtn = document.getElementById('saalSaveBtn');
    const saalInfoTitle = document.getElementById('saalInfoTitle');
    const saalInfoMeta = document.getElementById('saalInfoMeta');
    const saalInfoSeatContainer = document.getElementById('saalInfoSeatContainer');
    const saalInfoCloseBtn = document.getElementById('saalInfoCloseBtn');

    const showInfoTitle = document.getElementById('showInfoTitle');
    const showInfoFilm = document.getElementById('showInfoFilm');
    const showInfoDate = document.getElementById('showInfoDate');
    const showInfoTime = document.getElementById('showInfoTime');
    const showInfoSaal = document.getElementById('showInfoSaal');
    const showInfoRuntime = document.getElementById('showInfoRuntime');
    const showInfoCloseBtn = document.getElementById('showInfoCloseBtn');

    // Daten (Demo)
    let nextMovieId = 4;
    let nextShowId = 7;
    let nextHallId = 4;

    let movies = [
        {
            id: 1,
            titel: 'Film 1',
            beschreibung: 'Spannender Actionfilm.',
            fsk: '16',
            format: '3D',
            kategorie: 'Action',
            laufzeit: 120,
            preis: 12.99
        },
        {
            id: 2,
            titel: 'Film 2',
            beschreibung: 'Romantische Komödie.',
            fsk: '12',
            format: '2D',
            kategorie: 'Komödie',
            laufzeit: 105,
            preis: 9.99
        },
        {
            id: 3,
            titel: 'Film 3',
            beschreibung: 'Science-Fiction Abenteuer.',
            fsk: '6',
            format: '3D',
            kategorie: 'Sci-Fi',
            laufzeit: 132,
            preis: 14.5
        }
    ];

    let shows = [
        { id: 1, filmId: 1, datum: '2025-11-25', uhrzeit: '18:00', saal: 'Saal 1' },
        { id: 2, filmId: 1, datum: '2025-11-25', uhrzeit: '20:30', saal: 'Saal 1' },
        { id: 3, filmId: 1, datum: '2025-11-26', uhrzeit: '17:45', saal: 'Saal 2' },
        { id: 4, filmId: 2, datum: '2025-11-25', uhrzeit: '19:15', saal: 'Saal 3' },
        { id: 5, filmId: 2, datum: '2025-11-26', uhrzeit: '21:00', saal: 'Saal 3' },
        { id: 6, filmId: 3, datum: '2025-11-26', uhrzeit: '16:00', saal: 'Saal 2' }
    ];

    let halls = [
        { id: 1, name: 'Saal 1', rows: 6, seatsPerRow: 10, logePercent: 25 },
        { id: 2, name: 'Saal 2', rows: 5, seatsPerRow: 8, logePercent: 20 },
        { id: 3, name: 'Saal 3', rows: 7, seatsPerRow: 12, logePercent: 30 }
    ];

    let currentMovieId = null;

    // ============================
    // Helper
    // ============================
    function openModal(which) {
        modalOverlay.classList.remove('hidden');
        modalFilm.classList.add('hidden');
        modalVorstellung.classList.add('hidden');
        modalSitzplan.classList.add('hidden');
        modalSaal.classList.add('hidden');
        modalSaalInfo.classList.add('hidden');
        modalShowInfo.classList.add('hidden');

        if (which === 'film') {
            modalFilm.classList.remove('hidden');
        } else if (which === 'show') {
            modalVorstellung.classList.remove('hidden');
        } else if (which === 'sitzplan') {
            modalSitzplan.classList.remove('hidden');
        } else if (which === 'saal') {
            modalSaal.classList.remove('hidden');
        } else if (which === 'saal-info') {
            modalSaalInfo.classList.remove('hidden');
        } else if (which === 'show-info') {
            modalShowInfo.classList.remove('hidden');
        }
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        modalFilm.classList.add('hidden');
        modalVorstellung.classList.add('hidden');
        modalSitzplan.classList.add('hidden');
        modalSaal.classList.add('hidden');
        modalSaalInfo.classList.add('hidden');
        modalShowInfo.classList.add('hidden');
    }

    function getMovieById(id) {
        return movies.find(m => m.id === id) || null;
    }

    function formatEuro(wert) {
        const n = isNaN(wert) ? 0 : Number(wert);
        return n.toFixed(2).replace('.', ',') + ' €';
    }

    function buildSeatPlan(container, config) {
        if (!container || !config) return;
        container.innerHTML = '';

        for (let i = 1; i <= config.rows; i++) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('sitzreihe');

            const label = document.createElement('span');
            label.classList.add('sitzreihe-label');
            label.textContent = String.fromCharCode(64 + i);
            rowDiv.appendChild(label);

            const isLogeRow = i > config.rows * (1 - config.logePercent / 100);

            for (let seatIdx = 1; seatIdx <= config.seatsPerRow; seatIdx++) {
                const seat = document.createElement('span');
                seat.classList.add('sitz', isLogeRow ? 'premium' : 'standard');
                seat.textContent = seatIdx;
                rowDiv.appendChild(seat);
            }

            container.appendChild(rowDiv);
        }
    }

    // ============================
    // Filme rendern / filtern
    // ============================
    function renderMovieList() {
        if (!movieListEl) return;
        movieListEl.innerHTML = '';

        const searchText = (filmSuche?.value || '').toLowerCase().trim();
        const wantFormat = (filterFormat?.value || '').toUpperCase();
        const wantFsk = filterFsk?.value || '';
        const wantStil = (filterStil?.value || '').toLowerCase();

        movies.forEach(movie => {
            let visible = true;

            if (wantFormat && movie.format.toUpperCase() !== wantFormat) visible = false;
            if (wantFsk && movie.fsk !== wantFsk) visible = false;
            if (wantStil && movie.kategorie.toLowerCase() !== wantStil) visible = false;
            if (searchText && !movie.titel.toLowerCase().includes(searchText)) visible = false;

            if (!visible) return;

            const li = document.createElement('li');
            li.classList.add('movie-item');
            li.dataset.movieId = String(movie.id);

            if (movie.id === currentMovieId) {
                li.classList.add('selected');
            }

            const row = document.createElement('div');
            row.classList.add('movie-row');

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('movie-info');

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('movie-title');
            titleDiv.textContent = movie.titel;

            const metaDiv = document.createElement('div');
            metaDiv.classList.add('movie-meta');
            const laufzeitText = movie.laufzeit ? `${movie.laufzeit} Min` : 'k.A.';
            metaDiv.innerHTML =
                `FSK: ${movie.fsk} • Format: ${movie.format} • Kategorie: ${movie.kategorie} • Laufzeit: ${laufzeitText} • ${formatEuro(movie.preis)}`;

            infoDiv.appendChild(titleDiv);
            infoDiv.appendChild(metaDiv);

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Löschen';

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteMovie(movie.id);
            });

            row.appendChild(infoDiv);
            row.appendChild(deleteBtn);

            li.appendChild(row);

            li.addEventListener('click', () => {
                selectMovie(movie.id);
            });

            movieListEl.appendChild(li);
        });
    }

    function selectMovie(movieId) {
        currentMovieId = movieId;
        renderMovieList();
        renderShowList();
        renderCalendar();
    }

    function deleteMovie(movieId) {
        const movie = getMovieById(movieId);
        if (!movie) return;

        if (!confirm(`Film "${movie.titel}" und alle zugehörigen Vorstellungen wirklich löschen?`)) {
            return;
        }

        movies = movies.filter(m => m.id !== movieId);
        shows = shows.filter(s => s.filmId !== movieId);

        if (currentMovieId === movieId) {
            currentMovieId = null;
        }

        renderMovieList();
        renderShowList();
        renderCalendar();
        fillVorstellungFilmSelect();
    }

    // ============================
    // Vorstellungen rendern
    // ============================
    function renderShowList() {
        if (!vorstellungenTbody) return;
        vorstellungenTbody.innerHTML = '';

        let filteredShows = shows;
        if (currentMovieId != null) {
            filteredShows = shows.filter(s => s.filmId === currentMovieId);
        }

        if (!filteredShows.length) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 5;
            td.textContent = 'Keine Vorstellungen vorhanden.';
            tr.appendChild(td);
            vorstellungenTbody.appendChild(tr);
            return;
        }

        filteredShows
            .sort((a, b) => a.datum.localeCompare(b.datum) || a.uhrzeit.localeCompare(b.uhrzeit))
            .forEach(show => {
                const movie = getMovieById(show.filmId);
                const tr = document.createElement('tr');

                const tdDatum = document.createElement('td');
                const tdFilm = document.createElement('td');
                const tdZeit = document.createElement('td');
                const tdSaal = document.createElement('td');
                const tdAktion = document.createElement('td');

                tdDatum.textContent = show.datum;
                tdFilm.textContent = movie ? movie.titel : 'Unbekannt';
                tdZeit.textContent = show.uhrzeit;
                tdSaal.textContent = show.saal;

                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.textContent = 'Löschen';
                deleteBtn.addEventListener('click', () => {
                    deleteShow(show.id);
                });

                tdAktion.appendChild(deleteBtn);

                tr.appendChild(tdDatum);
                tr.appendChild(tdFilm);
                tr.appendChild(tdZeit);
                tr.appendChild(tdSaal);
                tr.appendChild(tdAktion);

                vorstellungenTbody.appendChild(tr);
            });
    }

    // ============================
    // Säle rendern
    // ============================
    function renderHallList() {
        if (!saeleTbody) return;
        saeleTbody.innerHTML = '';

        if (!halls.length) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 5;
            td.textContent = 'Keine Säle vorhanden.';
            tr.appendChild(td);
            saeleTbody.appendChild(tr);
            return;
        }

        halls.forEach(hall => {
            const tr = document.createElement('tr');

            const tdName = document.createElement('td');
            const tdRows = document.createElement('td');
            const tdSeats = document.createElement('td');
            const tdLoge = document.createElement('td');
            const tdAction = document.createElement('td');

            tdName.textContent = hall.name;
            tdRows.textContent = String(hall.rows);
            tdSeats.textContent = String(hall.seatsPerRow);
            tdLoge.textContent = `${hall.logePercent}%`;

            const infoBtn = document.createElement('button');
            infoBtn.type = 'button';
            infoBtn.classList.add('table-action-btn');
            infoBtn.textContent = 'Information';
            infoBtn.addEventListener('click', () => openHallInfo(hall.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Löschen';
            deleteBtn.addEventListener('click', () => deleteHall(hall.id));

            const actionWrap = document.createElement('div');
            actionWrap.classList.add('table-action-wrap');
            actionWrap.appendChild(infoBtn);
            actionWrap.appendChild(deleteBtn);

            tdAction.appendChild(actionWrap);

            tr.appendChild(tdName);
            tr.appendChild(tdRows);
            tr.appendChild(tdSeats);
            tr.appendChild(tdLoge);
            tr.appendChild(tdAction);

            saeleTbody.appendChild(tr);
        });
    }

    function getHallById(hallId) {
        return halls.find(h => h.id === hallId) || null;
    }

    function openHallInfo(hallId) {
        const hall = getHallById(hallId);
        if (!hall) return;

        if (saalInfoTitle) saalInfoTitle.textContent = hall.name;
        if (saalInfoMeta) {
            saalInfoMeta.textContent = `Reihen: ${hall.rows} • Sitze/ Reihe: ${hall.seatsPerRow} • Loge: ${hall.logePercent}%`;
        }

        buildSeatPlan(saalInfoSeatContainer, hall);
        openModal('saal-info');
    }

    function openShowInfo(show) {
        if (!show) return;
        const movie = getMovieById(show.filmId);
        const laufzeitText = movie && movie.laufzeit ? `${movie.laufzeit} Min` : 'k.A.';

        if (showInfoTitle) showInfoTitle.textContent = 'Vorstellung';
        if (showInfoFilm) showInfoFilm.textContent = movie ? movie.titel : 'Unbekannt';
        if (showInfoDate) showInfoDate.textContent = show.datum;
        if (showInfoTime) showInfoTime.textContent = show.uhrzeit;
        if (showInfoSaal) showInfoSaal.textContent = show.saal;
        if (showInfoRuntime) showInfoRuntime.textContent = laufzeitText;

        openModal('show-info');
    }

    function deleteHall(hallId) {
        const hall = getHallById(hallId);
        if (!hall) return;

        if (!confirm(`Saal "${hall.name}" wirklich löschen?`)) {
            return;
        }

        halls = halls.filter(h => h.id !== hallId);
        renderHallList();
    }

    function deleteShow(showId) {
        const show = shows.find(s => s.id === showId);
        if (!show) return;

        const movie = getMovieById(show.filmId);
        const filmTitel = movie ? movie.titel : 'Unbekannt';

        if (!confirm(`Vorstellung von "${filmTitel}" am ${show.datum} um ${show.uhrzeit} löschen?`)) {
            return;
        }

        shows = shows.filter(s => s.id !== showId);
        renderShowList();
        renderCalendar();
    }

    // ============================
    // Kalender
    // ============================
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function getMonatsName(monthIndex) {
        const namen = [
            'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ];
        return namen[monthIndex] || '';
    }

    function renderCalendar() {
        if (!kalenderBody || !kalMonatLabel) return;

        kalenderBody.innerHTML = '';
        kalMonatLabel.textContent = `${getMonatsName(currentMonth)} ${currentYear}`;

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startWochentag = (firstDay.getDay() + 6) % 7;
        const tageImMonat = lastDay.getDate();

        let relevantShows = shows;
        if (currentMovieId != null) {
            relevantShows = shows.filter(s => s.filmId === currentMovieId);
        }

        const mapDatumZuShows = {};
        relevantShows.forEach(show => {
            if (!mapDatumZuShows[show.datum]) {
                mapDatumZuShows[show.datum] = [];
            }
            mapDatumZuShows[show.datum].push(show);
        });

        let aktuellerTag = 1;
        for (let zeile = 0; zeile < 6; zeile++) {
            const tr = document.createElement('tr');

            for (let wochentag = 0; wochentag < 7; wochentag++) {
                const td = document.createElement('td');

                if ((zeile === 0 && wochentag < startWochentag) || aktuellerTag > tageImMonat) {
                    td.classList.add('kalender-empty');
                } else {
                    const day = aktuellerTag;
                    const daySpan = document.createElement('span');
                    daySpan.classList.add('tag-nr');
                    daySpan.textContent = day;
                    td.appendChild(daySpan);

                    const dateStr =
                        `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const showsForDate = mapDatumZuShows[dateStr] || [];

                    showsForDate.forEach(show => {
                        const movie = getMovieById(show.filmId);
                        const ev = document.createElement('span');
                        ev.classList.add('kal-event');
                        ev.textContent =
                            `${show.uhrzeit} • ${show.saal} • ${(movie && movie.titel) || 'Unbekannt'}`;
                        ev.addEventListener('click', (e) => {
                            e.stopPropagation();
                            openShowInfo(show);
                        });
                        td.appendChild(ev);
                    });

                    aktuellerTag++;
                }

                tr.appendChild(td);
            }
            kalenderBody.appendChild(tr);
        }
    }

    if (kalPrev) {
        kalPrev.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }

    if (kalNext) {
        kalNext.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }

    // ============================
    // Ansicht umschalten
    // ============================
    function setView(mode) {
        if (!listenView || !kalenderView || !btnViewList || !btnViewCalendar) return;

        if (mode === 'list') {
            listenView.classList.remove('hidden');
            kalenderView.classList.add('hidden');
            btnViewList.classList.add('active-view');
            btnViewCalendar.classList.remove('active-view');
        } else {
            listenView.classList.add('hidden');
            kalenderView.classList.remove('hidden');
            btnViewList.classList.remove('active-view');
            btnViewCalendar.classList.add('active-view');
        }
    }

    btnViewList?.addEventListener('click', () => setView('list'));
    btnViewCalendar?.addEventListener('click', () => setView('calendar'));

    // ============================
    // Modals / Form-Handling
    // ============================
    btnOpenFilmModal?.addEventListener('click', () => {
        // Felder leeren
        filmTitelInput.value = '';
        filmBeschreibungInput.value = '';
        filmFskInput.value = '';
        filmFormatInput.value = '';
        filmKategorieInput.value = '';
        filmLaufzeitInput.value = '';
        filmPreisInput.value = '';
        openModal('film');
    });

    btnOpenVorstellungModal?.addEventListener('click', () => {
        fillVorstellungFilmSelect();
        vorstellungDatumInput.value = '';
        vorstellungZeitInput.value = '';
        vorstellungSaalInput.value = '';
        openModal('show');
    });

    btnOpenSitzplanModal?.addEventListener('click', () => {
        loadSitzplanConfig();
        openModal('sitzplan');
    });

    btnOpenSaalModal?.addEventListener('click', () => {
        if (saalModalTitle) saalModalTitle.textContent = 'Saal hinzufügen';
        saalNameInput.value = '';
        saalReihenInput.value = '';
        saalSitzeInput.value = '';
        saalLogeInput.value = '';
        openModal('saal');
    });

    closeFilmModal?.addEventListener('click', closeModal);
    closeVorstellungModal?.addEventListener('click', closeModal);
    closeSitzplanModal?.addEventListener('click', closeModal);
    closeSaalModal?.addEventListener('click', closeModal);
    closeSaalInfoModal?.addEventListener('click', closeModal);
    saalInfoCloseBtn?.addEventListener('click', closeModal);
    closeShowInfoModal?.addEventListener('click', closeModal);
    showInfoCloseBtn?.addEventListener('click', closeModal);

    modalOverlay?.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    filmSaveBtn?.addEventListener('click', () => {
        const titel = filmTitelInput.value.trim();
        const beschr = filmBeschreibungInput.value.trim();
        const fsk = filmFskInput.value;
        const format = filmFormatInput.value;
        const kat = filmKategorieInput.value.trim() || 'Allgemein';
        const laufzeit = parseInt(filmLaufzeitInput.value, 10);
        const preis = parseFloat(filmPreisInput.value.replace(',', '.'));

        if (!titel || !fsk || !format || isNaN(preis) || !laufzeit) {
            alert('Bitte Titel, FSK, Format, Laufzeit und Preis korrekt ausfüllen.');
            return;
        }

        const newMovie = {
            id: nextMovieId++,
            titel,
            beschreibung: beschr,
            fsk,
            format,
            kategorie: kat,
            laufzeit,
            preis
        };

        movies.push(newMovie);
        closeModal();
        renderMovieList();
        fillVorstellungFilmSelect();
    });

    function fillVorstellungFilmSelect() {
        if (!vorstellungFilmSelect) return;
        vorstellungFilmSelect.innerHTML = '';

        if (!movies.length) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'Keine Filme vorhanden';
            vorstellungFilmSelect.appendChild(opt);
            vorstellungFilmSelect.disabled = true;
            return;
        }

        vorstellungFilmSelect.disabled = false;

        movies.forEach(movie => {
            const opt = document.createElement('option');
            opt.value = String(movie.id);
            opt.textContent = movie.titel;
            if (movie.id === currentMovieId) {
                opt.selected = true;
            }
            vorstellungFilmSelect.appendChild(opt);
        });
    }

    function loadSitzplanConfig() {
        const config = JSON.parse(localStorage.getItem('sitzplanConfig')) || { anzahlReihen: 6, sitzeProReihe: 10, prozentLoge: 25 };
        anzahlReihenInput.value = config.anzahlReihen;
        sitzeProReiheInput.value = config.sitzeProReihe;
        prozentLogeInput.value = config.prozentLoge;
    }

    vorstellungSaveBtn?.addEventListener('click', () => {
        const filmIdStr = vorstellungFilmSelect.value;
        const datum = vorstellungDatumInput.value;
        const zeit = vorstellungZeitInput.value;
        const saal = vorstellungSaalInput.value.trim();

        const filmId = parseInt(filmIdStr, 10);
        const movie = getMovieById(filmId);

        if (!movie || !datum || !zeit || !saal) {
            alert('Bitte Film, Datum, Uhrzeit und Saal ausfüllen.');
            return;
        }

        const newShow = {
            id: nextShowId++,
            filmId,
            datum,
            uhrzeit: zeit,
            saal
        };

        shows.push(newShow);
        closeModal();
        renderShowList();
        renderCalendar();
    });

    // ============================
    // Filter / Suche
    // ============================
    function applyFilter() {
        renderMovieList();
    }

    btnFilterApply?.addEventListener('click', applyFilter);

    suchBtn?.addEventListener('click', applyFilter);

    filmSuche?.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            applyFilter();
        }
    });

    function openFilterModal() {
        if (!filterModal) return;
        filterModal.classList.remove('hidden');
        document.body.classList.add('no-scroll');
    }

    function closeFilterModal() {
        if (!filterModal) return;
        filterModal.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    }

    btnFilterOpen?.addEventListener('click', openFilterModal);
    if (filterCloseButtons.length) {
        filterCloseButtons.forEach(btn => btn.addEventListener('click', closeFilterModal));
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && filterModal && !filterModal.classList.contains('hidden')) {
            closeFilterModal();
        }
    });

    sitzplanSaveBtn?.addEventListener('click', () => {
        const anzahlReihen = parseInt(anzahlReihenInput.value);
        const sitzeProReihe = parseInt(sitzeProReiheInput.value);
        const prozentLoge = parseInt(prozentLogeInput.value);

        if (anzahlReihen && sitzeProReihe && prozentLoge >= 0 && prozentLoge <= 100) {
            const config = {
                anzahlReihen,
                sitzeProReihe,
                prozentLoge
            };
            localStorage.setItem('sitzplanConfig', JSON.stringify(config));
            alert('Sitzplan-Konfiguration gespeichert!');
            closeModal();
        } else {
            alert('Bitte gültige Werte eingeben.');
        }
    });

    saalSaveBtn?.addEventListener('click', () => {
        const name = saalNameInput.value.trim();
        const rows = parseInt(saalReihenInput.value, 10);
        const seatsPerRow = parseInt(saalSitzeInput.value, 10);
        const logePercent = parseInt(saalLogeInput.value, 10);

        if (!name || !rows || !seatsPerRow || isNaN(logePercent) || logePercent < 0 || logePercent > 100) {
            alert('Bitte Name, Reihen, Sitze pro Reihe und Loge-Prozent korrekt ausfüllen.');
            return;
        }

        halls.push({
            id: nextHallId++,
            name,
            rows,
            seatsPerRow,
            logePercent
        });

        renderHallList();
        closeModal();
    });

    // ============================
    // Initial
    // ============================
    setView('list');
    renderMovieList();
    renderShowList();
    renderCalendar();
    fillVorstellungFilmSelect();
    renderHallList();
});*/

document.addEventListener('DOMContentLoaded', () => {
  // ============================
  // KONFIG
  // ============================
  const API_BASE = "http://localhost:8080";
  const LS_SAAL_KEY = "kino_admin_saal_map_v2";

  // ============================
  // DOM-Referenzen
  // ============================
  const movieListEl = document.getElementById('movieList');
  const vorstellungenTbody = document.getElementById('vorstellungenTbody');

  const listenView = document.getElementById('listenView');
  const kalenderView = document.getElementById('kalenderView');
  const btnViewList = document.getElementById('btnViewList');
  const btnViewCalendar = document.getElementById('btnViewCalendar');

  const kalenderBody = document.getElementById('kalenderBody');
  const kalMonatLabel = document.getElementById('kalMonatLabel');
  const kalPrev = document.getElementById('kalPrev');
  const kalNext = document.getElementById('kalNext');

  // Filter / Suche
  const filterFormat = document.getElementById('filterFormat'); // UI-only
  const filterFsk = document.getElementById('filterFsk');
  const filterStil = document.getElementById('filterStil');
  const btnFilterApply = document.getElementById('btnFilterApply');
  const filmSuche = document.getElementById('filmSuche');
  const suchBtn = document.getElementById('suchBtn');

  // Modals
  const modalOverlay = document.getElementById('modalOverlay');
  const modalFilm = document.getElementById('modalFilm');
  const modalVorstellung = document.getElementById('modalVorstellung');

  const btnOpenFilmModal = document.getElementById('btnOpenFilmModal');
  const btnOpenVorstellungModal = document.getElementById('btnOpenVorstellungModal');
  const closeFilmModal = document.getElementById('closeFilmModal');
  const closeVorstellungModal = document.getElementById('closeVorstellungModal');

  // Film-Form
  const filmTitelInput = document.getElementById('filmTitelInput');
  const filmBeschreibungInput = document.getElementById('filmBeschreibungInput');
  const filmFskInput = document.getElementById('filmFskInput');
  const filmFormatInput = document.getElementById('filmFormatInput'); // wir nutzen das als darstellungstyp für Vorstellung
  const filmKategorieInput = document.getElementById('filmKategorieInput');
  const filmPreisInput = document.getElementById('filmPreisInput');
  const filmSaveBtn = document.getElementById('filmSaveBtn');

  // Vorstellung-Form
  const vorstellungFilmSelect = document.getElementById('vorstellungFilmSelect');
  const vorstellungDatumInput = document.getElementById('vorstellungDatumInput');
  const vorstellungZeitInput = document.getElementById('vorstellungZeitInput');
  const vorstellungSaalInput = document.getElementById('vorstellungSaalInput');
  const vorstellungSaveBtn = document.getElementById('vorstellungSaveBtn');

  // ============================
  // STATE
  // ============================
  let movies = [];
  let shows = [];
  let currentMovieId = null;

  // ============================
  // localStorage Saal-Map
  // ============================
  function loadSaalMap() {
    try { return JSON.parse(localStorage.getItem(LS_SAAL_KEY) || "{}"); }
    catch { return {}; }
  }
  function saveSaalMap(map) {
    localStorage.setItem(LS_SAAL_KEY, JSON.stringify(map));
  }
  function saalKeyByShowId(showId) {
    return `showId:${showId}`;
  }
  function saalKeyByFilmDatum(filmId, iso) {
    return `film:${filmId}|datum:${iso}`;
  }

  // ============================
  // API HELPERS
  // ============================
  async function apiGet(path) {
    const res = await fetch(API_BASE + path);
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`GET ${path} fehlgeschlagen (${res.status}) ${txt}`);
    }
    return res.json();
  }

  async function apiPost(path, body) {
    const res = await fetch(API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`POST ${path} fehlgeschlagen (${res.status}) ${txt}`);
    }
    return res.json();
  }

  async function apiDelete(path) {
    const res = await fetch(API_BASE + path, { method: "DELETE" });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`DELETE ${path} fehlgeschlagen (${res.status}) ${txt}`);
    }
  }

  async function reloadAll() {
    movies = await apiGet("/api/filme");
    shows = await apiGet("/api/vorstellungen");
    renderMovieList();
    renderShowList();
    renderCalendar();
    fillVorstellungFilmSelect();
  }

  // ============================
  // Helpers
  // ============================
  function openModal(which) {
    modalOverlay?.classList.remove('hidden');
    modalFilm?.classList.add('hidden');
    modalVorstellung?.classList.add('hidden');
    if (which === 'film') modalFilm?.classList.remove('hidden');
    if (which === 'show') modalVorstellung?.classList.remove('hidden');
  }

  function closeModal() {
    modalOverlay?.classList.add('hidden');
    modalFilm?.classList.add('hidden');
    modalVorstellung?.classList.add('hidden');
  }

  function formatEuroFromCents(cents) {
    const n = Number(cents || 0) / 100;
    return n.toFixed(2).replace('.', ',') + ' €';
  }

  function getMovieById(id) {
    return movies.find(m => String(m.id) === String(id)) || null;
  }

  // ✅ WICHTIG: Vorstellung-ID robust (Backend kann id oder vorstellungId liefern)
  function getShowId(show) {
    return show?.id ?? show?.vorstellungId ?? null;
  }

  function getShowFilmId(show) {
    // Backend Entity hat "filmId" als ManyToOne Film
    if (show?.filmId?.id != null) return show.filmId.id;
    if (show?.filmId?.filmId != null) return show.filmId.filmId;
    if (typeof show?.filmId === "number" || typeof show?.filmId === "string") return show.filmId;

    // Falls mal "film" kommt
    if (show?.film?.id != null) return show.film.id;
    if (show?.film?.filmId != null) return show.film.filmId;

    return null;
  }

  function getShowSaalId(show) {
    // Backend Entity hat "saalId" als ManyToOne Saal
    if (show?.saalId?.id != null) return show.saalId.id;
    if (show?.saalId?.saalId != null) return show.saalId.saalId;
    if (typeof show?.saalId === "number" || typeof show?.saalId === "string") return show.saalId;

    // Falls mal "saal" kommt
    if (show?.saal?.id != null) return show.saal.id;
    if (show?.saal?.saalId != null) return show.saal.saalId;

    return null;
  }

  function getShowDatumISO(show) {
    // Backend Entity Feld heißt "datum"
    return String(show?.datum || show?.zeit || "");
  }

  function splitZeit(iso) {
    if (!iso) return { datum: "", uhrzeit: "" };
    const s = String(iso).replace(/([+-]\d{2}:\d{2}|Z)$/, ""); // Offset entfernen
    if (!s.includes("T")) return { datum: s, uhrzeit: "" };
    const [d, t] = s.split("T");
    return { datum: d, uhrzeit: (t || "").slice(0, 5) };
  }

  function extractFirstNumber(text) {
    const m = String(text || "").match(/\d+/);
    return m ? parseInt(m[0], 10) : NaN;
  }

  // ✅ Saal immer finden: erst Backend saalId, dann LS showId, dann LS film+datum
  function resolveSaalText(show) {
    const backendSaal = getShowSaalId(show);
    if (backendSaal != null) return `Saal ${backendSaal}`;

    const map = loadSaalMap();

    const sid = getShowId(show);
    if (sid != null) {
      const v = map[saalKeyByShowId(sid)];
      if (v) return v;
    }

    const filmId = getShowFilmId(show);
    const iso = getShowDatumISO(show);
    if (filmId != null && iso) {
      const v2 = map[saalKeyByFilmDatum(filmId, iso)];
      if (v2) return v2;
    }

    return "-";
  }

  // ============================
  // Filme rendern / filtern
  // ============================
  function renderMovieList() {
    if (!movieListEl) return;
    movieListEl.innerHTML = '';

    const searchText = (filmSuche?.value || '').toLowerCase().trim();
    const wantFsk = (filterFsk?.value || '');
    const wantStil = (filterStil?.value || '').toLowerCase();
    const wantFormat = (filterFormat?.value || '').toUpperCase(); // UI-only -> ignorieren

    movies.forEach(movie => {
      let visible = true;

      const filmname = String(movie.filmname ?? "").toLowerCase();
      const kategorie = String(movie.kategorie ?? "").toLowerCase();
      const fskStr = String(movie.fsk ?? "");

      if (wantFsk && fskStr !== wantFsk) visible = false;
      if (wantStil && kategorie !== wantStil) visible = false;
      if (searchText && !filmname.includes(searchText)) visible = false;
      if (wantFormat) { /* ignorieren */ }

      if (!visible) return;

      const li = document.createElement('li');
      li.classList.add('movie-item');
      li.dataset.movieId = String(movie.id);

      if (String(movie.id) === String(currentMovieId)) li.classList.add('selected');

      const row = document.createElement('div');
      row.classList.add('movie-row');

      const infoDiv = document.createElement('div');
      infoDiv.classList.add('movie-info');

      const titleDiv = document.createElement('div');
      titleDiv.classList.add('movie-title');
      titleDiv.textContent = `${movie.filmname ?? "Ohne Titel"} (ID: ${movie.id})`;

      const metaDiv = document.createElement('div');
      metaDiv.classList.add('movie-meta');
      metaDiv.innerHTML =
        `FSK: ${movie.fsk ?? "-"} • Kategorie: ${movie.kategorie ?? "-"} • Preis: ${formatEuroFromCents(movie.basispreis)}`;

      infoDiv.appendChild(titleDiv);
      infoDiv.appendChild(metaDiv);

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.textContent = 'Löschen';
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm(`Film "${movie.filmname ?? movie.id}" löschen?`)) return;
        try {
          await apiDelete(`/api/filme/${movie.id}`);
          if (String(currentMovieId) === String(movie.id)) currentMovieId = null;
          await reloadAll();
        } catch (err) {
          console.error(err);
          alert("Film löschen fehlgeschlagen.");
        }
      });

      row.appendChild(infoDiv);
      row.appendChild(deleteBtn);
      li.appendChild(row);

      li.addEventListener('click', () => {
        currentMovieId = movie.id;
        renderMovieList();
        renderShowList();
        renderCalendar();
      });

      movieListEl.appendChild(li);
    });

    if (!movies.length) {
      const li = document.createElement("li");
      li.textContent = "Keine Filme in der Datenbank.";
      movieListEl.appendChild(li);
    }
  }

  // ============================
  // Vorstellungen rendern
  // ============================
  function renderShowList() {
    if (!vorstellungenTbody) return;
    vorstellungenTbody.innerHTML = '';

    let filteredShows = shows;
    if (currentMovieId != null) {
      filteredShows = shows.filter(s => String(getShowFilmId(s)) === String(currentMovieId));
    }

    if (!filteredShows.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 5;
      td.textContent = 'Keine Vorstellungen vorhanden.';
      tr.appendChild(td);
      vorstellungenTbody.appendChild(tr);
      return;
    }

    filteredShows
      .sort((a, b) => String(getShowDatumISO(a)).localeCompare(String(getShowDatumISO(b))))
      .forEach(show => {
        const sid = getShowId(show);
        const filmId = getShowFilmId(show);
        const movie = getMovieById(filmId);

        const iso = getShowDatumISO(show);
        const { datum, uhrzeit } = splitZeit(iso);

        const saalText = resolveSaalText(show);

        const tr = document.createElement('tr');

        const tdDatum = document.createElement('td');
        const tdFilm = document.createElement('td');
        const tdZeit = document.createElement('td');
        const tdSaal = document.createElement('td');
        const tdAktion = document.createElement('td');

        tdDatum.textContent = datum || "-";
        tdFilm.textContent = movie
          ? `${movie.filmname} (ID: ${movie.id})`
          : (filmId ? `Film ID ${filmId}` : "Unbekannt");

        tdZeit.textContent = uhrzeit || "-";
        tdSaal.textContent = saalText;

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Löschen';
        deleteBtn.addEventListener('click', async () => {
          if (sid == null) {
            alert("Kann nicht löschen: Vorstellung-ID fehlt (id/vorstellungId).");
            return;
          }
          if (!confirm(`Vorstellung (ID: ${sid}) löschen?`)) return;
          try {
            await apiDelete(`/api/vorstellungen/${sid}`);
            await reloadAll();
          } catch (err) {
            console.error(err);
            alert("Vorstellung löschen fehlgeschlagen.");
          }
        });

        tdAktion.appendChild(deleteBtn);

        tr.appendChild(tdDatum);
        tr.appendChild(tdFilm);
        tr.appendChild(tdZeit);
        tr.appendChild(tdSaal);
        tr.appendChild(tdAktion);

        vorstellungenTbody.appendChild(tr);
      });
  }

  // ============================
  // Kalender
  // ============================
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  function getMonatsName(monthIndex) {
    const namen = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return namen[monthIndex] || '';
  }

  function renderCalendar() {
    if (!kalenderBody || !kalMonatLabel) return;

    kalenderBody.innerHTML = '';
    kalMonatLabel.textContent = `${getMonatsName(currentMonth)} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startWochentag = (firstDay.getDay() + 6) % 7;
    const tageImMonat = lastDay.getDate();

    let relevantShows = shows;
    if (currentMovieId != null) {
      relevantShows = shows.filter(s => String(getShowFilmId(s)) === String(currentMovieId));
    }

    const mapDatumZuShows = {};
    relevantShows.forEach(show => {
      const iso = getShowDatumISO(show);
      const { datum, uhrzeit } = splitZeit(iso);
      if (!datum) return;
      if (!mapDatumZuShows[datum]) mapDatumZuShows[datum] = [];
      mapDatumZuShows[datum].push({ show, uhrzeit });
    });

    let aktuellerTag = 1;
    for (let zeile = 0; zeile < 6; zeile++) {
      const tr = document.createElement('tr');

      for (let wochentag = 0; wochentag < 7; wochentag++) {
        const td = document.createElement('td');

        if ((zeile === 0 && wochentag < startWochentag) || aktuellerTag > tageImMonat) {
          td.classList.add('kalender-empty');
        } else {
          const day = aktuellerTag;
          const daySpan = document.createElement('span');
          daySpan.classList.add('tag-nr');
          daySpan.textContent = day;
          td.appendChild(daySpan);

          const dateStr =
            `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

          const showsForDate = mapDatumZuShows[dateStr] || [];

          showsForDate.forEach(({ show, uhrzeit }) => {
            const filmId = getShowFilmId(show);
            const movie = getMovieById(filmId);
            const saalText = resolveSaalText(show);

            const ev = document.createElement('span');
            ev.classList.add('kal-event');
            ev.textContent =
              `${uhrzeit || "--:--"} • ${saalText} • ${movie ? movie.filmname : "Unbekannt"}`;
            td.appendChild(ev);
          });

          aktuellerTag++;
        }

        tr.appendChild(td);
      }
      kalenderBody.appendChild(tr);
    }
  }

  kalPrev?.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });

  kalNext?.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  // ============================
  // Ansicht umschalten
  // ============================
  function setView(mode) {
    if (!listenView || !kalenderView || !btnViewList || !btnViewCalendar) return;

    if (mode === 'list') {
      listenView.classList.remove('hidden');
      kalenderView.classList.add('hidden');
      btnViewList.classList.add('active-view');
      btnViewCalendar.classList.remove('active-view');
    } else {
      listenView.classList.add('hidden');
      kalenderView.classList.remove('hidden');
      btnViewList.classList.remove('active-view');
      btnViewCalendar.classList.add('active-view');
    }
  }

  btnViewList?.addEventListener('click', () => setView('list'));
  btnViewCalendar?.addEventListener('click', () => setView('calendar'));

  // ============================
  // Modals / Form-Handling
  // ============================
  btnOpenFilmModal?.addEventListener('click', () => {
    filmTitelInput.value = '';
    filmBeschreibungInput.value = '';
    filmFskInput.value = '';
    filmFormatInput.value = '';
    filmKategorieInput.value = '';
    filmPreisInput.value = '';
    openModal('film');
  });

  btnOpenVorstellungModal?.addEventListener('click', () => {
    fillVorstellungFilmSelect();
    vorstellungDatumInput.value = '';
    vorstellungZeitInput.value = '';
    vorstellungSaalInput.value = '';
    openModal('show');
  });

  closeFilmModal?.addEventListener('click', closeModal);
  closeVorstellungModal?.addEventListener('click', closeModal);

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ============================
  // FILM SPEICHERN (DB)
  // ============================
  filmSaveBtn?.addEventListener('click', async () => {
    const filmname = filmTitelInput.value.trim();
    const beschreibung = filmBeschreibungInput.value.trim();
    const fsk = parseInt(filmFskInput.value, 10);
    const kategorie = filmKategorieInput.value.trim() || 'Allgemein';
    const preisEuro = parseFloat((filmPreisInput.value || '').replace(',', '.'));

    if (!filmname || isNaN(fsk) || isNaN(preisEuro)) {
      alert('Bitte mindestens Filmtitel, FSK und Preis korrekt ausfüllen.');
      return;
    }

    const body = {
      filmname,
      beschreibung,
      fsk,
      kategorie,
      basispreis: Math.round(preisEuro * 100)
    };

    try {
      await apiPost("/api/filme", body);
      closeModal();
      await reloadAll();
    } catch (e) {
      console.error(e);
      alert("Film konnte nicht gespeichert werden.");
    }
  });

  // ============================
  // Vorstellung: Film-Select füllen
  // ============================
  function fillVorstellungFilmSelect() {
    if (!vorstellungFilmSelect) return;
    vorstellungFilmSelect.innerHTML = '';

    if (!movies.length) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Keine Filme vorhanden';
      vorstellungFilmSelect.appendChild(opt);
      vorstellungFilmSelect.disabled = true;
      return;
    }

    vorstellungFilmSelect.disabled = false;

    movies.forEach(movie => {
      const opt = document.createElement('option');
      opt.value = String(movie.id);
      opt.textContent = `${movie.filmname ?? "Film"} (ID: ${movie.id})`;
      if (String(movie.id) === String(currentMovieId)) opt.selected = true;
      vorstellungFilmSelect.appendChild(opt);
    });
  }

  // ============================
  // VORSTELLUNG SPEICHERN (DB)
  // ============================
  vorstellungSaveBtn?.addEventListener('click', async () => {
    const filmId = parseInt(vorstellungFilmSelect.value, 10);
    const datum = vorstellungDatumInput.value; // YYYY-MM-DD
    const zeit = vorstellungZeitInput.value;   // HH:MM
    const saalText = vorstellungSaalInput.value.trim();
    const darstellungstyp = (filmFormatInput?.value || "").trim() || null;

    if (isNaN(filmId) || !datum || !zeit || !saalText) {
      alert('Bitte Film, Datum, Uhrzeit und Saal ausfüllen.');
      return;
    }

    const iso = `${datum}T${zeit}:00`;
    const saalNum = extractFirstNumber(saalText);

    // ✅ Backend Entity: filmId und saalId sind ManyToOne -> als Objekt senden
    const body = {
      filmId: { id: filmId },
      saalId: isNaN(saalNum) ? null : { id: saalNum },
      darstellungstyp,
      datum: iso
    };

    try {
      const saved = await apiPost("/api/vorstellungen", body);

      // Saal zusätzlich lokal speichern (falls Backend saalId später mal fehlt)
      const map = loadSaalMap();
      const sid = getShowId(saved);
      if (sid != null) map[saalKeyByShowId(sid)] = saalText;
      map[saalKeyByFilmDatum(filmId, iso)] = saalText;
      saveSaalMap(map);

      closeModal();
      await reloadAll();
    } catch (e) {
      console.error(e);
      alert("Vorstellung konnte nicht gespeichert werden.");
    }
  });

  // ============================
  // Filter / Suche
  // ============================
  function applyFilter() {
    renderMovieList();
  }

  btnFilterApply?.addEventListener('click', applyFilter);
  suchBtn?.addEventListener('click', applyFilter);

  filmSuche?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') applyFilter();
  });

  // ============================
  // INITIAL
  // ============================
  (async () => {
    setView('list');
    try {
      await reloadAll();
    } catch (e) {
      console.error(e);
      alert(
        "Konnte Daten nicht laden.\n\n" +
        "Backend erreichbar? " + API_BASE
      );
    }
  })();
});
