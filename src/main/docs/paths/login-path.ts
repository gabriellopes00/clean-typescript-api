export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'User authentication API route',
    requestBody: {
      description:
        'This path must receive an email and a password of the user which is trying to log in.',
      content: { 'application/json': { schema: { $ref: '#/schemas/login' } } }
    },
    responses: {
      200: {
        description: 'Success',
        content: { 'application/json': { schema: { $ref: '#schemas/account' } } }
      },
      400: { $ref: '#/components/badRequest' },
      401: { $ref: '#/components/unauthorized' },
      404: { $ref: '#/components/notFound' },
      500: { $ref: '#/components/serverError' }
    }
  }
}
