import { Resolver } from '@nestjs/graphql';
import { Teacher } from './teacher.entity';
import { Query, Args, Mutation } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherAddInput } from './input/teacher-add.input';

@Resolver(() => Teacher)
export class TeacherResolver {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  @Query(() => [Teacher])
  public async teachers(): Promise<Teacher[]> {
    return await this.teacherRepository.find();
  }

  @Query(() => Teacher)
  public async teacher(
    @Args('id', { type: () => Number })
    id: number,
  ): Promise<Teacher | undefined> {
    return await this.teacherRepository.findOneOrFail({
      where: { id },
    });
  }

  @Mutation(() => Teacher, { name: 'addTeacher' })
  public async add(
    @Args('input', { type: () => TeacherAddInput })
    input: TeacherAddInput,
  ): Promise<Teacher> {
    return await this.teacherRepository.save(new Teacher(input));
  }
}
