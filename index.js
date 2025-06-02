import express from 'express'
import fetch from 'node-fetch'

const app = express()
const PORT = 8888

app.get("/", (req, res) => {
    res.send("Dashboard")
})


app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`)
})