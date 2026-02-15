export declare enum WorkType {
    ONSITE = "ONSITE",
    HYBRID = "HYBRID",
    REMOTE = "REMOTE"
}
export declare class CreateProposalDto {
    companyProfileId: number;
    jobSeekerProfileId: number;
    positionTitle: string;
    offerSalaryMin: number;
    offerSalaryMax: number;
    workType: WorkType;
    message: string;
    expiresAt: string;
}
