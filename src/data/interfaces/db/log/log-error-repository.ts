export interface LogErrorRepository {
  logError(stackError: string): Promise<void>
}
