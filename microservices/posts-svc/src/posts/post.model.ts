import * as paginate from 'sequelize-cursor-pagination'
import { Column, Model, Table, DataType, Index } from 'sequelize-typescript'

@Table({
  modelName: 'post',
  tableName: 'posts'
})
export class Post extends Model<Post> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    comment: 'The identifier for the post record.'
  })
  id: string

  @Index('post_title')
  @Column({
    type: DataType.TEXT,
    comment: 'The post title or topic.',
    allowNull: false
  })
  title: string

  @Column({
    type: DataType.TEXT,
    comment: 'The post body or contents.'
  })
  body: string

  @Index('post_published')
  @Column({
    type: DataType.BOOLEAN,
    comment: 'Denotes if the post is published or not.'
  })
  published: boolean

  @Index('post_author')
  @Column({
    type: DataType.UUID,
    comment: 'Ref: User. The author of the post.'
  })
  author: string
}

paginate({
  methodName: 'findAndPaginate',
  primaryKeyField: 'id'
})(Post)
