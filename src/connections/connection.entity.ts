import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ConnectionType } from "./connection-type.enum";

@Entity()
export class Connection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userID: string;

  @Column()
  type: ConnectionType;
}
