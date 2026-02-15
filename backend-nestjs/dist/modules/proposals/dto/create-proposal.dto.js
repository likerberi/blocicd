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
exports.CreateProposalDto = exports.WorkType = void 0;
const class_validator_1 = require("class-validator");
var WorkType;
(function (WorkType) {
    WorkType["ONSITE"] = "ONSITE";
    WorkType["HYBRID"] = "HYBRID";
    WorkType["REMOTE"] = "REMOTE";
})(WorkType || (exports.WorkType = WorkType = {}));
class CreateProposalDto {
}
exports.CreateProposalDto = CreateProposalDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateProposalDto.prototype, "companyProfileId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateProposalDto.prototype, "jobSeekerProfileId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateProposalDto.prototype, "positionTitle", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProposalDto.prototype, "offerSalaryMin", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProposalDto.prototype, "offerSalaryMax", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(WorkType),
    __metadata("design:type", String)
], CreateProposalDto.prototype, "workType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateProposalDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateProposalDto.prototype, "expiresAt", void 0);
//# sourceMappingURL=create-proposal.dto.js.map