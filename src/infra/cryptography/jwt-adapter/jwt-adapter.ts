import { Encrypter } from '@data/interfaces/cryptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const token = await jwt.sign({ id: value }, this.secret)
    return token
  }
}
