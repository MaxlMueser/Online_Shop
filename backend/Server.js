const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const hpp = require('hpp');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Basis-Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Detailliertes Logging mit Morgan
app.use(morgan('combined'));

// Sicherheits-Header mit Helmet
app.use(helmet());

// Generiere für jede Anfrage eine Nonce für die Content-Security-Policy
app.use((req, res, next) => {
  req.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

// Konfiguriere Content-Security-Policy: Nur Skripte mit gültiger Nonce werden erlaubt
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        // Skripte müssen die korrekte Nonce besitzen, um geladen zu werden
        (req, res) => `'nonce-${req.nonce}'`
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    },
  })
);

// Rate Limiting: Maximal 100 Anfragen pro 15 Minuten pro IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Schutz vor HTTP Parameter Pollution
app.use(hpp());

// Zusätzliche Express-Einstellungen
app.set('case sensitive routing', true);
app.disable('x-powered-by'); // Entfernt den Server-Header
app.set('query parser', 'simple');
app.set('trust proxy', true);

// HTTPS erzwingen, wenn in Produktion (vorausgesetzt, du setzt NODE_ENV=production)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

 // MySQL-Verbindung
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

/*const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Marsone1142//',
  database: 'shop'
});
*/

db.connect((err) => {
  if (err) {
      console.error('Fehler beim Verbinden zur Datenbank:', err.stack);
      return;
  }
  console.log('Verbindung zur Datenbank hergestellt');
});

const SECRET_KEY = 'dhfgr6465hhfHHdj'; // Besser in einer .env Datei speichern

// 🔹 Registrierung eines neuen Nutzers mit Input-Validierung
app.post(
  '/register',
  [
    body('username')
      .isAlphanumeric()
      .withMessage('Benutzername muss alphanumerisch sein')
      .isLength({ min: 3 })
      .withMessage('Benutzername muss mindestens 3 Zeichen lang sein'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Passwort muss mindestens 6 Zeichen lang sein')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    
    db.query(sql, [username, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Benutzer erfolgreich registriert!' });
    });
  }
);

// 🔹 Login-Endpunkt mit Input-Validierung und sicheren Cookies
app.post(
  '/login',
  [
    body('username').exists().withMessage('Benutzername ist erforderlich'),
    body('password').exists().withMessage('Passwort ist erforderlich')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0) return res.status(401).json({ error: 'Benutzer nicht gefunden!' });
      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Falsches Passwort!' });
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
      // Setze ein sicheres HttpOnly-Cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      res.json({ token, userId: user.id });
    });
  }
);

// 🔹 Produkt zum Warenkorb hinzufügen
app.post('/cart', (req, res) => {
  const { userId, name, amount, price } = req.body;
  db.query(
    'INSERT INTO cart (user_id, name, amount, price) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE amount = amount + ?',
    [userId, name, amount, price, amount],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Produkt zum Warenkorb hinzugefügt' });
    }
  );
});

// 🔹 Produkte aus dem Warenkorb abrufen
app.get('/cart/:userId', (req, res) => {
  const { userId } = req.params;
  db.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// 🔹 Produkt aus Warenkorb entfernen
app.delete('/cart/:userId/:name', (req, res) => {
  const { userId, name } = req.params;
  db.query('DELETE FROM cart WHERE user_id = ? AND name = ?', [userId, name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Produkt entfernt' });
  });
});

// ✅ Bezahlung simulieren
app.post('/checkout', (req, res) => {
  const { userId } = req.body;
  db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Zahlung erfolgreich! Warenkorb geleert.' });
  });
});

// 📦 Produkte abrufen
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// 📦 Produkt hinzufügen
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  db.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Produkt hinzugefügt!' });
  });
});

// 📦 Produkt löschen
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Produkt gelöscht!' });
  });
});

// Server starten
app.listen(5000, () => console.log('Server läuft auf Port 5000'));

/*CREATE DATABASE shop;
USE shop;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_cart (user_id, name)
);
*/
