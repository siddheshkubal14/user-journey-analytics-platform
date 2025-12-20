import { formattedResponse } from '../shared/utils/response.util';
import { logger } from '../shared/utils/logger.util';
import { ValidationUtil } from '../shared/utils/validation.util';

describe('Response Utility', () => {
    describe('formattedResponse', () => {
        it('should format data correctly', () => {
            const data = { test: 'value' };
            const result = formattedResponse(data);

            expect(result).toEqual({
                success: true,
                data,
                message: 'Success',
                statusCode: 200
            });
        });

        it('should handle null data', () => {
            const result = formattedResponse(null);

            expect(result).toEqual({
                success: true,
                data: null,
                message: 'Success',
                statusCode: 200
            });
        });

        it('should handle custom message', () => {
            const result = formattedResponse({ id: 1 }, 'Created successfully');

            expect(result).toEqual({
                success: true,
                data: { id: 1 },
                message: 'Created successfully',
                statusCode: 200
            });
        });
    });
});

describe('Validation Utility', () => {
    describe('validateString', () => {
        it('should accept valid non-empty strings', () => {
            expect(ValidationUtil.validateString('test', 'field')).toBe('test');
            expect(ValidationUtil.validateString('  value  ', 'name')).toBe('value');
        });

        it('should reject empty strings', () => {
            expect(() => ValidationUtil.validateString('', 'field')).toThrow('field cannot be empty');
        });

        it('should reject whitespace-only strings', () => {
            expect(() => ValidationUtil.validateString('   ', 'field')).toThrow('field cannot be empty');
        });

        it('should reject non-string values', () => {
            expect(() => ValidationUtil.validateString(123 as any, 'field')).toThrow('field must be a string');
            expect(() => ValidationUtil.validateString(null as any, 'field')).toThrow('field must be a string');
        });

        it('should enforce max length', () => {
            const longString = 'a'.repeat(600);
            expect(() => ValidationUtil.validateString(longString, 'field', 500)).toThrow('exceeds maximum length');
        });
    });

    describe('sanitizeString', () => {
        it('should trim whitespace', () => {
            expect(ValidationUtil.sanitizeString('  test  ')).toBe('test');
        });

        it('should remove dangerous characters', () => {
            expect(ValidationUtil.sanitizeString('<script>alert("xss")</script>hello')).toBe('scriptalert(xss)/scripthello');
        });

        it('should handle empty strings', () => {
            expect(ValidationUtil.sanitizeString('')).toBe('');
        });

        it('should enforce max length', () => {
            const longString = 'a'.repeat(600);
            const result = ValidationUtil.sanitizeString(longString);
            expect(result.length).toBe(500);
        });
    });

    describe('validateDateRange', () => {
        it('should accept valid date range', () => {
            const result = ValidationUtil.validateDateRange('2024-01-01', '2024-12-31');
            expect(result.start).toBeInstanceOf(Date);
            expect(result.end).toBeInstanceOf(Date);
        });

        it('should reject end date before start date', () => {
            expect(() => ValidationUtil.validateDateRange('2024-12-31', '2024-01-01'))
                .toThrow('startDate must be before endDate');
        });

        it('should accept same start and end date', () => {
            const result = ValidationUtil.validateDateRange('2024-06-15', '2024-06-15');
            expect(result.start).toBeInstanceOf(Date);
            expect(result.end).toBeInstanceOf(Date);
        });

        it('should reject invalid dates', () => {
            expect(() => ValidationUtil.validateDateRange('invalid', '2024-12-31'))
                .toThrow('not a valid date');
        });

        it('should reject missing dates', () => {
            expect(() => ValidationUtil.validateDateRange(null, '2024-12-31'))
                .toThrow('Both startDate and endDate are required');
        });
    });
});

describe('Logger Utility', () => {
    it('should have expected log methods', () => {
        expect(typeof logger.info).toBe('function');
        expect(typeof logger.error).toBe('function');
        expect(typeof logger.warn).toBe('function');
        expect(typeof logger.debug).toBe('function');
    });
});
