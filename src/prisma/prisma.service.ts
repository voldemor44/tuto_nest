import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
// import 'dotenv/config';
import { ConfigService } from '@nestjs/config';

// const connectionString = `${process.env.DATABASE_URL}`;

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    // const adapter = new PrismaPg({
    //   connectionString,
    // });

    const adapter = new PrismaPg({
      connectionString: config.get(
        'DATABASE_URL',
      ),
    });

    super({ adapter });
  }

  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
