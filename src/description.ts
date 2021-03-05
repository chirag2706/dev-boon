export class description{
    Title:string;
    Description:string;
    Owner:string;
    ThumbnailURL:string;
    Url:string;
    constructor(Title:string="",Description:string="",Owner:string="",Url:string="",ThumbnailUrl:string=""){
      this.Title=Title;
      this.Description=Description;
      this.Url=Url;
      this.Owner=Owner;
      this.ThumbnailURL=ThumbnailUrl;
    }
  };