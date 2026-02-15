import { JwtUser } from '../../common/auth/strategies/jwt.strategy';
import { ProposalStatus } from '../../common/enums/proposal-status.enum';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ProposalsService } from './proposals.service';
export declare class ProposalsController {
    private readonly proposalsService;
    constructor(proposalsService: ProposalsService);
    create(dto: CreateProposalDto, user: JwtUser): Promise<{
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
    }>;
    list(status?: ProposalStatus): Promise<{
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
    }[]>;
    accept(proposalId: number, user: JwtUser): Promise<{
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
    reject(proposalId: number, user: JwtUser): Promise<{
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
    }>;
}
