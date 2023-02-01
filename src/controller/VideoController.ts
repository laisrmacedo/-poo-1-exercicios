import { Request, Response } from "express"
import { VideoDatabase } from "../database/VideoDatabase"
import { Video } from "../models/video"

export class VideoController {
  public getVideos = async (req: Request, res: Response) => {
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
  }

  public createVideo = async (req: Request, res: Response) => {
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
  }

  public updateVideo = async (req: Request, res: Response) => {
    try {
      const idToEdit = req.params.id
  
      if(idToEdit === ":id"){
        res.status(400)
        throw new Error("Informe um id")
      }
  
      // const [ foundVideo ]: TVideos[] = await db("videos").where({ id: idToEdit })
      const videoDatabase = new VideoDatabase()
      const foundVideo = await videoDatabase.findVideoById(idToEdit)

      if(!foundVideo){
          res.status(400)
          throw new Error("Video não encontrado")
      }
      
      const {newId, newTitle, newDuration} = req.body
      
      // const [ videoDBExists ]: TVideos[] = await db("videos").where({ id: newId })
      const videoDBExists = await videoDatabase.findVideoById(newId)
  
      if (videoDBExists && videoDBExists.id !== foundVideo.id) {
        res.status(400)
        throw new Error("'id' já existe")
      }
  
      const newVideo = new Video(
          foundVideo.id,
          foundVideo.title,
          foundVideo.duration,
          foundVideo.upload_at
      )
  
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
  
      const newVideoDB = {
        id: newVideo.setId(newId) || foundVideo.id,
        title: newVideo.setTitle(newTitle) || foundVideo.title,
        duration: newVideo.setDuration(newDuration) || foundVideo.duration,
        upload_at: newVideo.setUploadAt(new Date().toISOString()) //foundVideo.upload_at
      }
  
      // await db("videos").update(newVideoDB).where({id: idToEdit})
      await videoDatabase.updateVideo(newVideoDB, idToEdit)
  
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
  }

  public deleteVideo = async (req: Request, res: Response) => {
    try {
      const idToDelete = req.params.id
  
      if(idToDelete === ":id"){
        res.status(400)
        throw new Error("Informe um id")
      }
  
      // const [ videoDBExists ]: TVideos[] = await db("videos").where({ id: idToDelete })
      const videoDatabase = new VideoDatabase()
      const videoDBExists = videoDatabase.findVideoById(idToDelete)
  
      if (!videoDBExists) {
          res.status(400)
          throw new Error("'id' não existe")
      }
  
      // await db("videos").del().where({id: idToDelete})
      await videoDatabase.deleteVideo(idToDelete)
  
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
  }
}