import { InMemoryDepartmentsRepository } from '@test/repositories/in-memory-departments-repository'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchUsersByDepartmentUseCase } from './fetch-users-by-department'

let departmentsRepository: InMemoryDepartmentsRepository
let usersRepository: InMemoryUsersRepository
let sut: FetchUsersByDepartmentUseCase

describe('Fetch users by department', () => {
  beforeEach(() => {
    departmentsRepository = new InMemoryDepartmentsRepository(usersRepository)
    usersRepository = new InMemoryUsersRepository(departmentsRepository)
    sut = new FetchUsersByDepartmentUseCase(usersRepository)
  })

  it('should be able to fetch users by department', async () => {
    for (let i = 0; i < 2; i++) {
      usersRepository.items.push(makeUser())
    }

    for (let i = 0; i < 3; i++) {
      usersRepository.items.push(
        makeUser({
          departmentId: new UniqueEntityID('department-id'),
        }),
      )
    }

    const result = await sut.execute({
      departmentId: 'department-id',
    })

    expect(result.hasSucceeded()).toBeTruthy()

    if (result.hasSucceeded()) {
      expect(result.result.users).toHaveLength(3)
    }
  })
})
