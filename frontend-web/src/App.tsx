import { Link, Navigate, Route, Routes } from "react-router-dom";
import { AdminPage } from "./pages/AdminPage";
import { CompanyPage } from "./pages/CompanyPage";
import { JobSeekerPage } from "./pages/JobSeekerPage";
import { LandingPage } from "./pages/LandingPage";

function Header() {
  return (
    <header className="topbar">
      <div className="brand">PROPOSAL GRID</div>
      <nav className="menu">
        <Link to="/">Home</Link>
        <Link to="/jobseeker">Job Seeker</Link>
        <Link to="/company">Company</Link>
        <Link to="/admin">Admin</Link>
      </nav>
    </header>
  );
}

export function App() {
  return (
    <div className="shell">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobseeker" element={<JobSeekerPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
