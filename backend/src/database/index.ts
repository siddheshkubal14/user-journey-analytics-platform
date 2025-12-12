import mongoConnector from './mongodb-connector';

export default async (): Promise<{ types: string[]; connection: Record<string, any> }> => {
    const types: string[] = [];
    const connection: Record<string, any> = {};

    try {
        types.push('mongodb');
        connection.mongodb = await mongoConnector();
    } catch (err) {
        console.error('Failed to initialize database:', err);
    }

    return { types, connection };
};
