import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity('user_roles') // Tên bảng nếu cần đặt rõ ràng
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Role, (role) => role.userRoles, { eager: true })
  @JoinColumn({ name: 'role_id' }) // Tên cột trong database là `role_id`
  role: Role;

  @ManyToOne(() => User, (user) => user.userRoles, { eager: true })
  @JoinColumn({ name: 'user_id' }) // Tên cột trong database là `user_id`
  user: User;
}
