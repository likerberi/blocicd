export type ProposalStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "CHATTING"
  | "FINAL_HIRED";

export type Proposal = {
  id: number;
  companyProfileId: number;
  jobSeekerProfileId: number;
  positionTitle: string;
  offerSalaryMin: number;
  offerSalaryMax: number;
  workType?: "ONSITE" | "HYBRID" | "REMOTE" | string | null;
  message: string;
  status: ProposalStatus;
  expiresAt: string;
};

export type DashboardStats = {
  users: number;
  proposals: number;
  acceptedRate: number;
  hireRate: number;
};

export type Talent = {
  profileId: number;
  jobCategory: string;
  yearsExperience: number;
  desiredSalaryMin: number;
  desiredSalaryMax: number;
  desiredLocations: string[];
};
