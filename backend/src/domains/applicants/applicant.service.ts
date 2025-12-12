import { ApplicantRepository } from './applicant.repository';
import { IApplicant } from './applicant.entity';

export class ApplicantService {
    static async createApplicant(data: Partial<IApplicant>): Promise<IApplicant> {
        return await ApplicantRepository.create(data);
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
        return await ApplicantRepository.filter(filters);
    }
}
