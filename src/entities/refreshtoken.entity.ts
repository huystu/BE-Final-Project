/* eslint-disable prettier/prettier */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity('refresh_tokens')
  export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar' })
    token: string;
  
    @Column({ type: 'uuid' })
    userId: string;
  
    @Column({ type: 'timestamp' })
    expiresAt: Date;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: Date;
  
    @ManyToOne(() => User, user => user.refreshTokens)
    @JoinColumn({ name: 'userId' })
    user: User;
  }