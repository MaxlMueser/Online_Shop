# 🛒 Mein Online Shop

Ein moderner Webshop mit **React (Frontend)**, **Node.js/Express (Backend)** und **MySQL (Datenbank)**.  
Alle Komponenten laufen in Docker-Containern und sind einfach zu starten. 🚀  

---

## 📌 Features
- 🛍 **Produkte in den Warenkorb legen**
- 👤 **User-Registrierung & Login**
- 💾 **Persistente Speicherung der Daten in MySQL**
- ⚡ **Schnelles Frontend mit React & Vite**
- 🔒 **Sichere Passwort-Verschlüsselung**
- 📦 **Einfache Bereitstellung mit Docker & Docker-Compose**

---

## 🏗 Projektstruktur
📂 MeinOnlineShop │── 📂 backend # Express.js Backend (Node.js, MySQL) │── 📂 frontend # React.js Frontend (Vite) │── 📂 mysql_data # Persistente MySQL-Daten (Docker-Volume) │── 📄 docker-compose.yml # Docker-Setup für das Projekt │── 📄 .gitignore # Dateien, die nicht in Git übernommen werden │── 📄 README.md # Diese Dokumentation

## 🛠 Installation & Starten

### **📌 Voraussetzungen**
✅ **Docker & Docker-Compose** installiert  
✅ **Node.js & npm** (falls du das Projekt lokal testen willst)  

### **🚀 Anwendung mit Docker starten**
1️⃣ **Öffne das Terminal in VS Code**  
2️⃣ **Wechsle ins Hauptverzeichnis:**  
```bash
cd MeinOnlineShop

3️⃣ Starte alle Container (Datenbank, Backend, Frontend)

docker-compose up --build

🎉 Dein Shop läuft jetzt unter:

Frontend: http://localhost:3000
Backend: http://localhost:5000
Datenbank: MySQL auf localhost:3306

📌 Lokale Entwicklung ohne Docker
Falls du ohne Docker arbeiten willst, starte die Komponenten manuell:

Backend starten
cd backend
npm install
node server.js

Frontend starten
cd frontend
npm install
npm run dev

📜 API-Endpunkte
Methode	Route	Beschreibung
POST	/api/register	Neuen Nutzer registrieren
POST	/api/login	Nutzer einloggen
GET	/api/products	Alle Produkte abrufen
POST	/api/cart	Produkt in den Warenkorb legen

🛠 Wichtige Befehle
Befehl	Beschreibung
docker-compose up --build	Container starten & erstellen
docker-compose down	Container stoppen & entfernen
docker ps	Laufende Container anzeigen
npm install	Abhängigkeiten installieren
npm run dev	Frontend im Entwicklungsmodus starten

📌 To-Do & Verbesserungen
✅ Mehr Produkte & Kategorien hinzufügen
✅ Bestellprozess mit Checkout erweitern
✅ Styling verbessern mit Tailwind oder Material-UI
✅ Tests mit Jest und React Testing Library schreiben

🤝 Beitrag & Support
Falls du das Projekt verbessern möchtest, Pull Requests sind willkommen!
📧 Kontakt: Maximilian Müser
