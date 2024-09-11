import { hash } from "bcrypt";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import Post from "./post.js";

@Entity({ name: "users" })
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", unique: true })
  nick: string;

  @Column({ type: "varchar" })
  name: string;

  @Column("date")
  birthdate: Date;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column("varchar")
  password: string;

  @Column({ type: "boolean", update: false, default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  create_at: Date;

  @BeforeInsert()
  async insertPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => Post, (post) => post.author)
  posts: Relation<Post[]>;
}

export default User;
