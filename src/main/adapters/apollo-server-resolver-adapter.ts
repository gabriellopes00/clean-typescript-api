import { Controller } from '@presentation/interfaces'

export const adaptResolver = async (controller: Controller, args: any): Promise<any> => {
  const response = await controller.handle(args)
  return response.body
}
