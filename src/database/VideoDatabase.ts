import { BaseDatabase } from "./BaseDatabase";
import { TVideos } from "../types"

export class VideoDatabase extends BaseDatabase{
  //atributos
  public static TABLE_VIDEOS = "videos"

  //metodos
  //find videos
  public async findVideos(q: string | undefined): Promise<TVideos[]>{
    let videosDB

    if(q) {
      const result: TVideos[] = await BaseDatabase
        .connection(VideoDatabase.TABLE_VIDEOS)
        .where("title", "LIKE", `%${q}%`)
      videosDB = result
    }else{
      const result = await BaseDatabase
        .connection(VideoDatabase.TABLE_VIDEOS)
      videosDB = result
    }
    return videosDB
  }

  //find video by id
  public async findVideoById(foundId: string| undefined): Promise<TVideos | undefined>{
    const [foundVideo] : TVideos[] | undefined[] = await BaseDatabase
      .connection(VideoDatabase.TABLE_VIDEOS)
      .where({ id: foundId })
    return foundVideo
  }
  
  //insert video
  public async insertVideo(newVideo: TVideos): Promise<void>{
    await BaseDatabase
      .connection(VideoDatabase.TABLE_VIDEOS)
      .insert(newVideo)
  }

  //update video
  public async updateVideo(editedVideo: TVideos, idToEdit: string): Promise<void>{
    await BaseDatabase
      .connection(VideoDatabase.TABLE_VIDEOS)
      .update(editedVideo)
      .where({ id: idToEdit })
  }

  //delete video
  public async deleteVideo(idToDelete: string): Promise<void>{
    await BaseDatabase
    .connection(VideoDatabase.TABLE_VIDEOS)
    .del()
    .where({ id: idToDelete })
  }
}