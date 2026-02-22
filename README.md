# Kino-Management-System 🎬

Ein vollständiger, moderner Kino-Verwaltungsanwendung mit Spring Boot Backend und responsivem HTML5/CSS3/JavaScript Frontend.

## ✨ Features

- **Benutzerautentifizierung**: Registration und Login mit JWT-Token-Authentifizierung
- **Filmbewirtschaftung**: Filme erstellen, bearbeiten, löschen (Admin-Funktion)
- **Vorstellungsverwaltung**: Filmvorstellungen in verschiedenen Kinos/Sälen verwalten
- **Sitzbuchung**: Interaktiver Sitzplatzwähler mit Verfügbarkeitsprüfung
- **Ticketing**: Automatische Ticketgenerierung nach Buchung
- **Preisberechnung**: Dynamische Preisberechnung basierend auf Sitztyp und Rabattklassen
- **Benutzerverwaltung**: Benutzerdaten einsehen und anpassen
- **Theme-System**: Light/Dark-Mode mit CSS-Variablen

## 🏗️ Projektstruktur

```
src/main/
├── java/de/kinoapplikation/kino/
│   ├── KinoApplication.java          # Spring Boot Einstiegspunkt
│   ├── config/                       # Konfigurationsklassen
│   │   ├── SecurityConfig.java       # Spring Security & JWT-Konfiguration
│   │   ├── CorsConfig.java           # CORS-Einstellungen
│   │   ├── PasswordConfig.java       # Passwort-Encoder
│   │   ├── DbInitializer.java       # Datenbank-Initialisierung
│   │   └── AdminSeeder.java          # Admin-Benutzer erstellen
│   ├── controller/                   # REST API Endpoints
│   │   ├── BenutzerController.java   # Benutzer-Verwaltung
│   │   ├── FilmController.java       # Film-Verwaltung
│   │   ├── VorstellungController.java # Vorstellung-Verwaltung
│   │   ├── SaalController.java       # Saal-Verwaltung
│   │   ├── SitzplatzController.java  # Sitzplatz-Status & Verfügbarkeit
│   │   ├── BuchungController.java    # Buchung & Checkout
│   │   └── TicketsController.java    # Ticket-Verwaltung
│   ├── entity/                       # JPA-Entitäten (Datenmodell)
│   │   ├── Benutzer.java
│   │   ├── Film.java
│   │   ├── Vorstellung.java
│   │   ├── Saal.java
│   │   ├── Sitzplatz.java
│   │   ├── Buchung.java
│   │   ├── Tickets.java
│   │   └── ...
│   ├── dto/                          # Data Transfer Objects
│   │   ├── AuthDtos.java
│   │   ├── CheckoutDtos.java
│   │   └── ...
│   ├── repository/                   # Spring Data JPA Repositories
│   │   └── ...
│   ├── service/                      # Business Logic Layer
│   │   ├── BenutzerService.java
│   │   ├── FilmService.java
│   │   ├── VorstellungService.java
│   │   ├── BuchungService.java
│   │   └── ...
│   └── security/                     # JWT & Authentifizierung
│       ├── JwtUtil.java              # JWT Token Generation & Parsing
│       └── JwtAuthFilter.java        # JWT Filter für Request-Authentifizierung
├── resources/
│   ├── application.properties         # Spring Boot Konfiguration
│   └── static/
│       ├── index.html                # Hauptseite (Filmliste & Buchung)
│       ├── login.html                # Login-Seite
│       ├── register.html             # Registrierung-Seite
│       ├── Account.html              # Benutzerkonto-Seite
│       ├── Admin.html                # Admin-Panel
│       ├── css/
│       │   ├── theme.css             # Light/Dark-Mode CSS-Variablen
│       │   ├── main.css              # Hauptseite Styling
│       │   ├── login.css             # Login/Register Styling
│       │   ├── acc.css               # Account Styling
│       │   └── adm.css               # Admin Panel Styling
│       └── js/
│           ├── app.js                # Hauptseite Logik
│           ├── auth.js               # Login/Register Logik
│           ├── login.js              # Login-Seite Handler
│           ├── register.js           # Register-Seite Handler
│           ├── acc.js                # Account-Seite Logik
│           ├── adm.js                # Admin-Panel Logik
│           ├── nav.js                # Navigations-Logik
│           ├── theme.js              # Theme Toggle
│           └── auth-ui.js            # Auth UI Komponenten
```

## 🛠️ Technologie-Stack

### Backend
- **Spring Boot 3.x** - Web-Framework
- **Spring Security** - Authentifizierung & Autorisierung
- **Spring Data JPA** - ORM & Datenbankzugriff
- **JWT (JSON Web Tokens)** - Authentifizierungsmechanismus
- **Maven** - Build-Tool
- **H2 / MySQL** - Datenbank

### Frontend
- **HTML5** - Semantisches Markup
- **CSS3** - Responsive Design & Theming
- **Vanilla JavaScript** - Keine Frameworks (leicht & performant)
- **Fetch API** - HTTP-Kommunikation mit Backend

## 🚀 Quick Start

### Voraussetzungen
- Java 17+ (JDK)
- Maven 3.6+
- Node.js (optional, für Frontend-Entwicklung)

### Installierung & Starten

1. **Repository klonen**
```bash
git clone <repository-url>
cd Kino_Management_2
```

2. **Backend starten**
```bash
# Projekt bauen
mvn clean package

# Oder direkt starten
mvn spring-boot:run
```

3. **Frontend öffnen**
- Browser öffnen und zu `http://localhost:8080` navigieren
- Oder `index.html` direkt öffnen (bei lokalem Frontend-Entwicklung)

## 🔐 Authentifizierung

Das System verwendet **JWT (JSON Web Tokens)** für die Authentifizierung:

1. Benutzer registriert sich → Token wird in `localStorage` gespeichert
2. Jeder API-Request sendet Token im `Authorization: Bearer <token>` Header
3. Backend validiert Token mit Secret aus `application.properties`
4. Bei Ablauf muss Benutzer sich neu anmelden

### Default Admin Benutzer
- **Username**: `admin`
- **Passwort**: `admin123` (wird beim ersten Start erstellt)

## 📋 API-Endpunkte

Eine detaillierte Liste aller API-Endpunkte finden Sie in [API.md](./API.md)

## 🗄️ Datenmodell

- **Benutzer** - Registrierte Benutzer des Systems
- **Film** - Filme im Kino (mit Basispreis, FSK, Kategorie, etc.)
- **Saal** - Kinosäle (verschiedene Säle pro Kino)
- **Sitzplatz** - Einzelne Sitze im Saal (Bereich, Reihe, Platznummer)
- **Vorstellung** - Filmaufführung zu bestimmter Zeit & Saal
- **Buchung** - Benutzer-Sitzbuchung für eine Vorstellung
- **Tickets** - Generierte Tickets nach erfolgter Buchung

## 🎨 Frontend-Struktur

### Seiten
- **index.html** - Hauptseite mit Filmliste, Filter und Buchungsprozess
- **login.html** - Anmeldung
- **register.html** - Benutzerregistrierung
- **Account.html** - Benutzerkonto & Buchungsverlauf
- **Admin.html** - Admin-Dashboard (Filme, Vorstellungen, Säle verwalten)

### CSS-System
- **theme.css** - Zentrale CSS-Variablen für Light/Dark-Mode
- Alle Layouts verwenden CSS custom properties für konsistente Farben & Abstände

### JavaScript-Module
- **app.js** - Filmliste, Filter, Buchungslogik
- **auth.js** - Registrierung & Login Formular-Handler
- **theme.js** - Light/Dark-Mode Toggle
- **nav.js** - Navigationslogik

## ⚙️ Konfiguration

### application.properties
```properties
# Datenbank
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# JWT
kino.jwt.secret=your-secret-key-min-32-chars
kino.jwt.expirationMinutes=720

# Server
server.port=8080
```

## 📝 Kommentarrichtlinien

Der Code folgt diesen Konventionen für Dokumentation:

- **Java-Klassen**: JavaDoc mit Beschreibung, @author Tag
- **Öffentliche Methoden**: JavaDoc mit Parameter- und Return-Beschreibung
- **Komplexe Logik**: Inline-Kommentare auf Deutsch erklären das "Warum"
- **TODOs**: Markiert mit `// TODO:` für zukünftige Verbesserungen
- **JavaScript**: Kommentare erklären nicht-offensichtliche Logik

## 🐛 Fehlerbehandlung

- API gibt standardisierte Responses zurück (ok, message, data)
- Frontend zeigt Fehlermeldungen in Alert-Dialogen
- Backend-Exceptions werden in Controller gecacht und als HTTP-Status zurückgegeben

## 🔒 Sicherheit

- **CSRF-Protection**: Deaktiviert für REST API (Stateless)
- **CORS**: Konfigurierbar in CorsConfig.java
- **Password-Hashing**: BCrypt mit Spring Security
- **JWT-Secret**: Sollte in Production aus Umgebungsvariablen gelesen werden
- **Role-Based Access Control (RBAC)**: Admin vs. User Rollen

## 📊 Datenfluss Checkout

1. Frontend: Benutzer wählt Sitze aus
2. API `/api/buchungen/checkout`: POST mit Sitze-IDs
3. Backend: Verfügbarkeit prüfen → Buchung erstellen → Tickets generieren
4. Response: Buchungs-ID, Ticketnummern, Gesamtpreis
5. Frontend: Bestätigung anzeigen, Buchungshistorie aktualisieren

## 🚧 Bekannte TODOs

- [ ] Film-Dauer sollte bei Eingabe in Minuten umgerechnet werden (Film.java)
- [ ] Email-Validierung verbessern
- [ ] Password-Reset funktionalität hinzufügen
- [ ] Zahlungs-Integration (Stripe/PayPal)

## 📞 Support & Dokumentation

- Siehe [API.md](./API.md) für API-Reference
- Siehe [ARCHITECTURE.md](./ARCHITECTURE.md) für Architektur-Details
- Siehe [COMMENTED.md](./COMMENTED.md) für Kommentar-Übersicht

## 📄 Lizenz

Dieses Projekt ist Open Source. Details siehe LICENSE Datei.

---

**Letzte Aktualisierung**: February 22, 2026
**Autor**: Niklas
