import express, { Request, Response } from 'express'
import notesRoutes from './routes/notesRoutes'
import database from 'database'

const app = express()
const port = 8081

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!')
})

app.use('/api', notesRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

database.createUser("klimdanick", "password")