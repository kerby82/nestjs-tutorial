import { Controller, Delete, Get, Post, Patch, Param } from '@nestjs/common';

@Controller('/events')
export class EventsController {
  @Get()
  findAll() {
    return 'This action returns all events';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} event`;
  }

  @Post()
  create() {
    return 'This action adds a new event';
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return `This action updates a #${id} event`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} event`;
  }
}
