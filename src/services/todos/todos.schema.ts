// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { TodosService } from './todos.class'

// Main data model schema
export const todosSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    createdBy: Type.Optional(ObjectIdSchema()),
    text: Type.String(),
    isCompleted: Type.Optional(Type.Boolean()),
    updatedAt: Type.Optional(Type.Number()),
    createdAt: Type.Optional(Type.Number())
  },
  { $id: 'Todos', additionalProperties: false }
)
export type Todos = Static<typeof todosSchema>
export const todosValidator = getValidator(todosSchema, dataValidator)
export const todosResolver = resolve<Todos, HookContext<TodosService>>({})

export const todosExternalResolver = resolve<Todos, HookContext<TodosService>>({})

// Schema for creating new entries
export const todosDataSchema = Type.Pick(todosSchema, ['text'], {
  $id: 'TodosData'
})
export type TodosData = Static<typeof todosDataSchema>
export const todosDataValidator = getValidator(todosDataSchema, dataValidator)
export const todosDataResolver = resolve<Todos, HookContext<TodosService>>({
  createdAt: async (value, data, context) => {
    return Date.now()
  },
  updatedAt: async (value, data, context) => {
    return Date.now()
  }
})

// Schema for updating existing entries
export const todosPatchSchema = Type.Partial(todosSchema, {
  $id: 'TodosPatch'
})
export type TodosPatch = Static<typeof todosPatchSchema>
export const todosPatchValidator = getValidator(todosPatchSchema, dataValidator)
export const todosPatchResolver = resolve<Todos, HookContext<TodosService>>({
  updatedAt: async (value, data, context) => {
    return Date.now()
  }
})

// Schema for allowed query properties
export const todosQueryProperties = Type.Pick(todosSchema, [
  '_id',
  'text',
  'createdAt',
  'updatedAt',
  'createdBy',
  'isCompleted'
])
export const todosQuerySchema = Type.Intersect(
  [
    querySyntax(todosQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type TodosQuery = Static<typeof todosQuerySchema>
export const todosQueryValidator = getValidator(todosQuerySchema, queryValidator)
export const todosQueryResolver = resolve<TodosQuery, HookContext<TodosService>>({})
