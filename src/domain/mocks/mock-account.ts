import { AccountModel } from '@domain/models/account'
import { AddAccountParams } from '@domain/usecases/add-account'
import { HttpRequest } from '@presentation/interfaces'

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

export const fakeHttpRequest: HttpRequest<AddAccountParams> = {
  body: { ...fakeAccountParams }
}
