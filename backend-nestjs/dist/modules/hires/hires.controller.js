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
exports.HiresController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const proposals_service_1 = require("../proposals/proposals.service");
let HiresController = class HiresController {
    constructor(proposalsService) {
        this.proposalsService = proposalsService;
    }
    async finalize(proposalId, user) {
        const proposal = await this.proposalsService.finalizeHire(proposalId, user.sub);
        return {
            proposal,
            policy: 'UNMASK_CONTACT_AND_WRITE_PII_AUDIT_LOG',
        };
    }
};
exports.HiresController = HiresController;
__decorate([
    (0, common_1.Post)(':proposalId/finalize'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPANY_USER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('proposalId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], HiresController.prototype, "finalize", null);
exports.HiresController = HiresController = __decorate([
    (0, common_1.Controller)('hires'),
    __metadata("design:paramtypes", [proposals_service_1.ProposalsService])
], HiresController);
//# sourceMappingURL=hires.controller.js.map