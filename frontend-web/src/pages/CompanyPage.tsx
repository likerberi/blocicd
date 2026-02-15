import { FormEvent, useEffect, useState } from "react";
import { createProposal, searchTalents } from "../lib/api";
import type { Talent } from "../lib/types";

export function CompanyPage() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [target, setTarget] = useState<number | null>(null);
  const [positionTitle, setPositionTitle] = useState("Backend Engineer");
  const [message, setMessage] = useState("We want to invite you to our platform squad.");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void (async () => {
      const found = await searchTalents();
      setTalents(found);
      setTarget(found[0]?.profileId ?? null);
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!target) return;
    await createProposal({
      companyProfileId: 1,
      jobSeekerProfileId: target,
      positionTitle,
      offerSalaryMin: 7000,
      offerSalaryMax: 9300,
      workType: "HYBRID",
      message,
      expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="grid company">
      <article className="card">
        <h2>Talent Search (Anonymous)</h2>
        <div className="stack">
          {talents.map((t) => (
            <label className="proposal clickable" key={t.profileId}>
              <input
                type="radio"
                name="target"
                checked={target === t.profileId}
                onChange={() => setTarget(t.profileId)}
              />
              <div>
                <strong>
                  {t.jobCategory} / {t.yearsExperience}y
                </strong>
                <p className="meta">
                  {t.desiredSalaryMin}-{t.desiredSalaryMax} / {t.desiredLocations.join(", ")}
                </p>
              </div>
            </label>
          ))}
        </div>
      </article>

      <article className="card">
        <h2>Send Proposal</h2>
        <form onSubmit={onSubmit} className="stack">
          <label>
            Position
            <input value={positionTitle} onChange={(e) => setPositionTitle(e.target.value)} />
          </label>
          <label>
            Message
            <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <button className="btn primary" type="submit">
            Submit Proposal
          </button>
          {saved ? <p className="ok">Proposal submitted.</p> : null}
        </form>
      </article>
    </section>
  );
}
