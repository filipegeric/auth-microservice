import { Column, Entity } from 'typeorm';

@Entity()
export class User {
  @Column({ unique: true, primary: true })
  public username: string;

  @Column({ select: false })
  public password: string;

  @Column({ unique: true })
  public email: string;

  @Column({ name: 'full_name' })
  public fullName: string;

  @Column({ default: 0, type: 'integer', select: false })
  public tokenVersion: number;

  constructor(
    username: string,
    password: string,
    email: string,
    fullName: string
  ) {
    this.username = username;
    this.password = password;
    this.fullName = fullName;
    this.email = email;
  }
}
