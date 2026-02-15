import { JwtUser } from '../../common/auth/strategies/jwt.strategy';
import { ProposalsService } from '../proposals/proposals.service';
export declare class HiresController {
    private readonly proposalsService;
    constructor(proposalsService: ProposalsService);
    finalize(proposalId: number, user: JwtUser): Promise<{
        proposal: {
            id: number;
            companyProfileId: number;
            jobSeekerProfileId: number;
            positionTitle: string;
            offerSalaryMin: number;
            offerSalaryMax: number;
            workType: string | null;
            message: string;
            status: import(".prisma/client").$Enums.ProposalStatus;
            expiresAt: string;
            createdAt: string;
            acceptedAt: string | null;
            rejectedAt: string | null;
            finalizedAt: string | null;
        };
        policy: string;
    }>;
}
