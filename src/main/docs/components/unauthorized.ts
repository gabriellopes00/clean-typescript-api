export const unauthorized = {
  description: 'Invalid Credentials',
  content: { 'application/json': { schema: { $ref: '#schemas/error' } } }
}
