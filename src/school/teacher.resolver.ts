import { Resolver } from '@nestjs/graphql';
import { Teacher } from './teacher.entity';
import { Query, Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Resolver(() => Teacher)
export class TeacherResolver {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  @Query(() => [Teacher])
  public async teachers(): Promise<Teacher[]> {
    return await this.teacherRepository.find({
      relations: ['subjects'],
    });
  }

  @Query(() => Teacher)
  public async teacher(
    @Args('id', { type: () => Number })
    id: number,
  ): Promise<Teacher | undefined> {
    return await this.teacherRepository.findOneOrFail({
      where: { id },
      relations: ['subjects'],
    });
  }
}
