import Applicant, { IApplicant } from './applicant.entity';

export class ApplicantRepository {
    static async create(data: Partial<IApplicant>): Promise<IApplicant> {
        const applicant = new Applicant(data);
        return await applicant.save();
    }

    static async findAll(): Promise<IApplicant[]> {
        return await Applicant.find({});
    }

    static async findById(id: string): Promise<IApplicant | null> {
        return await Applicant.findById(id);
    }

    static async findByUserId(userId: string): Promise<IApplicant[]> {
        return await Applicant.find({ userId });
    }

    static async filter(filters: {
        userId?: string;
        sessionId?: string;
        actionType?: string;
        status?: string;
        from?: Date;
        to?: Date;
    }): Promise<IApplicant[]> {
        const query: any = {};
        if (filters.userId) query.userId = filters.userId;
        if (filters.sessionId) query.sessionId = filters.sessionId;
        if (filters.actionType) query.actionType = filters.actionType;
        if (filters.status) query.status = filters.status;
        if (filters.from || filters.to) query.timestamp = {};
        if (filters.from) query.timestamp.$gte = filters.from;
        if (filters.to) query.timestamp.$lte = filters.to;

        return await Applicant.find(query);
    }
}
