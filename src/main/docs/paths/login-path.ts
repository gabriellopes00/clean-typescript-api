export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'User authentication API route',
    requestBody: {
      description:
        'This path must receive an email and a password of the user which is trying to log in.',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/login'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: { 'application/json': { schema: { $ref: '#schemas/account' } } }
      },
      400: {
        description: 'Bad Request - Route not found'
      }
    }
  }
}
