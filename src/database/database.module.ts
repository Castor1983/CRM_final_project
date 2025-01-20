import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'owu.linkpc.net/',
            port: 3306,
            username: 'castor',
            password: 'castor',
            database: 'castor',
            entities: [],
            synchronize: true,
        }),
    ],
})
export class DatabaseModule {}