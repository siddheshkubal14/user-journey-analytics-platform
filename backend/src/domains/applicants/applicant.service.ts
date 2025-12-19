import { ApplicantRepository } from './applicant.repository';
import { IApplicant } from './applicant.entity';
import { CreateApplicantInput, FilterApplicantInput } from './applicant.schema';
import { Types } from 'mongoose';

export class ApplicantService {
    static async createApplicant(data: CreateApplicantInput): Promise<IApplicant> {
        const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();

        const validatedData: Partial<IApplicant> = {
            userId: new Types.ObjectId(data.userId),
            sessionId: data.sessionId ? new Types.ObjectId(data.sessionId) : undefined,
            actionType: data.actionType as any,
            status: data.status,
            timestamp,
        };

        return await ApplicantRepository.create(validatedData);
    }

    static async getAllApplicants(): Promise<IApplicant[]> {
        return await ApplicantRepository.findAll();
    }

    static async getApplicantById(id: string): Promise<IApplicant | null> {
        return await ApplicantRepository.findById(id);
    }

    static async getApplicantsByUserId(userId: string): Promise<IApplicant[]> {
        return await ApplicantRepository.findByUserId(userId);
    }

    static async filterApplicants(filters: {
        userId?: string;
        sessionId?: string;
        actionType?: string;
        status?: string;
        from?: Date;
        to?: Date;
    }): Promise<IApplicant[]> {
        const validatedFilters: any = {};

        if (filters.userId) validatedFilters.userId = filters.userId;
        if (filters.sessionId) validatedFilters.sessionId = filters.sessionId;
        if (filters.actionType) validatedFilters.actionType = filters.actionType;
        if (filters.status) validatedFilters.status = filters.status;
        if (filters.from && filters.to) {
            validatedFilters.from = filters.from;
            validatedFilters.to = filters.to;
        }

        return await ApplicantRepository.filter(validatedFilters);
    }
}
