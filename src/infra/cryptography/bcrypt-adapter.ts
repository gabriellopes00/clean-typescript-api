import { hash } from 'bcrypt'
import { Hasher } from '@data/interfaces/cryptography/hasher'

export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const generatedHash = await hash(value, this.salt)
    return generatedHash
  }
}
