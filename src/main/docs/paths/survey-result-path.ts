export const surveyResultPath = {
  put: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Surveys'],
    summary: 'Surveys response creation API',
    requestBody: {
      content: { 'application/json': { schema: { $ref: '#/schemas/saveSurvey' } } }
    },
    parameters: [{ in: 'path', name: 'surveyId', required: true, schema: { type: 'string' } }],
    responses: {
      200: {
        description: 'Success',
        content: { 'application/json': { schema: { $ref: '#schemas/surveyResult' } } }
      },
      403: { $ref: '#/components/forbidden' },
      404: { $ref: '#/components/notFound' },
      500: { $ref: '#/components/serverError' }
    }
  }
}
