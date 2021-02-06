import { Decrypter } from '@data/interfaces/cryptography/decrypter'
import { Encrypter } from '@data/interfaces/cryptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secret)
    return token
  }

  async decript(token: string): Promise<string> {
    const value: any = jwt.verify(token, this.secret)
    return value
  }
}
