export class Video {
  constructor(
    private id: string,
    private title: string,
    private duration: number,
    private uploadAt: string
  ){}

  public getId():string {
    return this.id
  }
  public setId(newId: string): string {
    this.id = newId
    return newId
  }

  public getTitle():string {
    return this.title
  }
  public setTitle(newTitle: string):string {
    this.title = newTitle
    return newTitle
  }

  public getDuration():number {
    return this.duration
  }
  public setDuration(newDuration: number):number {
    this.duration = newDuration
    return newDuration
  }

  public getUploadAt():string {
    return this.uploadAt
  }
  public setUploadAt(newUploadAt: string):string {
    this.uploadAt = newUploadAt
    return newUploadAt
  }
}