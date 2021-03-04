export const addSurveySchema = {
  type: 'object',
  properties: {
    question: { type: 'string' },
    answer: { type: 'array', items: { $ref: '#/schemas/surveyAnswer' } }
  }
}
