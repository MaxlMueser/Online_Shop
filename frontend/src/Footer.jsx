import React from 'react';
import './footer.css'; // Optional: CSS für Footer-Styling

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Mein Shop. Alle Rechte vorbehalten.</p>
    </footer>
  );
};

export default Footer;