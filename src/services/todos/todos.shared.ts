// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Todos, TodosData, TodosPatch, TodosQuery, TodosService } from './todos.class'

export type { Todos, TodosData, TodosPatch, TodosQuery }

export type TodosClientService = Pick<TodosService<Params<TodosQuery>>, (typeof todosMethods)[number]>

export const todosPath = 'todos'

export const todosMethods: Array<keyof TodosService> = ['find', 'get', 'create', 'patch', 'remove']

export const todosClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(todosPath, connection.service(todosPath), {
    methods: todosMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [todosPath]: TodosClientService
  }
}
