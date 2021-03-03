import { AccountModel } from '../models/account'
import { AddAccountParams } from '../usecases/add-account'

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
