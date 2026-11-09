import logoImg from "../../assets/logo.jpeg";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <img src={logoImg} alt="Mambrú" className="footer-logo" />
          <h3>Mambrú</h3>
        </div>
        <p className="slogan">Café, Memoria, Territorio, Alma.</p>
        <p className="copyright">&copy; 2026 Mambrú. Creado con pasión.</p>
      </div>
    </footer>
  );
}