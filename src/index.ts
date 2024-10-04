import express, { Request, Response } from 'express'
import notesRoutes from './routes/notesRoutes'
import { addUserToNote, createUser } from './database'

const app = express()
const port = 8081

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!')
})

app.use('/api', notesRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

createUser("klimdanick", "password")
addUserToNote("klimdanick", "TEEEEEEST")