import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "PTITptit2021@",
    database: "task-management-nestjs",
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
    migrationsTableName: "migrations",
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;