import { InMemoryDepartmentsRepository } from '@test/repositories/in-memory-departments-repository'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { makeDepartment } from 'test/factories/make-department'
import { makeWorkstation } from 'test/factories/make-workstation'
import { InMemoryWorkstationsRepository } from 'test/repositories/in-memory-workstations-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchWorkstationsByDepartmentUseCase } from './fetch-workstations-by-department'

let departmentsRepository: InMemoryDepartmentsRepository
let usersRepository: InMemoryUsersRepository
let workstationsRepository: InMemoryWorkstationsRepository
let sut: FetchWorkstationsByDepartmentUseCase

describe('Fetch workstations by department', () => {
  beforeEach(() => {
    departmentsRepository = new InMemoryDepartmentsRepository(usersRepository)
    usersRepository = new InMemoryUsersRepository(departmentsRepository)
    workstationsRepository = new InMemoryWorkstationsRepository(departmentsRepository)
    sut = new FetchWorkstationsByDepartmentUseCase(workstationsRepository)
  })

  it('should be able to fetch workstations by department', async () => {
    const department = makeDepartment({}, new UniqueEntityID('department-id'))

    for (let i = 1; i <= 5; i++) {
      workstationsRepository.items.push(
        makeWorkstation({
          departmentId: department.id,
          tag: `workstation-${i}`,
        }),
      )
    }

    const result = await sut.execute({
      departmentId: department.id.toString(),
    })

    expect(result.hasSucceeded()).toBeTruthy()

    if (result.hasSucceeded()) {
      expect(result.result.workstations).toHaveLength(5)
      expect(workstationsRepository.items).toHaveLength(5)
    }
  })
})
