import { hash, compare } from 'bcrypt'
import { Hasher } from '@data/interfaces/cryptography/hasher'
import { HashComparer } from '@data/interfaces/cryptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const generatedHash = await hash(value, this.salt)
    return generatedHash
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await compare(value, hash)
    return isValid
  }
}
