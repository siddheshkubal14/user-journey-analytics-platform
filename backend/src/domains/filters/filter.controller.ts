import { Request, Response } from "express";
import { filterQuerySchema } from "./filter.schema";
import { FilterService } from "./filter.service";
import { formattedResponse } from "../../shared/utils/response.util";

export class FilterController {
    static async events(req: Request, res: Response, next: Function) {
        try {
            const filters = filterQuerySchema.parse(req.query);
            const result = await FilterService.filterEvents(filters);
            return res.json(formattedResponse(result));
        } catch (err: any) {
            (err as any).statusCode = 400;
            return next(err);
        }
    }

    static async applicants(req: Request, res: Response, next: Function) {
        try {
            const filters = filterQuerySchema.parse(req.query);
            const result = await FilterService.filterApplicants(filters);
            return res.json(formattedResponse(result));
        } catch (err: any) {
            (err as any).statusCode = 400;
            return next(err);
        }
    }

    static async sessions(req: Request, res: Response, next: Function) {
        try {
            const filters = filterQuerySchema.parse(req.query);
            const result = await FilterService.filterSessions(filters);
            return res.json(formattedResponse(result));
        } catch (err: any) {
            (err as any).statusCode = 400;
            return next(err);
        }
    }
}
