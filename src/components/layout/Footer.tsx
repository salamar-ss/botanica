import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <a className="footer__logo" href="/">
          botanica.
        </a>

        <p className="footer__description">
          Thoughtful beauty, inspired by nature.
        </p>

        <p className="footer__copyright">
          © {new Date().getFullYear()} Botanica. All rights reserved.
        </p>
      </div>
    </footer>
  );
}