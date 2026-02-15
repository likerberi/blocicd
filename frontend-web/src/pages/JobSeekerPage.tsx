import { useEffect, useState } from "react";
import { acceptProposal, getProposals, rejectProposal } from "../lib/api";
import type { Proposal } from "../lib/types";

function badgeClass(status: string) {
  if (status === "PENDING") return "badge warning";
  if (status === "CHATTING" || status === "ACCEPTED") return "badge primary";
  if (status === "FINAL_HIRED") return "badge success";
  return "badge muted";
}

export function JobSeekerPage() {
  const [items, setItems] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setItems(await getProposals());
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onAccept(id: number) {
    await acceptProposal(id);
    await load();
  }

  async function onReject(id: number) {
    await rejectProposal(id);
    await load();
  }

  return (
    <section className="grid">
      <article className="card">
        <h2>Job Seeker Proposal Inbox</h2>
        <p className="sub">You can start chat only after accepting a proposal.</p>
        {loading ? <p>Loading...</p> : null}
        <div className="stack">
          {items.map((p) => (
            <div className="proposal" key={p.id}>
              <div className="proposal-head">
                <strong>{p.positionTitle}</strong>
                <span className={badgeClass(p.status)}>{p.status}</span>
              </div>
              <p>{p.message}</p>
              <p className="meta">
                Salary {p.offerSalaryMin} - {p.offerSalaryMax} / {p.workType}
              </p>
              <div className="actions">
                <button className="btn primary" onClick={() => onAccept(p.id)}>
                  Accept
                </button>
                <button className="btn" onClick={() => onReject(p.id)}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
