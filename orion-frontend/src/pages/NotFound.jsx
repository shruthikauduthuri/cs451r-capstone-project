import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-icon" aria-hidden="true">
          ★
        </div>
        <h1 className="notfound-title">404</h1>
        <p className="notfound-message">
          This star hasn&apos;t been charted yet.
        </p>
        <p className="notfound-sub">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link to="/dashboard" className="notfound-button">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}