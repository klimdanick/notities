import express, { Request, Response } from 'express'
import notesRoutes from './routes/notesRoutes'
import bodyParser from 'body-parser'

const app = express()
const port = 8080

app.use(bodyParser.json())
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!')
})

app.use('/api', notesRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
