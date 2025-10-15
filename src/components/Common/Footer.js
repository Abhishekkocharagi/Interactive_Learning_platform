import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>CodeLearn Platform</h3>
            <p>Empowering developers through interactive learning</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#courses">Courses</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Technologies</h4>
            <ul>
              <li>React.js</li>
              <li>JavaScript</li>
              <li>MySQL</li>
              <li>Chart.js</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 CodeLearn Platform. Built by Abhishek Kocharagi</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;