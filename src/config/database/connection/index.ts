import * as dotenv from 'dotenv';
import * as path from 'path';
import { join } from 'path';
import { ConnectionOptions, createConnections } from 'typeorm';

dotenv.config();

export const config: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        path.join(
            __dirname,
            '..',
            '..',
            '..',
            'modules/**/entities/*.entity{.ts,.js}',
        ),
    ],
    migrations: [path.join(__dirname, '.', 'migrations/*.ts')],
    cli: {
        migrationsDir: path.join(__dirname, '.', 'migrations/'),
    },
};

export function getDatabaseConfigConnection(): ConnectionOptions {
    return { ...config };
}

export async function getDatabaseConfigConnectionQA() {
    await createConnections([
        {
            type: 'sqlite',
            database: ':memory:',
            entities: [
                path.join(
                    __dirname,
                    '..',
                    '..',
                    '..',
                    'modules/**/entities/*.entity{.ts,.js}',
                ),
            ],
            dropSchema: true,
            migrationsRun: true,
            synchronize: true,
        },
    ]);
}

export async function connect() {
    await createConnections([getDatabaseConfigConnection()]);
}
