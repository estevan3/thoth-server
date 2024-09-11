import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from "typeorm";
import User from "./user.js";

@Entity({ name: "posts" })
class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.posts)
  author: Relation<User>;

  @TreeChildren()
  comments: Post[];

  @TreeParent()
  post: Post;

  @ManyToMany(() => User)
  @JoinTable()
  likes: Relation<User[]>;
}

export default Post;
