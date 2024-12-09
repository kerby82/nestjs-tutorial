import { Controller, Delete, Get, Post, Patch } from '@nestjs/common';

@Controller('/events')
export class EventsController {
  @Get()
  findAll() {
    return 'This action returns all events';
  }

  @Get(':id')
  findOne(id: string) {
    return `This action returns a #${id} event`;
  }

  @Post()
  create() {
    return 'This action adds a new event';
  }

  @Patch(':id')
  update(id: string) {
    return `This action updates a #${id} event`;
  }

  @Delete(':id')
  remove(id: string) {
    return `This action removes a #${id} event`;
  }
}
