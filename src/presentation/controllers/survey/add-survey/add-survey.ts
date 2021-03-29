import { AddSurvey } from '@domain/usecases/add-survey'
import { badRequest, noContent, serverError } from '@presentation/helpers/http/http'
import { Controller, HttpResponse, Validation } from '@presentation/interfaces'

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation, private readonly addSurvey: AddSurvey) {}

  async handle(request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)

      await this.addSurvey.add({
        date: new Date(),
        question: request.question,
        answers: request.answers
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AddSurveyController {
  interface Answer {
    image?: string
    answer: string
  }

  export interface Request {
    question: string
    answers: Answer[]
  }
}
