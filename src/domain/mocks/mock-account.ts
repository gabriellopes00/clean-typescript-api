import { AccountModel } from '@domain/models/account'
import { AddAccountParams } from '@domain/usecases/add-account'

export const fakeAccountModel: AccountModel = {
  id: 'any_id',
  name: 'any_name',
  email: 'any@mail.com',
  password: 'any_password'
}

export const fakeAccountParams: AddAccountParams = {
  name: 'any_name',
  email: 'any@mail.com',
  password: 'any_password'
}

export const fakeLoginParams: Pick<AddAccountParams, 'email' | 'password'> = {
  email: 'any@mail.com',
  password: 'any_password'
}
