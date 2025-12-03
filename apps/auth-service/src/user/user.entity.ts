// apps/auth-service/src/user/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; // The unique identifier for the user

  @Column({ unique: true })
  email: string; // Used for login

  @Column()
  password_hash: string; // Stores the secure hash of the password

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}