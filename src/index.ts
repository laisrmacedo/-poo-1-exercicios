import express, { Request, Response } from 'express'
import cors from 'cors'
import { create } from 'domain'
import { Video } from './models/video'
import { TVideos } from './types'
import { VideoDatabase } from './database/VideoDatabase'
// import { TAccountDB, TAccountDBPost, TUserDB, TUserDBPost } from './types'
// import { db } from './database/BaseDatabase'
// import { User } from './models/User'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/videos", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string | undefined

    const videoDataBase = new VideoDatabase()
    const videosDB = await videoDataBase.findVideos(q)

    const videos: Video[] = videosDB.map((videoDB) => new Video(
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

      // const [ videoDBExists ]: TVideos[] | undefined[] = await db("videos").where({ id })

      const videoDataBase = new VideoDatabase()
      const videoDBExists = await videoDataBase.findVideoById(id)

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

      // await db("videos").insert(newVideoDB)

      await videoDataBase.insertVideo(newVideoDB)

      res.status(201).send({
        message: "Video criado com sucesso"
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

// app.put("/videos/:id", async (req: Request, res: Response) => {
//   try {
//     const idToEdit = req.params.id

//     if(idToEdit === ":id"){
//       res.status(400)
//       throw new Error("Informe um id")
//     }

//     const [ foundVideo ]: TVideos[] = await db("videos").where({ id: idToEdit })
//     if(!foundVideo){
//       res.status(400)
//       throw new Error("Video não encontrado")
//     }

//     const {newId, newTitle, newDuration} = req.body //dado cru

//     const [ videoDBExists ]: TVideos[] = await db("videos").where({ id: newId })
//     if (videoDBExists) {
//       res.status(400)
//       throw new Error("'id' já existe")
//     }
    
//     const [ videoToEdit ]: TVideos[] = await db("videos").where({ id: idToEdit })
    
//     const newVideo = new Video(
//       videoToEdit.id,
//       videoToEdit.title,
//       videoToEdit.duration,
//       videoToEdit.uploadAt
//     )

//     if(newId !== undefined){
//       if (typeof newId !== "string") {
//         res.status(400)
//           throw new Error("'id' deve ser string")
//         }
//         newVideo.setId(newId)
//     }

//     if(newTitle !== undefined){
//       if (typeof newTitle !== "string") {
//         res.status(400)
//         throw new Error("'title' deve ser string")
//       }
//       newVideo.setTitle(newTitle)
//     }
    
//     if(newDuration !== undefined){
//       if (typeof newDuration !== "number") {
//         res.status(400)
//         throw new Error("'duration' deve ser string")
//       }
//       newVideo.setDuration(newDuration)
//     }

//     const newVideoDB = {
//       ...newVideo,
//       upload_at: newVideo.setUploadAt(new Date().toISOString())
//     }

//     await db("videos").update(newVideoDB).where({id: idToEdit})

//     res.status(201).send({
//       message: "Video editado com sucesso",
//     })

//   } catch (error) {
//       console.log(error)

//       if (req.statusCode === 200) {
//           res.status(500)
//       }

//       if (error instanceof Error) {
//           res.send(error.message)
//       } else {
//           res.send("Erro inesperado")
//       }
//   }
// })

// app.delete("/videos/:id", async (req: Request, res: Response) => {
//   try {
//     const idToDelete = req.params.id

//     if(idToDelete === ":id"){
//       res.status(400)
//       throw new Error("Informe um id")
//     }

//     const [ videoDBExists ]: TVideos[] = await db("videos").where({ id: idToDelete })

//     if (!videoDBExists) {
//         res.status(400)
//         throw new Error("'id' não existe")
//     }

//     await db("videos").del().where({id: idToDelete})

//     res.status(201).send({
//       message: "Video deletado com sucesso",
//     })

//   } catch (error) {
//       console.log(error)

//       if (req.statusCode === 200) {
//           res.status(500)
//       }

//       if (error instanceof Error) {
//           res.send(error.message)
//       } else {
//           res.send("Erro inesperado")
//       }
//   }
// })