import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';
import { ObjectType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@Entity()
@ObjectType()
@InputType('TeacherInput')
export class Teacher {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  name: string;

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @Field(() => [Subject], { nullable: true })
  subjects: Subject[];
}
