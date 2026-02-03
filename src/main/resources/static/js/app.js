/*document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------
    // GRUND-ELEMENTE
    // ----------------------------
    const filme = document.querySelectorAll('.liste li');
    const inhaltBox = document.getElementById('inhaltBox');
    const buchenBox = document.getElementById('buchenBox');
    const inhaltTitel = document.getElementById('inhaltTitel');
    const inhaltText = document.getElementById('inhaltText');
    const buchenContainer = document.getElementById('buchen');
    const detailsWrapper = document.getElementById('detailsWrapper');

    const infoFsk = document.getElementById('infoFsk');
    const infoFormat = document.getElementById('infoFormat');
    const infoKategorie = document.getElementById('infoKategorie');
    const infoLaufzeit = document.getElementById('infoLaufzeit');
    const infoPreis = document.getElementById('infoPreis');

    const vorstellungenTbody = document.getElementById('vorstellungenTbody');

    // Toggle / Ansichten
    const btnViewList = document.getElementById('btnViewList');
    const btnViewCalendar = document.getElementById('btnViewCalendar');
    const listenView = document.getElementById('listenView');
    const kalenderView = document.getElementById('kalenderView');

    // Kalender
    const kalMonatLabel = document.getElementById('kalMonatLabel');
    const kalPrev = document.getElementById('kalPrev');
    const kalNext = document.getElementById('kalNext');
    const kalenderBody = document.getElementById('kalenderBody');

    // Buchung
    const buchenBtn = document.getElementById('buchenBtn');
    const zurueckBtn = document.getElementById('zurueckBtn');
    const bezahlenBtn = document.getElementById('bezahlenBtn');

    const preisErwachsene = document.getElementById('preisErwachsene');
    const summeAnzeige = document.getElementById('summeAnzeige');

    // Sitzplatzauswahl
    const sitzContainer = document.getElementById('sitzContainer');
    const ausgewaehlteSitzeTxt = document.getElementById('ausgewaehlteSitze');
    const ticketsTbody = document.getElementById('ticketsTbody');

    // Filter & Suche
    const filterFormat = document.getElementById('filterFormat');
    const filterFsk = document.getElementById('filterFsk');
    const filterBereich = document.getElementById('filterBereich');
    const filterStil = document.getElementById('filterStil');
    const filterDatum = document.getElementById('FilterDatum');
    const btnFilterApply = document.getElementById('btnFilterApply');
    const suchInput = document.getElementById('filmSuche');
    const suchBtn = document.getElementById('suchBtn');
    const filterModal = document.getElementById('filterModal');
    const btnFilterOpen = document.getElementById('btnFilterOpen');
    const modalCloseButtons = filterModal ? filterModal.querySelectorAll('[data-modal-close]') : [];
    const showInfoModal = document.getElementById('showInfoModal');
    const showInfoFilm = document.getElementById('showInfoFilm');
    const showInfoDate = document.getElementById('showInfoDate');
    const showInfoTime = document.getElementById('showInfoTime');
    const showInfoSaal = document.getElementById('showInfoSaal');
    const showInfoRuntime = document.getElementById('showInfoRuntime');
    const showInfoPrice = document.getElementById('showInfoPrice');
    const showInfoCloseButtons = showInfoModal ? showInfoModal.querySelectorAll('[data-showinfo-close]') : [];

    // Info im Buchungsfenster zur gewählten Vorstellung
    const buchungVorstellungInfo = document.getElementById('buchungVorstellungInfo');

    // Für Demo: Nutzer ist eingeloggt
    let loginStatus = true;

    // Buttons für Konto oder Login
    const btnLogin = document.getElementById('Login-btn-non-autenthicated');
    const btnKonto = document.getElementById('Login-btn-autenthicated');

    // Aktueller Film / Preis
    let aktuellerFilm = null;
    let grundpreis = 0;
    let aktuellerFilmData = null;

    // Ausgewählte Vorstellung (muss gewählt werden, bevor gebucht wird)
    let ausgewaehlteVorstellung = null;

    // -----------------------------
    // AUTH-BUTTONS (Login/Konto)
    // -----------------------------
    function updateAuthButtons() {
        if (!btnLogin || !btnKonto) return;

        if (loginStatus) {
            btnKonto.style.display = 'block';
            btnLogin.style.display = 'none';
        } else {
            btnKonto.style.display = 'none';
            btnLogin.style.display = 'block';
        }
    }

    // -----------------------------
    // BUCHEN-BUTTON: NUR WENN LOGIN + VORSTELLUNG
    // -----------------------------
    function updateBuchenButton() {
        if (!buchenContainer || !buchenBtn) return;

        const darfBuchen = (loginStatus === true) && (ausgewaehlteVorstellung !== null);

        if (darfBuchen) {
            buchenContainer.classList.remove('hidden');
            buchenBtn.disabled = false;
        } else {
            buchenContainer.classList.add('hidden');
            buchenBtn.disabled = true;
        }
    }

    // ----------------------------
    // VORSTELLUNGSDATEN (DEMO)
    // ----------------------------
    const vorstellungsDaten = {
        "Film 1": [
            { datum: "2025-11-25", uhrzeit: "18:00", saal: "Saal 1" },
            { datum: "2025-11-25", uhrzeit: "20:30", saal: "Saal 1" },
            { datum: "2025-11-26", uhrzeit: "17:45", saal: "Saal 2" }
        ],
        "Film 2": [
            { datum: "2025-11-25", uhrzeit: "19:15", saal: "Saal 3" },
            { datum: "2025-11-26", uhrzeit: "21:00", saal: "Saal 3" }
        ],
        "Film 3": [
            { datum: "2025-11-26", uhrzeit: "16:00", saal: "Saal 2" },
            { datum: "2025-11-27", uhrzeit: "20:00", saal: "Saal 1" }
        ]
    };

    // ----------------------------
    // HILFSFUNKTIONEN
    // ----------------------------
    function formatEuro(wert) {
        if (isNaN(wert)) wert = 0;
        return wert.toFixed(2).replace('.', ',') + ' €';
    }

    function getTodayIsoDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // ----------------------------
    // VORSTELLUNG AUSWÄHLEN
    // ----------------------------
    function selectVorstellung(filmTitel, v, trElement) {
        // alle anderen Markierungen entfernen
        if (vorstellungenTbody) {
            const alleZeilen = vorstellungenTbody.querySelectorAll('tr');
            alleZeilen.forEach(row => row.classList.remove('selected-show'));
        }

        // diese Zeile markieren
        if (trElement) {
            trElement.classList.add('selected-show');
        }

        // Daten merken
        ausgewaehlteVorstellung = {
            film: filmTitel,
            datum: v.datum,
            uhrzeit: v.uhrzeit,
            saal: v.saal
        };

        // Buchungsinfo-Text vorab updaten (für später)
        if (buchungVorstellungInfo) {
            buchungVorstellungInfo.textContent =
                `Ausgewählte Vorstellung: ${ausgewaehlteVorstellung.film} – ` +
                `${ausgewaehlteVorstellung.datum}, ` +
                `${ausgewaehlteVorstellung.uhrzeit} Uhr, ` +
                `${ausgewaehlteVorstellung.saal}`;
        }

        // ✅ EINZIGE Wahrheit für "Buchen sichtbar/aktiv?"
        updateBuchenButton();
    }

    // ----------------------------
    // VORSTELLUNGSLISTE
    // ----------------------------
    function fuelleVorstellungenListe(filmTitel) {
        if (!vorstellungenTbody) return;

        vorstellungenTbody.innerHTML = '';
        ausgewaehlteVorstellung = null; // neue Filmauswahl -> alte Vorstellung reset
        updateBuchenButton();            // ✅ wenn Film neu gewählt -> Buchen wieder weg

        const eintraege = vorstellungsDaten[filmTitel] || [];
        if (!eintraege.length) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 3;
            td.textContent = "Keine Vorstellungen hinterlegt.";
            tr.appendChild(td);
            vorstellungenTbody.appendChild(tr);
            return;
        }

        eintraege.forEach(v => {
            const tr = document.createElement('tr');
            const tdDatum = document.createElement('td');
            const tdZeit = document.createElement('td');
            const tdSaal = document.createElement('td');

            tdDatum.textContent = v.datum;
            tdZeit.textContent = v.uhrzeit;
            tdSaal.textContent = v.saal;

            tr.appendChild(tdDatum);
            tr.appendChild(tdZeit);
            tr.appendChild(tdSaal);

            // Vorstellung auswählbar machen
            tr.addEventListener('click', () => selectVorstellung(filmTitel, v, tr));

            vorstellungenTbody.appendChild(tr);
        });
    }

    // ----------------------------
    // KALENDER
    // ----------------------------
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function getMonatsName(monthIndex) {
        const namen = [
            "Januar", "Februar", "März", "April", "Mai", "Juni",
            "Juli", "August", "September", "Oktober", "November", "Dezember"
        ];
        return namen[monthIndex] || "";
    }

    function baueKalender(filmTitel) {
        if (!kalenderBody || !kalMonatLabel) return;

        kalenderBody.innerHTML = '';
        kalMonatLabel.textContent = `${getMonatsName(currentMonth)} ${currentYear}`;

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startWochentag = (firstDay.getDay() + 6) % 7;
        const tageImMonat = lastDay.getDate();

        const eintraege = vorstellungsDaten[filmTitel] || [];
        const mapDatumZuShows = {};
        eintraege.forEach(v => {
            if (!mapDatumZuShows[v.datum]) {
                mapDatumZuShows[v.datum] = [];
            }
            mapDatumZuShows[v.datum].push(v);
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

                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const showsForDate = mapDatumZuShows[dateStr] || [];

                    showsForDate.forEach(show => {
                        const ev = document.createElement('span');
                        ev.classList.add('kal-event');
                        ev.textContent = `${show.uhrzeit} • ${show.saal}`;
                        ev.addEventListener('click', (e) => {
                            e.stopPropagation();
                            selectVorstellung(filmTitel, show, null);
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
            if (aktuellerFilm) baueKalender(aktuellerFilm);
        });
    }

    if (kalNext) {
        kalNext.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            if (aktuellerFilm) baueKalender(aktuellerFilm);
        });
    }

    // ----------------------------
    // ANSICHT: LISTE / KALENDER
    // ----------------------------
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

    if (btnViewList) {
        btnViewList.addEventListener('click', () => setView('list'));
    }
    if (btnViewCalendar) {
        btnViewCalendar.addEventListener('click', () => {
            setView('calendar');
            if (aktuellerFilm) baueKalender(aktuellerFilm);
        });
    }

    // ----------------------------
    // SITZPLÄTZE & TICKETS
    // ----------------------------
    function getSitzplanConfig() {
        const defaultConfig = { anzahlReihen: 6, sitzeProReihe: 10, prozentLoge: 25 };
        const stored = localStorage.getItem('sitzplanConfig');
        return stored ? JSON.parse(stored) : defaultConfig;
    }

    function buildSitzplanConfig() {
        const config = getSitzplanConfig();
        const SITZPLAN_KONFIG = [];
        for (let i = 1; i <= config.anzahlReihen; i++) {
            const reiheBuchstabe = String.fromCharCode(65 + i - 1); // 1 -> A, 2 -> B, etc.
            const istLoge = i > config.anzahlReihen * (1 - config.prozentLoge / 100);
            SITZPLAN_KONFIG.push({
                reihe: reiheBuchstabe,
                anzahl: config.sitzeProReihe,
                seatType: istLoge ? 'premium' : 'standard',
                bereich: istLoge ? 'Loge' : 'Parkett'
            });
        }
        return SITZPLAN_KONFIG;
    }

    let ausgewaehlteSitze = []; // { id, seatType, bereich, personType }

    function aktualisiereSitzAnzeige() {
        if (!ausgewaehlteSitzeTxt) return;
        if (!ausgewaehlteSitze.length) {
            ausgewaehlteSitzeTxt.textContent = 'keine';
        } else {
            ausgewaehlteSitzeTxt.textContent = ausgewaehlteSitze
                .map(s => `${s.id} (${s.bereich})`)
                .join(', ');
        }
    }

    function berechnePreisFuerTicket(sitz) {
        if (!grundpreis) return 0;
        let faktor = 1;

        switch (sitz.personType) {
            case 'student':
                faktor = 0.8;
                break;
            case 'senior':
                faktor = 0.85;
                break;
            case 'kind':
                faktor = 0.7;
                break;
            default:
                faktor = 1;
        }

        if (sitz.seatType === 'premium') {
            return grundpreis * faktor + 2;
        }

        return grundpreis * faktor;
    }

    function baueTicketsTabelle() {
        if (!ticketsTbody) return;
        ticketsTbody.innerHTML = '';

        if (!ausgewaehlteSitze.length) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 4;
            td.textContent = 'Keine Plätze ausgewählt.';
            tr.appendChild(td);
            ticketsTbody.appendChild(tr);
            return;
        }

        ausgewaehlteSitze.forEach((sitz) => {
            const tr = document.createElement('tr');

            const tdPlatz = document.createElement('td');
            const tdBereich = document.createElement('td');
            const tdType = document.createElement('td');
            const tdPreis = document.createElement('td');

            tdPlatz.textContent = sitz.id;
            tdBereich.textContent = sitz.bereich;

            const select = document.createElement('select');
            select.innerHTML = `
                <option value="erwachsene">Erwachsener</option>
                <option value="student">Student (-20%)</option>
                <option value="senior">Senior (-15%)</option>
                <option value="kind">Kind (-30%)</option>
            `;
            select.value = sitz.personType || 'erwachsene';
            select.addEventListener('change', () => {
                sitz.personType = select.value;
                berechneSumme();
                baueTicketsTabelle();
            });

            tdType.appendChild(select);
            tdPreis.textContent = formatEuro(berechnePreisFuerTicket(sitz));

            tr.appendChild(tdPlatz);
            tr.appendChild(tdBereich);
            tr.appendChild(tdType);
            tr.appendChild(tdPreis);

            ticketsTbody.appendChild(tr);
        });
    }

    function toggleSitz(seatEl) {
        const id = seatEl.dataset.id;
        const seatTyp = seatEl.dataset.seatType;
        const bereich = seatEl.dataset.bereich;

        const index = ausgewaehlteSitze.findIndex(s => s.id === id);
        if (index >= 0) {
            ausgewaehlteSitze.splice(index, 1);
            seatEl.classList.remove('gewaehlt');
        } else {
            ausgewaehlteSitze.push({
                id,
                seatType: seatTyp,
                bereich,
                personType: 'erwachsene'
            });
            seatEl.classList.add('gewaehlt');
        }

        aktualisiereSitzAnzeige();
        baueTicketsTabelle();
        berechneSumme();
    }

    function baueSitzplan() {
        if (!sitzContainer) return;
        sitzContainer.innerHTML = '';
        ausgewaehlteSitze = [];

        const SITZPLAN_KONFIG = buildSitzplanConfig();

        SITZPLAN_KONFIG.forEach(reiheInfo => {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('sitzreihe');

            const label = document.createElement('span');
            label.classList.add('sitzreihe-label');
            label.textContent = reiheInfo.reihe;
            rowDiv.appendChild(label);

            for (let i = 1; i <= reiheInfo.anzahl; i++) {
                const seat = document.createElement('button');
                seat.type = 'button';
                seat.classList.add('sitz', reiheInfo.seatType);
                const id = `${reiheInfo.reihe}${i}`;
                seat.dataset.id = id;
                seat.dataset.seatType = reiheInfo.seatType;
                seat.dataset.bereich = reiheInfo.bereich;
                seat.textContent = i;

                if (Math.random() < 0.07) {
                    seat.classList.add('belegt');
                    seat.disabled = true;
                } else {
                    seat.addEventListener('click', () => toggleSitz(seat));
                }

                rowDiv.appendChild(seat);
            }

            sitzContainer.appendChild(rowDiv);
        });

        aktualisiereSitzAnzeige();
        baueTicketsTabelle();
        berechneSumme();
    }

    // ----------------------------
    // BUCHUNGS-SUMME
    // ----------------------------
    function berechneSumme() {
        let summe = 0;

        ausgewaehlteSitze.forEach(sitz => {
            summe += berechnePreisFuerTicket(sitz);
        });

        if (summeAnzeige) {
            summeAnzeige.textContent = formatEuro(summe);
        }
        if (preisErwachsene) {
            preisErwachsene.textContent = formatEuro(grundpreis);
        }
    }

    // ----------------------------
    // FILM-KLICK
    // ----------------------------
    filme.forEach(li => {
        li.addEventListener('click', () => {
            filme.forEach(f => f.classList.remove('aktiv'));
            li.classList.add('aktiv');

            const titel = li.dataset.titel || li.textContent.trim();
            const beschr = li.dataset.beschreibung || '';
            const fsk = li.dataset.fsk || '';
            const format = li.dataset.format || '';
            const kat = li.dataset.kategorie || '';
            const laufzeit = li.dataset.laufzeit || '';
            const preis = parseFloat(li.dataset.preis || '0');

            aktuellerFilm = titel;
            grundpreis = preis || 0;
            aktuellerFilmData = {
                titel,
                beschr,
                fsk,
                format,
                kat,
                laufzeit: parseInt(laufzeit || '0', 10),
                preis: grundpreis
            };

            if (inhaltTitel) inhaltTitel.textContent = titel;
            if (inhaltText) inhaltText.textContent = beschr;
            if (infoFsk) infoFsk.textContent = fsk;
            if (infoFormat) infoFormat.textContent = format;
            if (infoKategorie) infoKategorie.textContent = kat;
            if (infoLaufzeit) infoLaufzeit.textContent = laufzeit ? `${laufzeit} Min` : 'k.A.';
            if (infoPreis) infoPreis.textContent = formatEuro(grundpreis);

            if (detailsWrapper) {
                detailsWrapper.classList.remove('hidden');
            }

            fuelleVorstellungenListe(titel);

            if (kalenderView && !kalenderView.classList.contains('hidden')) {
                baueKalender(titel);
            }

            baueSitzplan();
            berechneSumme();

            // ✅ NICHT MEHR direkt den Buchen-Button anfassen.
            // Vorstellung wurde durch fuelleVorstellungenListe() resettet -> updateBuchenButton() dort.
        });
    });

    // ----------------------------
    // SUCHE & FILTER AUF FILMLISTE
    // ----------------------------
    function filmHasVorstellungForDate(titel, datumStr) {
        const eintraege = vorstellungsDaten[titel] || [];
        return eintraege.some(v => v.datum === datumStr);
    }

    function filterAndSearchFilms() {
        const wantFormat = (filterFormat?.value || '').toUpperCase();
        const wantFsk = filterFsk?.value || '';
        const wantBereich = filterBereich?.value || '';
        const wantStil = filterStil?.value || '';
        const wantDate = filterDatum?.value || '';
        const searchText = (suchInput?.value || '').trim().toLowerCase();

        filme.forEach(li => {
            const titelRaw = li.dataset.titel || li.textContent.trim() || '';
            const titel = titelRaw.toLowerCase();
            const format = (li.dataset.format || '').toUpperCase();
            const fsk = li.dataset.fsk || '';
            const bereich = li.dataset.bereich || '';
            const stil = li.dataset.kategorie || '';

            let visible = true;

            if (wantFormat && format !== wantFormat) visible = false;
            if (wantFsk && fsk !== wantFsk) visible = false;
            if (wantBereich && bereich !== wantBereich) visible = false;
            if (wantStil && stil !== wantStil) visible = false;

            if (wantDate && !filmHasVorstellungForDate(titelRaw, wantDate)) {
                visible = false;
            }

            if (searchText && !titel.includes(searchText)) visible = false;

            li.style.display = visible ? '' : 'none';
        });
    }

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

    function openShowInfo(show) {
        if (!showInfoModal) return;
        const laufzeitText = aktuellerFilmData && aktuellerFilmData.laufzeit
            ? `${aktuellerFilmData.laufzeit} Min`
            : 'k.A.';
        const preisText = aktuellerFilmData ? formatEuro(aktuellerFilmData.preis) : formatEuro(0);

        if (showInfoFilm) showInfoFilm.textContent = aktuellerFilmData ? aktuellerFilmData.titel : 'Unbekannt';
        if (showInfoDate) showInfoDate.textContent = show.datum;
        if (showInfoTime) showInfoTime.textContent = show.uhrzeit;
        if (showInfoSaal) showInfoSaal.textContent = show.saal;
        if (showInfoRuntime) showInfoRuntime.textContent = laufzeitText;
        if (showInfoPrice) showInfoPrice.textContent = preisText;

        showInfoModal.classList.remove('hidden');
        document.body.classList.add('no-scroll');
    }

    function closeShowInfo() {
        if (!showInfoModal) return;
        showInfoModal.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    }

    if (btnFilterApply) {
        btnFilterApply.addEventListener('click', filterAndSearchFilms);
    }
    if (suchBtn) {
        suchBtn.addEventListener('click', filterAndSearchFilms);
    }
    if (suchInput) {
        suchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                filterAndSearchFilms();
            }
        });
    }

    if (filterDatum && !filterDatum.value) {
        filterDatum.value = getTodayIsoDate();
    }
    if (btnFilterOpen) {
        btnFilterOpen.addEventListener('click', openFilterModal);
    }
    if (modalCloseButtons.length) {
        modalCloseButtons.forEach(btn => btn.addEventListener('click', closeFilterModal));
    }
    if (showInfoCloseButtons.length) {
        showInfoCloseButtons.forEach(btn => btn.addEventListener('click', closeShowInfo));
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && filterModal && !filterModal.classList.contains('hidden')) {
            closeFilterModal();
        }
        if (e.key === 'Escape' && showInfoModal && !showInfoModal.classList.contains('hidden')) {
            closeShowInfo();
        }
    });

    // ----------------------------
    // BUCHEN / ZURÜCK / BEZAHLEN
    // ----------------------------
    if (buchenBtn && buchenBox && inhaltBox) {
        buchenBtn.addEventListener('click', () => {
            // Sicherheitscheck: Vorstellung muss ausgewählt sein
            if (!ausgewaehlteVorstellung) {
                alert('Bitte zuerst eine Vorstellung auswählen.');
                return;
            }
            // Sicherheitscheck: Login muss aktiv sein
            if (!loginStatus) {
                alert('Bitte zuerst einloggen.');
                return;
            }

            // Info im Buchungsfenster sicher aktualisieren
            if (buchungVorstellungInfo && ausgewaehlteVorstellung) {
                buchungVorstellungInfo.textContent =
                    `Ausgewählte Vorstellung: ${ausgewaehlteVorstellung.film} – ` +
                    `${ausgewaehlteVorstellung.datum}, ` +
                    `${ausgewaehlteVorstellung.uhrzeit} Uhr, ` +
                    `${ausgewaehlteVorstellung.saal}`;
            }

            inhaltBox.classList.add('hidden');
            buchenBox.classList.remove('hidden');
        });
    }

    if (zurueckBtn && buchenBox && inhaltBox) {
        zurueckBtn.addEventListener('click', () => {
            buchenBox.classList.add('hidden');
            inhaltBox.classList.remove('hidden');
        });
    }

    if (bezahlenBtn) {
        bezahlenBtn.addEventListener('click', () => {
            const summe = summeAnzeige ? summeAnzeige.textContent : "0,00 €";
            const sitzText = ausgewaehlteSitze.length ?
                ausgewaehlteSitze.map(s => `${s.id} (${s.personType || 'Erwachsene/r'})`).join(', ') :
                'keine Sitzplätze ausgewählt';

            const vorstellungText = ausgewaehlteVorstellung
                ? `${ausgewaehlteVorstellung.film} – ${ausgewaehlteVorstellung.datum}, ${ausgewaehlteVorstellung.uhrzeit} Uhr, ${ausgewaehlteVorstellung.saal}`
                : 'keine Vorstellung gewählt';

            alert(
                'Buchung übernommen.\n' +
                'Vorstellung: ' + vorstellungText + '\n' +
                'Summe: ' + summe + '\n' +
                'Plätze: ' + sitzText
            );
        });
    }

    // ----------------------------
    // INITIAL
    // ----------------------------
    if (detailsWrapper) {
        detailsWrapper.classList.add('hidden');
    }

    // ✅ initial: Auth-Buttons + Buchen-Button korrekt setzen
    updateAuthButtons();
    updateBuchenButton();

    setView('list');
    baueSitzplan();
    berechneSumme();
});*/

document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080";

  // DOM
  const movieListEl = document.getElementById("movieList");
  const detailsWrapper = document.getElementById("detailsWrapper");

  const inhaltTitel = document.getElementById("inhaltTitel");
  const inhaltText = document.getElementById("inhaltText");
  const infoFsk = document.getElementById("infoFsk");
  const infoFormat = document.getElementById("infoFormat"); // optional (Backend hat ggf. kein format)
  const infoKategorie = document.getElementById("infoKategorie");
  const infoPreis = document.getElementById("infoPreis");

  const vorstellungenTbody = document.getElementById("vorstellungenTbody");

  // Toggle
  const btnViewList = document.getElementById("btnViewList");
  const btnViewCalendar = document.getElementById("btnViewCalendar");
  const listenView = document.getElementById("listenView");
  const kalenderView = document.getElementById("kalenderView");

  // Kalender
  const kalMonatLabel = document.getElementById("kalMonatLabel");
  const kalPrev = document.getElementById("kalPrev");
  const kalNext = document.getElementById("kalNext");
  const kalenderBody = document.getElementById("kalenderBody");

  // Buchung
  const buchenContainer = document.getElementById("buchen");
  const buchenBtn = document.getElementById("buchenBtn");
  const buchenBox = document.getElementById("buchenBox");
  const inhaltBox = document.getElementById("inhaltBox");
  const zurueckBtn = document.getElementById("zurueckBtn");
  const bezahlenBtn = document.getElementById("bezahlenBtn");
  const buchungVorstellungInfo = document.getElementById("buchungVorstellungInfo");

  // Sitz/Preis (dein bestehender Code kann bleiben – hier nur minimal belassen)
  const summeAnzeige = document.getElementById("summeAnzeige");

  // Filter UI (optional: später)
  const filmSuche = document.getElementById("filmSuche");
  const suchBtn = document.getElementById("suchBtn");
  const btnFilterApply = document.getElementById("btnFilterApply");

  // STATE
  let movies = [];
  let shows = [];
  let currentMovieId = null;
  let ausgewaehlteVorstellung = null;

  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  // --- Helpers ---
  async function apiGet(path) {
    const res = await fetch(API_BASE + path);
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  }

  function formatEuroFromCents(cents) {
    const n = Number(cents || 0) / 100;
    return n.toFixed(2).replace(".", ",") + " €";
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function splitISO(iso) {
    if (!iso) return { datum: "", uhrzeit: "" };
    const noOffset = String(iso).replace(/([+-]\d{2}:\d{2}|Z)$/, "");
    const [d, t] = noOffset.split("T");
    return { datum: d || "", uhrzeit: (t || "").slice(0, 5) };
  }

  function getShowFilmId(show) {
    // Backend liefert bei dir: filmId: { id: 1, ... } ODER filmId null
    if (show?.filmId?.id != null) return show.filmId.id;
    if (show?.film?.id != null) return show.film.id;
    if (show?.filmId != null && (typeof show.filmId === "number" || typeof show.filmId === "string")) return show.filmId;
    return null;
  }

  function getMovieById(id) {
    return movies.find(m => String(m.id) === String(id)) || null;
  }

  function getMonatsName(monthIndex) {
    const namen = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
    return namen[monthIndex] || "";
  }

  // --- Rendering ---
  function renderMovieList() {
    if (!movieListEl) return;
    movieListEl.innerHTML = "";

    const search = (filmSuche?.value || "").toLowerCase().trim();

    const filtered = movies.filter(m => {
      const name = String(m.filmname || "").toLowerCase();
      return !search || name.includes(search);
    });

    if (!filtered.length) {
      const li = document.createElement("li");
      li.textContent = "Keine Filme vorhanden.";
      movieListEl.appendChild(li);
      return;
    }

    filtered.forEach(movie => {
      const li = document.createElement("li");
      li.textContent = movie.filmname || "Ohne Titel";
      li.classList.toggle("aktiv", String(movie.id) === String(currentMovieId));
      li.addEventListener("click", () => selectMovie(movie.id));
      movieListEl.appendChild(li);
    });
  }

  function renderDetailsForMovie(movieId) {
    const movie = getMovieById(movieId);
    if (!movie) return;

    if (inhaltTitel) inhaltTitel.textContent = movie.filmname || "Film";
    if (inhaltText) inhaltText.textContent = movie.beschreibung || "";
    if (infoFsk) infoFsk.textContent = movie.fsk ?? "-";
    if (infoKategorie) infoKategorie.textContent = movie.kategorie ?? "-";
    if (infoPreis) infoPreis.textContent = formatEuroFromCents(movie.basispreis ?? 0);

    // Format gibt’s im Backend ggf. nicht -> neutral lassen
    if (infoFormat) infoFormat.textContent = "-";

    detailsWrapper?.classList.remove("hidden");
  }

  function renderShowList() {
    if (!vorstellungenTbody) return;
    vorstellungenTbody.innerHTML = "";
    ausgewaehlteVorstellung = null;

    const relevant = shows
      .filter(s => String(getShowFilmId(s)) === String(currentMovieId))
      .sort((a,b) => String(a.datum || "").localeCompare(String(b.datum || "")));

    if (!relevant.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 3;
      td.textContent = "Keine Vorstellungen vorhanden.";
      tr.appendChild(td);
      vorstellungenTbody.appendChild(tr);
      if (buchenBtn) buchenBtn.disabled = true;
      return;
    }

    relevant.forEach(show => {
      const { datum, uhrzeit } = splitISO(show.datum);
      const saalText = show?.saalId?.id ? `Saal ${show.saalId.id}` : "-";

      const tr = document.createElement("tr");
      const tdDatum = document.createElement("td");
      const tdZeit = document.createElement("td");
      const tdSaal = document.createElement("td");

      tdDatum.textContent = datum || "-";
      tdZeit.textContent = uhrzeit || "-";
      tdSaal.textContent = saalText;

      tr.appendChild(tdDatum);
      tr.appendChild(tdZeit);
      tr.appendChild(tdSaal);

      tr.addEventListener("click", () => {
        // markieren
        [...vorstellungenTbody.querySelectorAll("tr")].forEach(x => x.classList.remove("selected-show"));
        tr.classList.add("selected-show");

        ausgewaehlteVorstellung = show;

        if (buchungVorstellungInfo) {
          const movie = getMovieById(currentMovieId);
          buchungVorstellungInfo.textContent =
            `Ausgewählte Vorstellung: ${movie?.filmname || "Film"} – ${datum}, ${uhrzeit} Uhr, ${saalText}`;
        }

        if (buchenBtn) buchenBtn.disabled = false;
        if (buchenContainer) buchenContainer.classList.remove("hidden");
      });

      vorstellungenTbody.appendChild(tr);
    });

    if (buchenBtn) buchenBtn.disabled = true; // erst nach Auswahl
    if (buchenContainer) buchenContainer.classList.remove("hidden");
  }

  function renderCalendar() {
    if (!kalenderBody || !kalMonatLabel) return;

    kalenderBody.innerHTML = "";
    kalMonatLabel.textContent = `${getMonatsName(currentMonth)} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startWochentag = (firstDay.getDay() + 6) % 7;
    const tageImMonat = lastDay.getDate();

    const relevant = shows.filter(s => String(getShowFilmId(s)) === String(currentMovieId));
    const map = {};
    relevant.forEach(s => {
      const { datum, uhrzeit } = splitISO(s.datum);
      if (!datum) return;
      if (!map[datum]) map[datum] = [];
      map[datum].push({ uhrzeit, show: s });
    });

    let tag = 1;
    for (let r = 0; r < 6; r++) {
      const tr = document.createElement("tr");

      for (let c = 0; c < 7; c++) {
        const td = document.createElement("td");

        if ((r === 0 && c < startWochentag) || tag > tageImMonat) {
          td.classList.add("kalender-empty");
        } else {
          const daySpan = document.createElement("span");
          daySpan.classList.add("tag-nr");
          daySpan.textContent = tag;
          td.appendChild(daySpan);

          const dateStr = `${currentYear}-${pad2(currentMonth + 1)}-${pad2(tag)}`;
          const showsForDate = (map[dateStr] || []).sort((a,b) => String(a.uhrzeit).localeCompare(String(b.uhrzeit)));

          showsForDate.forEach(({ uhrzeit, show }) => {
            const saalText = show?.saalId?.id ? `Saal ${show.saalId.id}` : "-";
            const ev = document.createElement("span");
            ev.classList.add("kal-event");
            ev.textContent = `${uhrzeit || "--:--"} • ${saalText}`;
            td.appendChild(ev);
          });

          tag++;
        }

        tr.appendChild(td);
      }

      kalenderBody.appendChild(tr);
    }
  }

  function setView(mode) {
    if (!listenView || !kalenderView || !btnViewList || !btnViewCalendar) return;
    if (mode === "list") {
      listenView.classList.remove("hidden");
      kalenderView.classList.add("hidden");
      btnViewList.classList.add("active-view");
      btnViewCalendar.classList.remove("active-view");
    } else {
      listenView.classList.add("hidden");
      kalenderView.classList.remove("hidden");
      btnViewList.classList.remove("active-view");
      btnViewCalendar.classList.add("active-view");
    }
  }

  function selectMovie(movieId) {
    currentMovieId = movieId;
    renderMovieList();
    renderDetailsForMovie(movieId);
    renderShowList();
    renderCalendar();
    setView("list");
  }

  async function reloadAll() {
    movies = await apiGet("/api/filme");
    shows = await apiGet("/api/vorstellungen");
    renderMovieList();

    // Wenn noch kein Film gewählt: automatisch ersten wählen
    if (movies.length && currentMovieId == null) {
      selectMovie(movies[0].id);
    }
  }

  // Events
  btnViewList?.addEventListener("click", () => setView("list"));
  btnViewCalendar?.addEventListener("click", () => {
    setView("calendar");
    renderCalendar();
  });

  kalPrev?.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });

  kalNext?.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  btnFilterApply?.addEventListener("click", renderMovieList);
  suchBtn?.addEventListener("click", renderMovieList);
  filmSuche?.addEventListener("keyup", (e) => { if (e.key === "Enter") renderMovieList(); });

  // Buchen / Zurück / Bezahlen (minimal)
  buchenBtn?.addEventListener("click", () => {
    if (!ausgewaehlteVorstellung) {
      alert("Bitte zuerst eine Vorstellung auswählen.");
      return;
    }
    inhaltBox?.classList.add("hidden");
    buchenBox?.classList.remove("hidden");
  });

  zurueckBtn?.addEventListener("click", () => {
    buchenBox?.classList.add("hidden");
    inhaltBox?.classList.remove("hidden");
  });

  bezahlenBtn?.addEventListener("click", () => {
    alert("Buchung übernommen (Demo).");
  });

  // INIT
  detailsWrapper?.classList.add("hidden");
  buchenContainer?.classList.add("hidden");
  if (buchenBtn) buchenBtn.disabled = true;

  (async () => {
    try {
      await reloadAll();
    } catch (e) {
      console.error(e);
      alert("Konnte Daten nicht laden. Läuft Backend auf http://localhost:8080 ?");
    }
  })();
});
