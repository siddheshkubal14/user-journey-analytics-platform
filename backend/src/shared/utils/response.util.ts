export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    statusCode: number;
}

export const formattedResponse = <T>(data: T, message: string = 'Success'): ApiResponse<T> => {
    return {
        success: true,
        data,
        message,
        statusCode: 200
    };
};
