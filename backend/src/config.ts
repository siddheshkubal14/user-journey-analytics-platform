
import mongoConnector from './database/mongodb-connector';

interface AuthConfig {
    enable: boolean;
    username?: string;
    password?: string;
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

const loadConfig = (): Config => {
    const env = process.env.NODE_ENV || 'development';

    const baseConfig: Config = {
        port: Number(process.env.PORT) || 3000,
        auth: {
            enable: false,
            username: process.env.USER_NAME,
            password: process.env.PASSWORD,
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

    switch (env) {
        case 'production':
            return { ...baseConfig, port: Number(process.env.PORT) || 443 };
        case 'development':
            return baseConfig;
        default:
            return baseConfig;
    }
};

export default loadConfig;
