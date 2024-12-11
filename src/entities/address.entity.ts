import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  addressId: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone: string; // Số điện thoại

  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string; // Email

  @Column({ type: 'varchar', length: 255, nullable: false })
  recipientName: string; // Tên người nhận

  @Column({ type: 'varchar', length: 100, nullable: false })
  province: string; // Tỉnh

  @Column({ type: 'varchar', length: 100, nullable: false })
  district: string; // quận,huyện

  @Column({ type: 'varchar', length: 100, nullable: false })
  ward: string; // phường

  @Column({ type: 'varchar', length: 255, nullable: false })
  detailedAddress: string; // Địa chỉ chi tiết

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
