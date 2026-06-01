# ASW26-TrainHub

## Introduzione
TrainHub è una web application progettata per centralizzare e semplificare il flusso di comunicazione tra le diverse figure coinvolte nel percorso di allenamento e alimentazione. L’obiettivo principale della piattaforma è migliorare l’efficienza organizzativa, favorire una comunicazione più strutturata e rendere più agevole il monitoraggio dei progressi del cliente.

Inoltre, l’applicazione offre un significativo supporto al personal trainer, consentendo la creazione di schede di allenamento mediante il riutilizzo di esercizi già salvati all’interno del sistema, con conseguente ottimizzazione dei tempi di programmazione.

## Tecnologia utilizzata
Per implementare l'applicazione, è stato usato lo stack **MEVN**:
- **MongoDB**
- **Express.js**
- **Vue.js**
- **Node.js**

## Requisiti
Assicurarsi di aver installato:
- **Node**
- **npm**

## Variabili file .env
Nella cartella backend, creare un file `.env` che contenga queste variabili:
```
PORT=5000
MONGODB_URI=connString
JWT_SECRET=jwtKey
```

## Guida per l'avvio
Aprire due terminali nella cartella del progetto.

Nel primo, eseguire questi comandi:

```powershell
# Server
cd backend
npm install
npm run dev
```

Nel secondo, eseguire questi comandi:

```powershell
# Client
cd frontend
npm install
npm run dev
```

## Profili utente
Per provare l'applicazione, usare questi profili:

- Cliente
  - Username: cliente.mariorossi
  - Password: 123456
- Personal Trainer (admin)
  - Username: alessandra.versari
  - Password: tortello
- Nutrizionista
  - Username: paolo.verdi
  - Password: 123456