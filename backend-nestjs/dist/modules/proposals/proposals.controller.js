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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/auth/decorators/roles.decorator");
const proposal_status_enum_1 = require("../../common/enums/proposal-status.enum");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const create_proposal_dto_1 = require("./dto/create-proposal.dto");
const proposals_service_1 = require("./proposals.service");
let ProposalsController = class ProposalsController {
    constructor(proposalsService) {
        this.proposalsService = proposalsService;
    }
    async create(dto, user) {
        return await this.proposalsService.create(dto, user.sub);
    }
    async list(status) {
        return await this.proposalsService.list(status);
    }
    async accept(proposalId, user) {
        const proposal = await this.proposalsService.accept(proposalId, user.sub);
        return {
            proposal,
            policy: 'CHAT_ROOM_SHOULD_BE_CREATED',
        };
    }
    async reject(proposalId, user) {
        return await this.proposalsService.reject(proposalId, user.sub);
    }
};
exports.ProposalsController = ProposalsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPANY_USER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_proposal_dto_1.CreateProposalDto, Object]),
    __metadata("design:returntype", Promise)
], ProposalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.JOB_SEEKER, user_role_enum_1.UserRole.COMPANY_USER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProposalsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(':proposalId/accept'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.JOB_SEEKER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('proposalId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProposalsController.prototype, "accept", null);
__decorate([
    (0, common_1.Post)(':proposalId/reject'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.JOB_SEEKER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('proposalId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProposalsController.prototype, "reject", null);
exports.ProposalsController = ProposalsController = __decorate([
    (0, common_1.Controller)('proposals'),
    __metadata("design:paramtypes", [proposals_service_1.ProposalsService])
], ProposalsController);
//# sourceMappingURL=proposals.controller.js.map