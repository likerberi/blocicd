"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./common/auth/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/auth/guards/roles.guard");
const prisma_service_1 = require("./common/db/prisma.service");
const auth_module_1 = require("./modules/auth/auth.module");
const chat_gateway_1 = require("./modules/chat/chat.gateway");
const hires_controller_1 = require("./modules/hires/hires.controller");
const proposals_controller_1 = require("./modules/proposals/proposals.controller");
const proposals_service_1 = require("./modules/proposals/proposals.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [proposals_controller_1.ProposalsController, hires_controller_1.HiresController],
        providers: [
            proposals_service_1.ProposalsService,
            chat_gateway_1.ChatGateway,
            prisma_service_1.PrismaService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map