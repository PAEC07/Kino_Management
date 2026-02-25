# Architektur-Dokumentation - Kino-Management System

Eine detaillierte Übersicht der Systemarchitektur, Designmuster und Datenflüsse.

## 🏛️ Überblick Architektur

Das System folgt einer **drei-schichtigen Architektur** (Three-Layer Architecture):

```
┌─────────────────────────────────────┐
│     PRESENTATION LAYER              │
│  (HTML, CSS, JavaScript)            │
│  - UI Components                    │
│  - Form Validation                  │
│  - API Communication                │
└┬────────────────────────────────────┘
 │ HTTP/REST
┌┴────────────────────────────────────┐
│     APPLICATION LAYER               │
│  (Spring Boot REST Controllers)     │
│  - Request Handling                 │
│  - Response Formatting              │
│  - Request Validation               │
│  - Security Checks (Roles/JWT)      │
└┬────────────────────────────────────┘
 │
┌┴────────────────────────────────────┐
│     BUSINESS LOGIC LAYER            │
│  (Services)                         │
│  - Domain Logic                     │
│  - Transactions                     │
│  - Calculations                     │
└┬────────────────────────────────────┘
 │
┌┴────────────────────────────────────┐
│     DATA ACCESS LAYER               │
│  (JPA Repositories)                 │
│  - Database Operations              │
│  - Query Building                   │
└┬────────────────────────────────────┘
 │ JDBC
┌┴────────────────────────────────────┐
│     DATABASE LAYER                  │
│  (H2 / MySQL)                       │
│  - Data Storage                     │
│  - Persistence                      │
└─────────────────────────────────────┘
```

## 📊 Datenmodell (Entity Relationship Diagram)

```
┌─────────────┐
│   Benutzer  │
├─────────────┤
│ * id        │────┐
│ * username  │    │
│ * email     │    │     ┌──────────────┐
│ * password  │    └────→│  Buchungen   │
│ * role      │          ├──────────────┤
│             │          │ * id         │
└─────────────┘          │ * benutzer_id├────┐
                         │ * datum      │    │
                         │ * vorstellung┤    │
                         │   _id        │    │     ┌─────────────┐
                         └──────────────┘    └────→│  Tickets    │
                                                   ├─────────────┤
                         ┌───────────────────┐     │ * id        │
                         │   Vorstellung     │     │ * buchung_id│
                    ┌───→├─────────────────┐ │     │ * sitzplatz │
                    │    │ * id            │ │     │ * preis     │
                    │    │ * film_id       ├─┘     │ * datum     │
                    │    │ * saal_id       │       └─────────────┘
                    │    │ * datum         │
                    │    │ * preisZuschlag │   ┌─────────────────┐
                    │    └─────────────────┘   │  Sitzplatz      │
                    │                      ├──→├─────────────────┤
                    │                      │   │ * id            │
                    │    ┌─────────────┐   │   │ * saal_id       │
                    │    │    Film     │   │   │ * bereich       │
                    └───→├─────────────┤───┘   │ * reihe         │
                         │ * id        │       │ * platzNr       │
                         │ * filmname  │       │ * type          │
                         │ * basispreis│       └─────────────────┘
                         │ * fsk       │
                         │ * kategorie │       ┌─────────────┐
                         │ * filmdauer │   ┌──→│    Saal     │
                         │ * darstellung   │   ├─────────────┤
                         │   typ       │───┘   │ * id        │
                         └─────────────┘       │ * saalname  │
                                               │ * kapazitat │
                                               └─────────────┘
```

## 🔐 Security-Architektur

### JWT-Token Flow

```
┌─────────────────────┐
│  Benutzer           │
│  Login              │
└──────────┬──────────┘
           │ POST /api/benutzer/login
           │
           ▼
┌─────────────────────────────────┐
│  BenutzerController.login()     │
│  - Validiere Credentials        │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  BenutzerService.login()        │
│  - Hash-Vergleich (BCrypt)      │
│  - Token-Generierung            │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  JwtUtil.generateToken()        │
│  - Payload: userId, username    │
│  - Sign with Secret             │
│  - Set Expiration               │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Response mit JWT Token         │
│  Token speichert im localStorage│
└─────────────────────────────────┘
```

### Request mit JWT

```
Frontend:
  const token = localStorage.getItem('kino_token');
  const headers = new Headers({
    'Authorization': `Bearer ${token}`
  });
  fetch('/api/buchungen/checkout', {headers, ...});

Backend (JwtAuthFilter):
  1. Extrahiere Token aus Authorization Header
  2. Validiere Token-Signatur mit Secret
  3. Parse Claims (userId, username, role)
  4. Setze SecurityContext
  5. Continue to next Filter
```

## 🎯 Design Patterns

### 1. Service Layer Pattern
Alle Business-Logik ist in den `*Service.java` Klassen implementiert.

```java
@Service
class FilmService {
  private FilmRepository filmRepo;
  
  public Film addFilm(Film film) {
    // Validation
    if (film == null) throw new IllegalArgumentException(...);
    // Business Logic
    return filmRepo.save(film);
  }
}
```

**Vorteil**:
- Separation of Concerns
- Testbar
- Wiederverwendbar

### 2. Repository Pattern
Data Access über Spring Data JPA Repositories.

```java
interface FilmRepository extends JpaRepository<Film, Long> {
  List<Film> findByKategorie(String kategorie);
}
```

**Vorteil**:
- Abstraktion der Persistierung
- CRUD-Operationen automatisch
- Custom Queries möglich

### 3. DTO (Data Transfer Object) Pattern
Transfer von Daten zwischen Schichten, nicht direkt Entities.

```java
// Frontend → Backend
class LoginRequest {
  String username;
  String password;
}

// Backend → Frontend
class AuthResponse {
  boolean ok;
  String message;
  String token;
}
```

**Vorteil**:
- API-Versioning
- Sicherheit (verstecke interne Fields)
- Flexible Daten-Transformationen

### 4. Dependency Injection (DI)
Spring Boot Inversion of Control für Abhängigkeiten.

```java
@RestController
class FilmController {
  private final FilmService service;
  
  // Constructor Injection
  public FilmController(FilmService service) {
    this.service = service;
  }
}
```

## 🔄 Datenfluss - Checkout Prozess

Ein detailliertes Beispiel des Checkout/Buchungs-Flows:

```
1. FRONTEND: Benutzer wählt Sitze
   └─→ seatList = [{id: 1, row: A, num: 1}, ...]

2. FRONTEND: Discount-Klassen auswählen
   └─→ discountList = ["FULL", "STUDENT", ...]

3. FRONTEND: API Call
   POST /api/buchungen/checkout
   Body: {
     benutzerId: 1,
     vorstellungId: 5,
     sitzplatzIds: [1, 2, 3],
     rabattKlassen: ["FULL", "STUDENT", "CHILD"]
   }

4. BACKEND: SecurityFilter prüft JWT
   └─→ SecurityContext mit User Info

5. BACKEND: BuchungController.checkout()
   ├─ Validiere Input
   └─→ Forwarde zu BuchungService

6. BACKEND: BuchungService.checkout() @Transactional
   ├─ Hole Film + Basus-Preis
   ├─ Erstelle Buchung (Buchung.java)
   │  └─→ buchungRepo.save(buchung);
   ├─ Für jeden Sitzplatz:
   │  ├─ Hole Sitzplatz-Details
   │  ├─ Check: Ist Platz belegt?
   │  │  └─→ sitzplatzRepo.countTicketForSeatAndShow()
   │  ├─ Berechne Preis (base * rabatt * zuschlag)
   │  └─ Erstelle + speichere Ticket
   │     └─→ ticketsRepo.save(ticket);
   └─→ Return CheckoutResponse

7. BACKEND: Response zum Frontend
   Response: {
     ok: true,
     message: "Buchung erfolgreich",
     buchungsId: 42,
     gesamtPreis: 2500
   }

8. FRONTEND: Erfolg anzeigen
   ├─ Bestätigungsdialog
   ├─ LocalStorage aktualisieren
   └─ Navigiere zu Meine Buchungen

9. DATABASE: Transaction commit
   ✓ Buchung eingefügt
   ✓ Tickets eingefügt
   ✓ Änderungen persistent
```

## 📱 Frontend-Datenlauf

### Hauptseite (index.html)

```javascript
// app.js - Hauptmoddul

// 1. Initials Load
DOMContentLoaded
  ├─ Hole Filme: GET /api/filme/list
  ├─ Hole Vorstellungen: GET /api/vorstellungen/list
  ├─ Hole Säle: GET /api/saal/list
  └─ Render UI

// 2. Film auswählen
filmListEL.addEventListener('click', (film) => {
  currentMovie = film;
  render Film-Details rechts
  zeige Vorstellungen für Film
})

// 3. Vorstellung auswählen
vorstellungList.addEventListener('click', (show) => {
  currentShow = show;
  Hole Sitzplan: GET /api/sitze/status/{showId}/{hallId}
  render Sitzplan-Grid
})

// 4. Sitze auswählen
sitzContainer.addEventListener('click', (seat) => {
  if (!belegt) {
    selectedSeats.push(seat);
    Berechne Preis
    Update UI
  }
})

// 5. Buchen
buchenBtn.addEventListener('click', () => {
  POST /api/buchungen/checkout
  ShowSuccess / ShowError
})
```

## 🗄️ Datenbank-Schema

Das System verwendet folgende Tabellen:

| Tabelle | Zweck | Wichtige Spalten |
|---------|-------|------------------|
| `benutzer` | Benutzerkonten | id, username, email, password_hash, role |
| `film` | Filme-Katalog | id, filmname, basispreis, fsk, kategorie |
| `saal` | Kinosäle | id, saalname, kapazitaet |
| `sitzplatz` | Einzelne Sitze | id, saal_id, reihe, platzNr, bereich, typ |
| `vorstellung` | Filmaufführungen | id, film_id, saal_id, datum, preisZuschlag |
| `buchung` | Sitzbuchungen | id, benutzer_id, datum |
| `tickets` | Generierte Tickets | id, buchung_id, sitzplatz_id, preis |
| `tbl_discounts` | Rabatt-Klassen | id, name, prozent |
| `tbl_sittyp` | Sitztypen | id, name, zuschlag |

## ⚙️ Konfiguration

### Spring Boot (application.properties)

```properties
# Server
server.port=8080
server.servlet.context-path=/

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect

# Datasource (H2 oder MySQL)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JWT Secret (min 32 chars für HS256)
kino.jwt.secret=your-very-long-secret-key-min-32-chars
kino.jwt.expirationMinutes=720

# CORS
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE
spring.web.cors.allow-credentials=true
```

### Umgebungsvariablen (Production)

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://host:3306/kino
export SPRING_DATASOURCE_USERNAME=user
export SPRING_DATASOURCE_PASSWORD=pass
export KINO_JWT_SECRET=${openssl rand -base64 32}
```

## 🧪 Testing-Strategie

Zukünftige Test-Struktur:

```
src/test/java/
├── unit/
│   ├── BenutzerServiceTest
│   ├── FilmServiceTest
│   └── BuchungServiceTest
├── integration/
│   ├── BenutzerControllerIntegrationTest
│   ├── CheckoutFlowTest
│   └── AuthenticationTest
└── e2e/
    ├── BookingWorkflowE2ETest
    └── AdminFunctionsE2ETest
```

## 🚀 Deployment

### Docker (zukünftig)

```dockerfile
FROM openjdk:17-slim
COPY target/kino-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
EXPOSE 8080
```

### Docker Compose (zukünftig)

```yaml
version: '3.8'
services:
  kino-app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/kino
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=secret
    depends_on:
      - mysql
  
  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=kino
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## 🔧 CI/CD Pipeline (zukünftig)

```yaml
# GitHub Actions (.github/workflows/ci.yml)

name: CI/CD

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK
        uses: actions/setup-java@v2
        with:
          java-version: '17'
      - name: Build with Maven
        run: mvn clean package -DskipTests
      - name: Run tests
        run: mvn test
      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: # deployment script
```

## 📈 Performance-Überlegungen

### Datenbank
- Indizes auf `id`, `benutzer_id`, `film_id`, `saal_id`
- Lazy-Loading für Beziehungen wo möglich
- Pagination für große Listen

### Caching (zukünftig)
```java
@Cacheable("films")
public List<Film> getAlleFilme() { ... }
```

### API Pagination
```
GET /api/filme/list?page=0&size=20&sort=filmname,asc
```

## 🔒 Sicherheits-Maßnahmen

1. **JWT-Tokens**: Stateless Authentication
2. **Password Hashing**: BCrypt mit Salt
3. **CORS**: Eingeschränkte Herkunften
4. **SQL Injection**: JPA Prepared Statements
5. **CSRF**: Disabled für REST (Stateless)
6. **XSS**: Content-Security-Policy Headers
7. **Rate Limiting**: (zukünftig) Spring Cloud Gateway

## 📚 Erweiterungspunkte

Zukünftige Verbesserungen:

- [ ] Payment Integration (Stripe/PayPal)
- [ ] Email-Notifications
- [ ] Caching (Redis)
- [ ] Logging (Logback/ELK)
- [ ] Monitoring (Micrometer/Prometheus)
- [ ] API Versioning (REST v2)
- [ ] GraphQL Endpoint
- [ ] Microservices (Future)

---

**Letzte Aktualisierung**: February 22, 2026
**Dokumentation Version**: 1.0
