import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './NotFoundPage.scss';

export default function NotFoundPage() {
  return (
    <div className="not-found-page-root">
      <div className="container">
        <div className="not-found-card">
          <span className="error-code">404 // Route Unresolved</span>
          <h1 className="not-found-title text-h1">Architectural Endpoint Not Found</h1>
          <p className="not-found-desc lead-paragraph">
            The requested pathway does not exist within the current routing topology. Verify your
            destination or return to the main MurtiHub systems portal.
          </p>

          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to Systems Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

