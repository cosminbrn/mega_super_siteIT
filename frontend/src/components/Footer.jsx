import React from 'react';
import instagram from '../assets/images/instagram.png';
import facebook from '../assets/images/facebook.png';
import youtube from '../assets/images/youtube.png';
import twitch from '../assets/images/twitch.png';

function Footer() {
  // Cea mai importanta variabila, const, whatever, din tot proiectul
  /* <3 */ const rickroll = `https://www.youtube.com/watch?v=dQw4w9WgXcQ`; // <3
  /* <3 <3 <3 <3 <3<3<3<3<3<3 */

  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="social-icons">
        <a href={rickroll} target="_blank" rel="noopener noreferrer">
          <img src={instagram} alt="Instagram" className="social-icon" />
        </a>
        <a href={rickroll} target="_blank" rel="noopener noreferrer">
          <img src={facebook} alt="Facebook" className="social-icon" />
        </a>
        <a href={rickroll} target="_blank" rel="noopener noreferrer">
          <img src={youtube} alt="YouTube" className="social-icon" />
        </a>
        <a href={rickroll} target="_blank" rel="noopener noreferrer">
          <img src={twitch} alt="Twitch" className="social-icon" />
        </a>
      </div>

      <p> {currentYear} amogus. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
