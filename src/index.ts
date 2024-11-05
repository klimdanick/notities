import express, { Request, Response } from 'express'
import notesRoutes from './routes/notesRoutes'
import bodyParser from 'body-parser'
import { purgeDb } from './database'
import cors from 'cors'

const app = express()
const port = 8080

app.use(cors());
app.post('*', bodyParser.json())
app.delete('*', bodyParser.json())
app.use('/api', notesRoutes)

// Make sure all file names in db are accesable in the filesystem
purgeDb()


app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
