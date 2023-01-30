import express, { Request, Response } from 'express'
import cors from 'cors'
// import { TAccountDB, TAccountDBPost, TUserDB, TUserDBPost } from './types'
import { db } from './database/knex'
// import { User } from './models/User'
import { create } from 'domain'
import { Video } from './models/video'
import { TVideos } from './types'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/videos", async (req: Request, res: Response) => {
  try {
    const serchTerm = req.query.q
    let videosDB

    if(serchTerm) {
      const result = await db('videos').where("title", "LIKE", `%${serchTerm}%`)
      videosDB = result
    }else{
      const result = await db('videos')
      videosDB = result
    }

    const videos = videosDB.map((videoDB) => new Video(
      videoDB.id,
      videoDB.title,
      videoDB.duration,
      videoDB.upload_at,
    ))

    res.status(200).send(videos)

  } catch (error) {
      console.log(error)

      if (req.statusCode === 200) {
          res.status(500)
      }

      if (error instanceof Error) {
          res.send(error.message)
      } else {
          res.send("Erro inesperado")
      }
  }
})

app.post("/videos", async (req: Request, res: Response) => {
  try {
      const {id, title, duration} = req.body //dado cru

      if (typeof id !== "string") {
          res.status(400)
          throw new Error("'id' deve ser string")
      }

      if (typeof title !== "string") {
          res.status(400)
          throw new Error("'title' deve ser string")
      }

      if (typeof duration !== "number") {
          res.status(400)
          throw new Error("'duration' deve ser string")
      }

      const [ videoDBExists ]: TVideos[] | undefined[] = await db("videos").where({ id })

      if (videoDBExists) {
          res.status(400)
          throw new Error("'id' já existe")
      }

      const newVideo = new Video(
          id,
          title,
          duration,
          new Date().toISOString()
      )

      //objeto para modelar as informações para o banco de dados
      const newVideoDB = {
          id: newVideo.getId(),
          title: newVideo.getTitle(),
          duration: newVideo.getDuration(),
          upload_at: newVideo.getUploadAt()
      }

      await db("videos").insert(newVideoDB)
      const [ videoDB ]: TVideos[] = await db("videos").where({ id })
      res.status(201).send(videoDB)

  } catch (error) {
      console.log(error)

      if (req.statusCode === 200) {
          res.status(500)
      }

      if (error instanceof Error) {
          res.send(error.message)
      } else {
          res.send("Erro inesperado")
      }
  }
})

app.put("/videos/:id", async (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id

    if(idToEdit === undefined){
      res.status(400)
      throw new Error("Informe um id")
    }

    const {newId, newTitle, newDuration} = req.body //dado cru

    if(newId !== undefined){
      if (typeof newId !== "string") {
          res.status(400)
          throw new Error("'id' deve ser string")
      }
    }

    if(newTitle !== undefined){
      if (typeof newTitle !== "string") {
          res.status(400)
          throw new Error("'title' deve ser string")
      }
    }

    if(newDuration !== undefined){
      if (typeof newDuration !== "number") {
          res.status(400)
          throw new Error("'duration' deve ser string")
      }
    }

      const [ videoDBExists ]: TVideos[] = await db("videos").where({ id: newId })
      // console.log(videoDBExists)

      if (videoDBExists) {
          res.status(400)
          throw new Error("'id' já existe")
      }

      const newVideo = new Video(
        newId,
        newTitle,
        newDuration,
        new Date().toISOString()
      )

      const [ foundVideo ]: TVideos[] = await db("videos").where({ id: idToEdit })

      const newVideoDB = {
          id: newVideo.getId() || foundVideo.id,
          title: newVideo.getTitle() || foundVideo.title,
          duration: newVideo.getDuration() || foundVideo.duration,
          upload_at: newVideo.getUploadAt()
      }

      await db("videos").update(newVideoDB).where({id: idToEdit})

      res.status(201).send({
        message: "Video editado com sucesso",
      })

  } catch (error) {
      console.log(error)

      if (req.statusCode === 200) {
          res.status(500)
      }

      if (error instanceof Error) {
          res.send(error.message)
      } else {
          res.send("Erro inesperado")
      }
  }
})

app.delete("/videos/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id

    if(idToDelete === ":id"){
      res.status(400)
      throw new Error("Informe um id")
    }

    const [ videoDBExists ]: TVideos[] = await db("videos").where({ id: idToDelete })

    if (!videoDBExists) {
        res.status(400)
        throw new Error("'id' não existe")
    }

    await db("videos").del().where({id: idToDelete})

    res.status(201).send({
      message: "Video deletado com sucesso",
    })

  } catch (error) {
      console.log(error)

      if (req.statusCode === 200) {
          res.status(500)
      }

      if (error instanceof Error) {
          res.send(error.message)
      } else {
          res.send("Erro inesperado")
      }
  }
})