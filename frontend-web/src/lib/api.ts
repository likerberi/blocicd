import type { DashboardStats, Proposal, ProposalStatus, Talent } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const mockProposals: Proposal[] = [
  {
    id: 101,
    companyProfileId: 1,
    jobSeekerProfileId: 77,
    positionTitle: "Backend Engineer (NestJS)",
    offerSalaryMin: 6800,
    offerSalaryMax: 9000,
    workType: "HYBRID",
    message: "You match our infra migration project.",
    status: "PENDING",
    expiresAt: new Date(Date.now() + 6 * 86400000).toISOString(),
  },
  {
    id: 102,
    companyProfileId: 3,
    jobSeekerProfileId: 77,
    positionTitle: "Platform Developer",
    offerSalaryMin: 7500,
    offerSalaryMax: 9800,
    workType: "REMOTE",
    message: "Join our core product team.",
    status: "CHATTING",
    expiresAt: new Date(Date.now() + 11 * 86400000).toISOString(),
  },
];

const mockTalents: Talent[] = [
  {
    profileId: 77,
    jobCategory: "Backend",
    yearsExperience: 6,
    desiredSalaryMin: 7000,
    desiredSalaryMax: 9000,
    desiredLocations: ["Seoul", "Remote"],
  },
  {
    profileId: 89,
    jobCategory: "Mobile",
    yearsExperience: 4,
    desiredSalaryMin: 5500,
    desiredSalaryMax: 7000,
    desiredLocations: ["Busan", "Remote"],
  },
];

const mockStats: DashboardStats = {
  users: 1284,
  proposals: 842,
  acceptedRate: 42.1,
  hireRate: 14.3,
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return (await res.json()) as T;
}

export async function getProposals(status?: ProposalStatus): Promise<Proposal[]> {
  try {
    const q = status ? `?status=${status}` : "";
    return await request<Proposal[]>(`/proposals${q}`);
  } catch {
    return status ? mockProposals.filter((p) => p.status === status) : mockProposals;
  }
}

export async function acceptProposal(id: number): Promise<void> {
  try {
    await request(`/proposals/${id}/accept`, { method: "POST" });
  } catch {
    return;
  }
}

export async function rejectProposal(id: number): Promise<void> {
  try {
    await request(`/proposals/${id}/reject`, { method: "POST" });
  } catch {
    return;
  }
}

export async function createProposal(input: {
  companyProfileId: number;
  jobSeekerProfileId: number;
  positionTitle: string;
  offerSalaryMin: number;
  offerSalaryMax: number;
  workType: "ONSITE" | "HYBRID" | "REMOTE";
  message: string;
  expiresAt: string;
}): Promise<void> {
  try {
    await request("/proposals", {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch {
    return;
  }
}

export async function searchTalents(): Promise<Talent[]> {
  try {
    return await request<Talent[]>("/talents/search");
  } catch {
    return mockTalents;
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    return await request<DashboardStats>("/admin/dashboard");
  } catch {
    return mockStats;
  }
}
