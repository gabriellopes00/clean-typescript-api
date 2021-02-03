export interface Decrypter {
  decript(value: string): Promise<string>
}
