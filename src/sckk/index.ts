import express from 'express'
import fs from 'node:fs'
import path from 'node:path'

export const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile(path.resolve('src/sckk/index.html'))
})
