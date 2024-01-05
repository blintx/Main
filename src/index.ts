import express from 'express'
import * as sckk from './sckk/index.js'
import path from 'node:path'
import bodyParser from 'body-parser'

const port = 3000

const app = express()

app.use(express.json())

app.use(bodyParser.json({ limit: '10mb' }))

app.use(express.static('public'))

app.use('/sckk', sckk.router)

app.get('/', (req, res) => {
    res.sendFile(path.resolve('src/index.html'))
})

app.use((req, res, next) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.resolve('src/404.html'))
    }
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})
