import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Genre {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;
}
