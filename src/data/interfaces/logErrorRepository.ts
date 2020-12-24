export interface LogErrorRepository {
  log(stackError: string): Promise<void>
}
