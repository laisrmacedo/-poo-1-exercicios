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
  public setId(newId: string):void {
    this.id = newId
  }

  public getTitle():string {
    return this.title
  }
  public setTitle(newTitle: string):void {
    this.title = newTitle
  }

  public getDuration():number {
    return this.duration
  }
  public setDuration(newDuration: number):void {
    this.duration = newDuration
  }

  public getUploadAt():string {
    return this.uploadAt
  }
  public setUploadAt(newUploadAt: string):void {
    this.uploadAt = newUploadAt
  }
}