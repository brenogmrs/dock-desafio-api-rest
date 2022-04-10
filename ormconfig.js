require('dotenv/config');

module.exports = [
    {
        name: 'default',
        type: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: ['src/modules/**/entities/*.entity{.ts,.js}'],
        migrations: [`src/config/database/migrations/*.ts`],
        cli: {
            migrationsDir: `src/config/database/migrations/`,
        },
    },
];
