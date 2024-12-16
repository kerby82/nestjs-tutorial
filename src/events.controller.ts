import {
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';

@Controller('/events')
export class EventsController {
  @Get()
  findAll() {
    return [
      { id: 1, name: 'First Event' },
      { id: 2, name: 'Second Event' },
    ];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id: 1, name: 'First Event' };
  }

  @Post()
  create(@Body() input) {
    return input;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: any) {
    return input;
  }

  @Delete(':id')
  @HttpCode(204)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remove(@Param('id') id: string, @Body() input: any) {}
}
