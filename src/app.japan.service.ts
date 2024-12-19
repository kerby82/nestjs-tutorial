import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppJapanService {
  constructor(
    @Inject('APP_NAME')
    private readonly name: string,
    @Inject('MESSAGE')
    private readonly message: string,
  ) {
    console.log(name);
  }

  getHello(): string {
    console.log(process.env.DB_HOST);
    return `こんにちは、世界！from ${this.name} ${this.message}`;
  }
}
