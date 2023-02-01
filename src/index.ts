import express from 'express'
import cors from 'cors'
import { VideoController } from './controller/VideoController'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

const videoController = new VideoController()

app.get("/videos", videoController.getVideos)
app.post("/videos", videoController.createVideo)
app.put("/videos/:id", videoController.updateVideo)
app.delete("/videos/:id", videoController.deleteVideo)