import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  age: number;
}
