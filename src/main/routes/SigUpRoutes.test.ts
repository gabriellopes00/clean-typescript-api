import request from 'supertest'
import { app } from '../config/app'

describe('SigUp Routes', () => {
  test('Should an account on success', async () => {
    app.post('/api/signup', (req, res) => {
      res.send()
    })
    await request(app)
      .post('/api/signup')
      .send({
        name: 'gabriel',
        email: 'gabriel@example.com',
        password: 'gabriel123'
      })
      .expect(200)
  })
})
