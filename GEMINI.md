# TrainHub - Architecture Overview

## Tech Stack

### Frontend (Client)
- **Framework:** Vue.js 3 (Composition API, `<script setup>`)
- **Routing:** Vue Router
- **HTTP Client:** Axios per le comunicazioni con le API REST
- **State Management:** Gestione dello stato reattivo locale tramite `ref` e `computed`. Dati di sessione e token salvati in `localStorage`.
- **Styling:** CSS nativo con scope isolato per componente (`<style scoped>`).

### Backend (API Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (con Mongoose come ODM per definire i modelli)
- **Autenticazione:** JWT (JSON Web Tokens)
- **Gestione File:** Multer per l'upload di immagini (es. esercizi) su file system locale.
- **Documentazione API:** Swagger / OpenAPI 3.0 (generato tramite commenti JSDoc sulle routes).

## System Architecture

L'applicazione segue un'architettura **RESTful**:
1. **Frontend:** Una Single Page Application (SPA) che funge da interfaccia utente. Recupera ed invia dati asincronamente tramite chiamate HTTP JSON al backend.
2. **Backend:** Un server Express che espone endpoint API protetti. Gestisce la logica di business, le policy di accesso (RBAC) e la persistenza dei dati su MongoDB.

## Ruoli e Access Control (RBAC)
Il sistema divide le autorizzazioni (tramite middleware `authorize`) in tre ruoli principali:
- **Client (Atleta):** Può visualizzare i propri programmi di allenamento, i piani nutrizionali e registrare i log nel proprio diario personale.
- **Trainer:** Può creare programmi di allenamento, monitorare i clienti, gestire scadenze (Bozze/Scadenze) e inviare richieste ai nutrizionisti.
- **Nutritionist:** Può ricevere le richieste dai trainer e creare/gestire piani nutrizionali per i clienti.

## Moduli Principali (Domain)

- **Autenticazione (`/api/auth`):** Login e generazione del token JWT.
- **Training Programs:** Gestione completa delle schede di allenamento suddivise per split (giorni) e righe di esercizi. Supporta stati (`draft`, `active`, `archived`).
- **Nutrition Plans & Requests:** Flusso di comunicazione tra Trainer e Nutrizionista per la delega e la creazione di piani alimentari.
- **Diario Personale (Body Diary):** Tracciamento giornaliero delle abitudini del cliente (Fame, Passi, Aderenza, Attività).
- **Esercizi:** Catalogo degli esercizi con possibilità di upload delle immagini dimostrative.
- **Notifiche e Scadenze:** Sistema di alert e tracking del lavoro da completare per i dipendenti (es. programmi in scadenza).

## Struttura del Progetto

### Frontend (`/frontend/src/`)
- `/components/`: Componenti UI riutilizzabili (`Navbar`, `SideMenu`, `StaticCard`, `MainList`).
- `/pages/`: Viste principali associate alle rotte (`Login.vue`, `DiarioCliente.vue`, `Scadenze.vue`, etc.).
- `/utils/`: Funzioni helper e costanti condivise.

### Backend (`/backend/`)
- `/routes/`: Definizione degli endpoint, bind dei controller e applicazione dei middleware.
- `/controllers/`: Logica di business per singola entità.
- `/models/`: Schemi Mongoose per la struttura dei documenti su MongoDB.
- `/middleware/`: Filtri di sicurezza (es. `auth.js`) e utility (es. `upload.js`).

TrainHub Backend Analysis Report

  1. Architectural Overview

  The backend follows a standard Model-View-Controller (MVC) pattern (with Routes as the
  interface) and utilizes Middleware for cross-cutting concerns like Authentication and
  Role-Based Access Control (RBAC).

   * Routing: Endpoints are logically grouped (auth, users, training-programs, etc.).
   * Controllers: Business logic is mostly encapsulated in controllers, though some controllers
     are becoming bloated with complex queries.
   * Models: Mongoose schemas define the data structure, with some utility methods
     (statics/methods) for common queries.
   * Middleware: auth.js handles JWT verification and basic role checks.

  ---

  2. Critical Implementation Gaps & Logic Flags 🚩

  A. Missing Implementation & Content Gaps
   * Incomplete Middleware: authorizeAthleteAccess in auth.js contains a TODO for the
     nutritionist role, meaning nutritionists currently lack a validated path to access athlete
     data through this middleware.


  B. Logic Gaps & Edge Cases
   * 
   * 
   * Duplicate Diary Entries: personalDiaryController.js does not check if an entry already
     exists for a specific date/athlete. This allows multiple conflicting diary entries for the
     same day.
   * 

  ---

  3. Database & Schema Flags 🗄️

   * 

  ---

  4. Actionable Recommendations for Robustness 🛠️

  Phase 1: Immediate Bug Fixes
   1. Fix Mongoose Keyword: Bulk replace require: true with required: true across all files in
      /models.
   2. Sync Field Names: Standardize on status or programStatus across both models and controller      queries.
   3. Repair createNotification: Update the call in nutritionPlanController.js to match the
      positional arguments in notificationController.js.
   4. Update Middleware: Fix the assignedTrainerId field reference in auth.js.

  Phase 2: Structural Improvements
   1. Introduce a Service Layer: Move complex logic (like the stats calculation in
      userController.js) into separate service files. This makes controllers thinner and logic
      easier to unit test.
   2. Centralized Validation: Implement a library like Joi or Zod to validate req.body at the
      route level before it reaches the controller.
   3. Global Error Handler: Replace the repetitive try/catch blocks with an asyncHandler wrapper      and a centralized error-handling middleware to ensure consistent JSON error responses.
   4. Refactor controllerHelpers.js: Expand this into a more robust library of "Base Service"
      methods to reduce code duplication for CRUD operations.

  Phase 3: Data Integrity
   1. Date Uniqueness: Add a compound unique index to BodyDiary for { athleteId: 1, date: 1 } to      enforce one entry per day.
   2. Schema Enforcement: Define stricter sub-document schemas for meals and splits to prevent
