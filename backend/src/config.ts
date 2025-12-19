
import mongoConnector from './database/mongodb-connector';
import { logger } from './shared/utils/logger.util';

interface AuthConfig {
    enable: boolean;
    apiKey?: string;
}

interface LoggerConfig {
    piiFields: string[];
}

interface DatabaseConfig {
    type: string;
    enable: boolean;
    connector: () => Promise<any>;
}

interface Config {
    port: number;
    auth: AuthConfig;
    logger: LoggerConfig;
    databases: DatabaseConfig[];
}

let cachedConfig: Config | null = null;

const loadConfig = (): Config => {
    if (cachedConfig) {
        return cachedConfig;
    }

    const env = process.env.NODE_ENV || 'development';

    const baseConfig: Config = {
        port: Number(process.env.PORT) || 3000,
        auth: {
            enable: true,
            apiKey: process.env.API_KEY,
        },
        logger: {
            piiFields: [],
        },
        databases: [
            {
                type: 'mongodb',
                enable: true,
                connector: mongoConnector,
            },
        ]
    };

    if (baseConfig.auth.enable && !baseConfig.auth.apiKey) {
        const msg = 'Configuration error: API_KEY is required when auth.enable is true';
        if (env === 'production') {
            logger.error(msg);
            throw new Error(msg);
        } else {
            logger.warn(msg + ' (continuing since not production)');
        }
    }

    switch (env) {
        case 'production':
            cachedConfig = { ...baseConfig, port: Number(process.env.PORT) || 443 };
            return cachedConfig;
        case 'development':
            cachedConfig = baseConfig;
            return cachedConfig;
        default:
            cachedConfig = baseConfig;
            return cachedConfig;
    }
};

export default loadConfig;
