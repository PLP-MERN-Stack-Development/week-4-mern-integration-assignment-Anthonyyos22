import { useTheme } from '../context/ThemeContext';
import './Footer.css';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`footer ${theme}`}>
      <div className="container">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="copyright">
            &copy; {new Date().getFullYear()} MyApp. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;