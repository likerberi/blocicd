import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <section className="grid hero">
      <article className="card splash">
        <h1>Direct Proposal Hiring Platform</h1>
        <p>
          Anonymous profiles first, chat after acceptance, contact reveal only at final hire.
        </p>
        <div className="actions">
          <Link to="/jobseeker" className="btn primary">
            Job Seeker Console
          </Link>
          <Link to="/company" className="btn">
            Company Console
          </Link>
          <Link to="/admin" className="btn ghost">
            Admin Console
          </Link>
        </div>
      </article>
    </section>
  );
}
