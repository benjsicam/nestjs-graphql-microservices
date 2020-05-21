import * as paginate from 'sequelize-cursor-pagination'
import { Column, Model, Table, DataType, Index } from 'sequelize-typescript'

@Table({
  modelName: 'comment',
  tableName: 'comments'
})
export class Comment extends Model<Comment> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    comment: 'The identifier for the comment record.'
  })
  id: string

  @Column({
    type: DataType.TEXT,
    comment: 'The comment text.'
  })
  text: string

  @Index('comment_author')
  @Column({
    type: DataType.UUID,
    comment: 'Ref: User. The author of the comment.'
  })
  author: string

  @Index('comment_post')
  @Column({
    type: DataType.UUID,
    comment: 'Ref: Post. The post for which the comment is associated with.'
  })
  post: string
}

paginate({
  methodName: 'findAndPaginate',
  primaryKeyField: 'id'
})(Comment)
