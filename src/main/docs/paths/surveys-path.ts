export const surveysPath = {
  get: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Surveys'],
    summary: 'Surveys list API',
    responses: {
      200: {
        description: 'Success',
        content: { 'application/json': { schema: { $ref: '#schemas/surveys' } } }
      },
      403: { $ref: '#/components/forbidden' },
      404: { $ref: '#/components/notFound' },
      500: { $ref: '#/components/serverError' }
    }
  },
  post: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Surveys'],
    summary: 'Surveys creation API',
    requestBody: {
      content: { 'application/json': { schema: { $ref: '#/schemas/addSurvey' } } }
    },
    responses: {
      204: { description: 'Success' },
      403: { $ref: '#/components/forbidden' },
      404: { $ref: '#/components/notFound' },
      500: { $ref: '#/components/serverError' }
    }
  }
}
