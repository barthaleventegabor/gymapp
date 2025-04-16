import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import fs from 'fs'
import router from './routes/api.js'
import { readJson } from '../tools/readjson.js'

const config = await readJson('config/default.json')

const app = express()

const PORT = config.app.port || 8000

const logfile = 'access.log'
var accessLogStream = fs.createWriteStream(logfile, { flags: 'a' })
app.use(morgan('dev', { stream: accessLogStream }))
app.use(cors())
app.use(express.json())
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})
