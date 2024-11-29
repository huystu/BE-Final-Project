import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from './userRole.entity';


@Entity('roles') // Tên bảng nếu bạn muốn map cụ thể
export class Role {
  @PrimaryGeneratedColumn('uuid') // Tự động sinh ID kiểu UUID
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
