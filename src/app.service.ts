import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    @Inject('APP_NAME')
    private readonly name: string,
  ) {
    console.log(name);
  }

  getHello(): string {
    return `Hello World! from ${this.name}`;
  }
}
