import { useEffect, useState } from "react";
import { getDashboardStats } from "../lib/api";
import type { DashboardStats } from "../lib/types";

export function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    void (async () => {
      setStats(await getDashboardStats());
    })();
  }, []);

  return (
    <section className="grid">
      <article className="card">
        <h2>Admin Dashboard</h2>
        {!stats ? (
          <p>Loading KPI...</p>
        ) : (
          <div className="kpi-grid">
            <div className="kpi">
              <span>Total Users</span>
              <strong>{stats.users}</strong>
            </div>
            <div className="kpi">
              <span>Total Proposals</span>
              <strong>{stats.proposals}</strong>
            </div>
            <div className="kpi">
              <span>Acceptance Rate</span>
              <strong>{stats.acceptedRate}%</strong>
            </div>
            <div className="kpi">
              <span>Hire Rate</span>
              <strong>{stats.hireRate}%</strong>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
