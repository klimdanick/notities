import express, { Request, Response } from 'express'

const app = express()
const port = 8080

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
