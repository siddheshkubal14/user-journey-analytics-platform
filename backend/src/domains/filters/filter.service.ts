import { FilterQueryDTO } from "./filter.entity";
import { EventRepository } from "../events/event.repository";
import { ApplicantRepository } from "../applicants/applicant.repository";
import { SessionRepository } from "../sessions/session.repository";

export class FilterService {
    static async filterEvents(filters: FilterQueryDTO) {
        return await EventRepository.filter({
            userId: filters.userId,
            sessionId: filters.sessionId,
            eventType: filters.eventType,
            from: filters.from ? new Date(filters.from) : undefined,
            to: filters.to ? new Date(filters.to) : undefined,
        });
    }

    static async filterApplicants(filters: FilterQueryDTO) {
        return await ApplicantRepository.filter({
            userId: filters.userId,
            sessionId: filters.sessionId,
            actionType: filters.actionType,
            status: filters.status,
            from: filters.from ? new Date(filters.from) : undefined,
            to: filters.to ? new Date(filters.to) : undefined,
        });
    }

    static async filterSessions(filters: FilterQueryDTO) {
        return await SessionRepository.filter({
            userId: filters.userId,
            from: filters.from ? new Date(filters.from) : undefined,
            to: filters.to ? new Date(filters.to) : undefined,
        });
    }
}
