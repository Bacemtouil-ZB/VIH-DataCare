import React, { useState, useEffect } from 'react';
import './Footer.css';

const Footer = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Citations motivantes pour l'équipe médicale
  const motivationalQuotes = [
    {
      text: "Chaque patient est une opportunité de faire du bien dans ce monde.",
      author: "Équipe MediCare"
    },
    {
      text: "La médecine est l'art de guérir le corps et de réconforter l'âme.",
      author: "Hippocrate"
    },
    {
      text: "Votre travail sauve des vies. Chaque jour, vous faites une différence.",
      author: "Équipe MediCare"
    },
    {
      text: "Là où l'art de la médecine est aimé, il y a aussi un amour de l'humanité.",
      author: "Hippocrate"
    },
    {
      text: "La compassion est le meilleur médicament que nous puissions offrir.",
      author: "Anonyme"
    }
  ];

  // Changer la citation toutes les 10 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % motivationalQuotes.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [motivationalQuotes.length]);

  const currentQuote = motivationalQuotes[quoteIndex];

  return (
    <footer className="footer-fixed">
      <div className="container-fluid px-4">      
        {/* Main Footer Content */}
        <div className="row align-items-center py-3">
          {/* Citation motivante */}
          <div className="col-md-8">
            <div className="quote-container">
              <div className="d-flex align-items-start">
                <div className="quote-icon me-2">
                  <i className="bi bi-quote fs-5"></i>
                </div>
                <div className="flex-grow-1">
                  <p className="quote-text mb-1">
                    {currentQuote.text}
                  </p>
                  <footer className="quote-author">
                    <cite>— {currentQuote.author}</cite>
                  </footer>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="col-md-4">
            <div className="text-md-end">
              <p className="mb-0 small text-muted">
                <i className="bi bi-c-circle me-1"></i>
                {new Date().getFullYear()} VIHDataCare.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;