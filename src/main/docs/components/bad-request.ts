export const badRequest = {
  description: 'Invalid Request',
  content: { 'application/json': { schema: { $ref: '#schemas/error' } } }
}
