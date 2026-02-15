"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../common/db/prisma.service");
let ProposalsService = class ProposalsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorUserId) {
        if (dto.offerSalaryMin > dto.offerSalaryMax) {
            throw new common_1.BadRequestException('offerSalaryMin must be <= offerSalaryMax');
        }
        const proposal = await this.prisma.$transaction(async (tx) => {
            const created = await tx.proposal.create({
                data: {
                    companyProfileId: BigInt(dto.companyProfileId),
                    jobSeekerProfileId: BigInt(dto.jobSeekerProfileId),
                    positionTitle: dto.positionTitle,
                    offerSalaryMin: dto.offerSalaryMin,
                    offerSalaryMax: dto.offerSalaryMax,
                    workType: dto.workType,
                    message: dto.message,
                    status: client_1.ProposalStatus.PENDING,
                    expiresAt: new Date(dto.expiresAt),
                },
            });
            await tx.proposalStatusLog.create({
                data: {
                    proposalId: created.id,
                    fromStatus: null,
                    toStatus: client_1.ProposalStatus.PENDING,
                    actorUserId: BigInt(actorUserId),
                },
            });
            return created;
        });
        return this.toView(proposal);
    }
    async list(status) {
        const validStatus = status && Object.values(client_1.ProposalStatus).includes(status)
            ? status
            : undefined;
        const proposals = await this.prisma.proposal.findMany({
            where: validStatus ? { status: validStatus } : undefined,
            orderBy: { createdAt: 'desc' },
        });
        return proposals.map((proposal) => this.toView(proposal));
    }
    async accept(proposalId, actorUserId) {
        const proposal = await this.findById(proposalId);
        if (proposal.status !== client_1.ProposalStatus.PENDING) {
            throw new common_1.BadRequestException('Only PENDING proposal can be accepted');
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            const result = await tx.proposal.update({
                where: { id: proposal.id },
                data: {
                    status: client_1.ProposalStatus.ACCEPTED,
                    acceptedAt: new Date(),
                },
            });
            await tx.proposalStatusLog.create({
                data: {
                    proposalId: proposal.id,
                    fromStatus: proposal.status,
                    toStatus: client_1.ProposalStatus.ACCEPTED,
                    actorUserId: BigInt(actorUserId),
                },
            });
            return result;
        });
        return this.toView(updated);
    }
    async reject(proposalId, actorUserId) {
        const proposal = await this.findById(proposalId);
        if (proposal.status !== client_1.ProposalStatus.PENDING) {
            throw new common_1.BadRequestException('Only PENDING proposal can be rejected');
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            const result = await tx.proposal.update({
                where: { id: proposal.id },
                data: {
                    status: client_1.ProposalStatus.REJECTED,
                    rejectedAt: new Date(),
                },
            });
            await tx.proposalStatusLog.create({
                data: {
                    proposalId: proposal.id,
                    fromStatus: proposal.status,
                    toStatus: client_1.ProposalStatus.REJECTED,
                    actorUserId: BigInt(actorUserId),
                },
            });
            return result;
        });
        return this.toView(updated);
    }
    async markChatting(proposalId, actorUserId) {
        const proposal = await this.findById(proposalId);
        if (proposal.status !== client_1.ProposalStatus.ACCEPTED) {
            throw new common_1.BadRequestException('Only ACCEPTED proposal can move to CHATTING');
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            const result = await tx.proposal.update({
                where: { id: proposal.id },
                data: { status: client_1.ProposalStatus.CHATTING },
            });
            if (actorUserId) {
                await tx.proposalStatusLog.create({
                    data: {
                        proposalId: proposal.id,
                        fromStatus: proposal.status,
                        toStatus: client_1.ProposalStatus.CHATTING,
                        actorUserId: BigInt(actorUserId),
                    },
                });
            }
            return result;
        });
        return this.toView(updated);
    }
    async finalizeHire(proposalId, actorUserId) {
        const proposal = await this.findByIdWithJobSeeker(proposalId);
        if (proposal.status !== client_1.ProposalStatus.CHATTING) {
            throw new common_1.BadRequestException('Only CHATTING proposal can be finalized');
        }
        const targetUserId = proposal.jobSeekerProfile?.userId;
        if (!targetUserId) {
            throw new common_1.NotFoundException('Job seeker user not found for proposal');
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            const result = await tx.proposal.update({
                where: { id: proposal.id },
                data: {
                    status: client_1.ProposalStatus.FINAL_HIRED,
                    finalizedAt: new Date(),
                },
            });
            await tx.proposalStatusLog.create({
                data: {
                    proposalId: proposal.id,
                    fromStatus: proposal.status,
                    toStatus: client_1.ProposalStatus.FINAL_HIRED,
                    actorUserId: BigInt(actorUserId),
                },
            });
            await tx.piiAccessLog.create({
                data: {
                    actorUserId: BigInt(actorUserId),
                    targetUserId: targetUserId,
                    eventType: 'UNMASK_PROFILE',
                    proposalId: proposal.id,
                },
            });
            return result;
        });
        return this.toView(updated);
    }
    async findById(proposalId) {
        const proposal = await this.prisma.proposal.findUnique({
            where: { id: BigInt(proposalId) },
        });
        if (!proposal)
            throw new common_1.NotFoundException('Proposal not found');
        return proposal;
    }
    async findByIdWithJobSeeker(proposalId) {
        const proposal = await this.prisma.proposal.findUnique({
            where: { id: BigInt(proposalId) },
            include: { jobSeekerProfile: { select: { userId: true } } },
        });
        if (!proposal)
            throw new common_1.NotFoundException('Proposal not found');
        return proposal;
    }
    toView(proposal) {
        return {
            id: Number(proposal.id),
            companyProfileId: Number(proposal.companyProfileId),
            jobSeekerProfileId: Number(proposal.jobSeekerProfileId),
            positionTitle: proposal.positionTitle,
            offerSalaryMin: proposal.offerSalaryMin,
            offerSalaryMax: proposal.offerSalaryMax,
            workType: proposal.workType,
            message: proposal.message,
            status: proposal.status,
            expiresAt: proposal.expiresAt.toISOString(),
            createdAt: proposal.createdAt.toISOString(),
            acceptedAt: proposal.acceptedAt ? proposal.acceptedAt.toISOString() : null,
            rejectedAt: proposal.rejectedAt ? proposal.rejectedAt.toISOString() : null,
            finalizedAt: proposal.finalizedAt ? proposal.finalizedAt.toISOString() : null,
        };
    }
};
exports.ProposalsService = ProposalsService;
exports.ProposalsService = ProposalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProposalsService);
//# sourceMappingURL=proposals.service.js.map