import { join } from 'path'
import { GraphQLDefinitionsFactory } from '@nestjs/graphql'

const definitionsFactory = new GraphQLDefinitionsFactory()

definitionsFactory.generate({
  typePaths: ['./**/*.schema.graphql'],
  path: join(__dirname, 'typings.ts'),
  watch: true
})
