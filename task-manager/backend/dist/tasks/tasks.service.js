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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("./schemas/task.schema");
let TasksService = class TasksService {
    taskModel;
    constructor(taskModel) {
        this.taskModel = taskModel;
    }
    async findAll(params) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.min(100, Math.max(1, params.limit ?? 10));
        const skip = (page - 1) * limit;
        const filter = {
            userId: new mongoose_2.Types.ObjectId(params.userId),
        };
        if (params.status)
            filter.status = params.status;
        if (params.search) {
            const regex = new RegExp(params.search, 'i');
            filter.$or = [{ title: regex }, { description: regex }];
        }
        const [items, total] = await Promise.all([
            this.taskModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.taskModel.countDocuments(filter).exec(),
        ]);
        return {
            items,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }
    async create(userId, dto) {
        const created = await this.taskModel.create({
            title: dto.title,
            description: dto.description ?? '',
            status: dto.status ?? task_schema_1.TaskStatus.TODO,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        return created;
    }
    async update(userId, taskId, dto) {
        const task = await this.taskModel.findById(taskId).exec();
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        if (task.userId.toString() !== userId)
            throw new common_1.ForbiddenException('Access denied');
        if (dto.title !== undefined)
            task.title = dto.title;
        if (dto.description !== undefined)
            task.description = dto.description;
        if (dto.status !== undefined)
            task.status = dto.status;
        if (dto.dueDate !== undefined)
            task.dueDate = dto.dueDate ? new Date(dto.dueDate) : undefined;
        await task.save();
        return task;
    }
    async remove(userId, taskId) {
        const task = await this.taskModel.findById(taskId).exec();
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        if (task.userId.toString() !== userId)
            throw new common_1.ForbiddenException('Access denied');
        await task.deleteOne();
        return { deleted: true };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TasksService);
//# sourceMappingURL=tasks.service.js.map