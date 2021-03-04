export const signUpPath = {
  post: {
    tags: ['Login'],
    summary: 'User account creation API',
    requestBody: {
      description:
        'This path must receive a name, email, password and a password confirmation, of the user which is trying to create a new account.',
      content: { 'application/json': { schema: { $ref: '#/schemas/signup' } } }
    },
    responses: {
      200: {
        description: "Success. Already return the user's login token",
        content: { 'application/json': { schema: { $ref: '#schemas/account' } } }
      },
      400: { $ref: '#/components/badRequest' },
      403: { $ref: '#/components/forbidden' },
      404: { $ref: '#/components/notFound' },
      500: { $ref: '#/components/serverError' }
    }
  }
}
