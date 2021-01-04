import { hash } from 'bcrypt'
import { Encrypter } from '@data/interfaces/encrypter'

export class BcryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {}

  async encrypt(value: string): Promise<string> {
    const generatedHash = await hash(value, this.salt)
    return generatedHash
  }
}
