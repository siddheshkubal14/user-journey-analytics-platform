export class ValidationUtil {
    static sanitizeString(value: string): string {
        return value
            .trim()
            .replace(/[<>\"'`]/g, '')
            .substring(0, 500);
    }

    static validateDateRange(startDate: any, endDate: any): { start: Date; end: Date } {
        if (!startDate || !endDate) {
            throw new Error('Both startDate and endDate are required');
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime())) {
            throw new Error('startDate is not a valid date');
        }
        if (isNaN(end.getTime())) {
            throw new Error('endDate is not a valid date');
        }
        if (start > end) {
            throw new Error('startDate must be before endDate');
        }

        return { start, end };
    }

    static validateString(value: any, fieldName: string, maxLength: number = 500): string {
        if (typeof value !== 'string') {
            throw new Error(`${fieldName} must be a string`);
        }
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new Error(`${fieldName} cannot be empty`);
        }
        if (trimmed.length > maxLength) {
            throw new Error(`${fieldName} exceeds maximum length of ${maxLength}`);
        }
        return trimmed;
    }
}
