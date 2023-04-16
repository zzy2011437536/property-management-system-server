import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const typeormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'wawj521333',
  database: 'property_real_estate',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  logging: true,
};
