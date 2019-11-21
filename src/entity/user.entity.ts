import { Column, Entity } from 'typeorm';

@Entity()
export class User {
  @Column({ primary: true, type: 'uuid' })
  public id: string;

  @Column({ unique: true })
  public email: string;

  @Column({ select: false })
  public password: string;

  @Column({ name: 'full_name' })
  public fullName: string;

  @Column({ default: 0, type: 'integer', select: false })
  public tokenVersion: number;

  constructor(email: string, password: string, fullName: string) {
    this.password = password;
    this.fullName = fullName;
    this.email = email;
  }
}
