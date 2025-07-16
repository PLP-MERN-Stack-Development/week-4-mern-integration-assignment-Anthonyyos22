import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../context/ThemeContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`layout ${theme}`}>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;