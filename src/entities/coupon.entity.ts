import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('coupon')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  couponId: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  code: string; // Mã giảm giá (bắt buộc, unique)

  @Column({ type: 'float', nullable: false })
  discountPercent: number; // Tỷ lệ giảm giá (bắt buộc)

  @Column({ type: 'timestamp', nullable: true })
  expirationDate?: Date; // Ngày hết hạn (tùy chọn)

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  quantity: number; 

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
