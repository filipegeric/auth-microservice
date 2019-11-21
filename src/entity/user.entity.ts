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

  @Column({
    name: 'is_google_user',
    select: false,
    default: false,
    type: 'boolean'
  })
  public isGoogleUser: boolean;

  constructor(
    email: string,
    password: string,
    fullName: string,
    isGoogleUser = false
  ) {
    this.password = password;
    this.fullName = fullName;
    this.email = email;
    this.isGoogleUser = isGoogleUser;
  }
}
