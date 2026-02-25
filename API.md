# API-Referenz - Kino-Management System

Diese Dokumentation beschreibt alle verfügbaren REST API Endpunkte.

**Base URL**: `http://localhost:8080/api`

## 🔐 Authentifizierung

Bei geschützten Endpunkten muss der JWT-Token im Header mitgesendet werden:
```
Authorization: Bearer <your-jwt-token>
```

---

## 👤 Benutzer-Verwaltung (`/api/benutzer`)

### Registrierung
**POST** `/api/benutzer/register`

Neuen Benutzer registrieren.

**Request-Body**:
```json
{
  "username": "string",
  "email": "string@example.com",
  "password": "string (min 8 chars)",
  "passwordConfirm": "string"
}
```

**Response** (200 OK):
```json
{
  "ok": true,
  "message": "Registrierung erfolgreich.",
  "token": "jwt-token-string",
  "id": 1
}
```

**Fehler**: 
- 400: Validierungsfehler
- 409: Username/Email bereits registriert

---

### Anmeldung
**POST** `/api/benutzer/login`

Benutzer anmelden und JWT-Token erhalten.

**Request-Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response** (200 OK):
```json
{
  "ok": true,
  "message": "Anmeldung erfolgreich.",
  "token": "jwt-token-string",
  "id": 1
}
```

**Fehler**:
- 401: Ungültige Benutzer oder Passwort

---

### Alle Benutzer auflisten
**GET** `/api/benutzer/list` - nur Admin

Liste alle registrierten Benutzer auf.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  },
  {
    "id": 2,
    "username": "user1",
    "email": "user@example.com",
    "role": "USER"
  }
]
```

---

### Benutzer-Details abrufen
**GET** `/api/benutzer/{id}/get`

Detailinformationen eines Benutzers.

**Response** (200 OK):
```json
{
  "id": 1,
  "username": "user1",
  "email": "user@example.com",
  "role": "USER"
}
```

---

### Benutzerdaten ändern
**PUT** `/api/benutzer/{id}/change`

Ändere Benutzerdaten (nur der Benutzer selbst oder Admin).

**Request-Body**:
```json
{
  "username": "new-username",
  "email": "newemail@example.com"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "username": "new-username",
  "email": "newemail@example.com",
  "role": "USER"
}
```

---

## 🎬 Film-Verwaltung (`/api/filme`)

### Alle Filme auflisten
**GET** `/api/filme/list`

Alle verfügbaren Filme.

**Query-Parameter (optional)**:
- `genre`: Filter nach Kategorie (z.B. "Action", "Comedy")

**Response** (200 OK):
```json
[
  {
    "filmId": 1,
    "filmname": "Der Herr der Ringe",
    "beschreibung": "Episches Fantasy-Abenteuer",
    "fsk": 12,
    "kategorie": "Fantasy",
    "basispreis": 1000,
    "filmdauer": "PT3H49M",
    "darstellungstyp": "2D"
  }
]
```

---

### Nach Genre filtern
**GET** `/api/filme/filter?genre=Action`

Wähle Filme nach Kategorie.

**Response**: (wie oben)

---

### Film-Details abrufen
**GET** `/api/filme/{id}/get`

Detailinformationen eines bestimmten Films.

**Response** (200 OK):
```json
{
  "filmId": 1,
  "filmname": "Der Herr der Ringe",
  "beschreibung": "Episches Fantasy-Abenteuer",
  "fsk": 12,
  "kategorie": "Fantasy",
  "basispreis": 1000,
  "filmdauer": "PT3H49M",
  "darstellungstyp": "2D"
}
```

---

### Film hinzufügen
**POST** `/api/filme/add` - nur Admin

Neuen Film ins System eintragen.

**Request-Body**:
```json
{
  "filmname": "Neuer Film",
  "beschreibung": "Beschreibung",
  "fsk": 12,
  "kategorie": "Action",
  "basispreis": 1200,
  "filmdauer": "PT2H00M",
  "darstellungstyp": "2D"
}
```

**Response** (200 OK): Film-Objekt (wie Film abrufen)

---

### Film löschen
**DELETE** `/api/filme/{id}/delete` - nur Admin

Löscht einen Film und alle zugehörigen Vorstellungen.

**Response**: 200 OK (kein Body)

---

## 🎭 Vorstellungs-Verwaltung (`/api/vorstellungen`)

### Alle Vorstellungen auflisten
**GET** `/api/vorstellungen/list`

Alle geplanten Filmvorstellungen.

**Response** (200 OK):
```json
[
  {
    "vorstellungId": 1,
    "filmId": 1,
    "filmname": "Der Herr der Ringe",
    "saalId": 1,
    "saalname": "Kinosaal 1",
    "vorstellungsDatum": "2026-02-28T19:30:00",
    "preisZuschlag": 0.0
  }
]
```

---

### Vorstellung-Details abrufen
**GET** `/api/vorstellungen/{id}/get`

Detailinformationen einer Vorstellung.

**Response**: (wie oben)

---

### Vorstellung hinzufügen
**POST** `/api/vorstellungen/add` - nur Admin

Neue Filmvorstellung planen.

**Request-Body**:
```json
{
  "filmId": 1,
  "saalId": 1,
  "vorstellungsDatum": "2026-02-28T19:30:00",
  "preisZuschlag": 0.0
}
```

**Response** (200 OK): Vorstellung-Objekt

---

### Vorstellung löschen
**DELETE** `/api/vorstellungen/{id}/delete` - nur Admin

Löscht eine Vorstellung (und deren Buchungen/Tickets).

**Response**: 200 OK

---

## 🎪 Saal-Verwaltung (`/api/saal`)

### Alle Säle auflisten
**GET** `/api/saal/list`

Alle Kinosäle mit Sitzplätzen.

**Response** (200 OK):
```json
[
  {
    "saalId": 1,
    "saalname": "Kinosaal 1",
    "kapazitaet": 100
  }
]
```

---

### Saal hinzufügen
**POST** `/api/saal/add` - nur Admin

Neuen Kinosaal erstellen.

**Request-Body**:
```json
{
  "saalname": "Kinosaal 1",
  "kapazitaet": 100
}
```

**Response** (200 OK): Saal-Objekt

---

### Saal löschen
**DELETE** `/api/saal/{id}/delete` - nur Admin

Löscht einen Saal.

**Response**: 200 OK

---

## 🪑 Sitzplatz-Verwaltung (`/api/sitze`)

### Sitzplatz-Status (Verfügbarkeit)
**GET** `/api/sitze/status/{vorstellungId}/{saalId}`

Zeigt alle Sitzplätze eines Saals und deren Verfügbarkeit für eine Vorstellung.

**Response** (200 OK):
```json
[
  {
    "sitzId": 1,
    "reihe": "A",
    "platzNr": 1,
    "bereich": "normaal",
    "belegt": false
  },
  {
    "sitzId": 2,
    "reihe": "A",
    "platzNr": 2,
    "bereich": "normaal",
    "belegt": true
  }
]
```

**Bereich-Typen**:
- `normal` - Standard-Sitzplätze
- `loge` - Premium-Sitze (höherer Preis)
- `behindertengerecht` - Zugänglich

---

### Alle Sitzplätze auflisten
**GET** `/api/sitze/list`

Alle Sitzplätze im System (komplette Liste).

---

## 📦 Buchung & Checkout (`/api/buchungen`)

### Checkout (Sitze buchen)
**POST** `/api/buchungen/checkout`

Buche mehrere Sitze für eine Vorstellung.

**Request-Body**:
```json
{
  "benutzerId": 1,
  "vorstellungId": 1,
  "sitzplatzIds": [1, 5, 6],
  "rabattKlassen": ["NONE", "STUDENT", "CHILD"]
}
```

**Response** (200 OK):
```json
{
  "ok": true,
  "message": "Buchung erfolgreich",
  "buchungsId": 42,
  "gesamtPreis": 2500
}
```

**Rabatt-Klassen**:
- `NONE` (1.0) - Vollpreis
- `STUDENT` (0.8) - Student-Rabatt 20%
- `SENIOR` (0.85) - Senior-Rabatt 15%
- `CHILD` (0.7) - Kinder-Rabatt 30%

---

### Alle Buchungen auflisten
**GET** `/api/buchungen/list`

Alle Buchungen (Admin-View).

**Response** (200 OK):
```json
[
  {
    "buchungsId": 1,
    "benutzerId": 2,
    "datum": "2026-02-22T14:30:00",
    "vorstellungId": 1
  }
]
```

---

### Benutzer-Buchungen abrufen
**GET** `/api/buchungen/list/{benutzerId}`

Alle Buchungen eines bestimmten Benutzers.

**Response**: (wie oben, nur für Benutzer)

---

### Buchung-Details abrufen
**GET** `/api/buchungen/{id}/get`

Detailinformationen einer Buchung.

**Response** (200 OK):
```json
{
  "buchungsId": 1,
  "benutzerId": 2,
  "datum": "2026-02-22T14:30:00",
  "vorstellungId": 1
}
```

---

### Buchung stornieren
**DELETE** `/api/buchungen/{id}/delete`

Storniere eine Buchung (und ihre Tickets).

**Response**: 200 OK

---

## 🎫 Tickets (`/api/tickets`)

### Benutzer-Tickets abrufen
**GET** `/api/tickets/by-user/{benutzerId}`

Alle Tickets eines Benutzers.

**Response** (200 OK):
```json
[
  {
    "ticketId": 1,
    "ticketNummer": "KINO-2026-000001",
    "buchungsId": 1,
    "sitzplatzId": 5,
    "preis": 800,
    "datum": "2026-02-22T14:30:00"
  }
]
```

---

### Meine Buchungen (Benutzer-Sicht)
**GET** `/api/tickets/my-bookings`

Meine Buchungen mit Ticket-Details (erfordert Authentifizierung).

**Response** (200 OK):
```json
[
  {
    "buchungsId": 1,
    "filmname": "Der Herr der Ringe",
    "saalname": "Kinosaal 1",
    "vorstellungsDatum": "2026-02-28T19:30:00",
    "tickets": [
      {
        "ticketId": 1,
        "ticketNummer": "KINO-2026-000001",
        "reihe": "A",
        "platzNr": 1,
        "preis": 900
      }
    ],
    "gesamtPreis": 900
  }
]
```

---

## 🔄 HTTP-Status Codes

| Code | Bedeutung |
|------|-----------|
| 200 | OK - Anfrage erfolgreich |
| 201 | Created - Ressource erstellt |
| 204 | No Content - Erfolgreich, kein Inhalt |
| 400 | Bad Request - Ungültige Eingabe |
| 401 | Unauthorized - Authentifizierung erforderlich |
| 403 | Forbidden - Keine Berechtigung |
| 404 | Not Found - Ressource nicht gefunden |
| 409 | Conflict - Ressource existiert bereits |
| 500 | Internal Server Error - Serverfehler |

---

## 💡 Beispiel-Workflow

### 1. Registrierung & Login
```bash
# Registrieren
curl -X POST http://localhost:8080/api/benutzer/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"12345678","passwordConfirm":"12345678"}'

# Login
curl -X POST http://localhost:8080/api/benutzer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"12345678"}'
```

### 2. Film & Vorstellung ansehen
```bash
# Alle Filme
curl http://localhost:8080/api/filme/list

# Alle Vorstellungen
curl http://localhost:8080/api/vorstellungen/list
```

### 3. Sitze anschauen
```bash
# Verfügbare Sitze für Vorstellung 1, Saal 1
curl http://localhost:8080/api/sitze/status/1/1
```

### 4. Buchen
```bash
# Sitze 1, 2, 3 buchen für Vorstellung 1
curl -X POST http://localhost:8080/api/buchungen/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "benutzerId": 1,
    "vorstellungId": 1,
    "sitzplatzIds": [1, 2, 3],
    "rabattKlassen": ["FULL", "STUDENT", "CHILD"]
  }'
```

---

**Letzte Aktualisierung**: February 22, 2026
