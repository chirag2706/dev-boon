import * as vscode from "vscode";
// import { getNonce } from "./getNonce";
import {description} from "./description";
import {summary} from "./summary"


  function min(x:number,y:number):number{
    if(x<=y){
      return x;
    }
    return y;
  }


  function getWebviewContent(x:number,pass_the_result:description[]) {

    //vscode.window.showInformationMessage("getWebviewContent function is called");

    var stck:string;
    stck='';
    var num:number=0;
    var a:string;
    var b:string;
    var c:string;
    var d:string;
    var e:string;
	if(x==0 || x==1 || x==2 || x==3 || x==4 || x==5 || x==6 || x==7 || x==8){
    if(x==7){
      console.log("CAME HERE TOO...\n");
      stck='<div style="max-width:220px;margin-bottom:30px;margin-top:40px;"><img src="https://logos-download.com/wp-content/uploads/2019/01/Stack_Overflow_Logo-700x283.png" alt="StackOverFlow"/></div>';
			stck+=`<label class="switch">
              <input type="checkbox">
              <span class="slider"></span>
            </label>`
      if(pass_the_result.length==0){
				stck+=`<div>No Results Found ...</div>`;
			}
			else{
				for(num=0;num<min(10,pass_the_result.length);num++){
					a=pass_the_result[num].ThumbnailURL;
					b=pass_the_result[num].Title;
					c=pass_the_result[num].Description;
					d=pass_the_result[num].Owner;
					e=pass_the_result[num].Url;
					stck+=`<div><div class="card" style="width:100%;max-width:200px;margin-bottom:5%;margin-top:5%;" >
							<div class="card-body" style="padding:3% 3% 3% 3%;">
							<h5 class="card-title" ><p style="font-size:14px;">${b}</p></h3>
							<p lass="card-text" style="font-size:12px;width:100%;">${c}</p>
              <textarea class="textarea" name="paragraph_text" cols="15" rows="10" style="width:100%;">${d}</textarea>
							<a href="${e}" style="width:100%;font-size:11px;" class="btn btn-outline-primary open_button">Open</a>
							</div>
							</div></div>`;
				}
			}
    }
		else if(x==0){
      		stck='<div style="max-width:220px;margin-bottom:30px;margin-top:40px;"><img src="https://logos-download.com/wp-content/uploads/2019/01/Stack_Overflow_Logo-700x283.png" alt="StackOverFlow"/></div>';
			if(pass_the_result.length==0){
				stck+=`<div>No Results Found ...</div>`;
			}
			else{
				for(num=0;num<min(10,pass_the_result.length);num++){
					a=pass_the_result[num].ThumbnailURL;
					b=pass_the_result[num].Title;
					c=pass_the_result[num].Description;
					d=pass_the_result[num].Owner;
					e=pass_the_result[num].Url;
					stck+=`<div><div class="card" style="width:100%;max-width:180px;margin-bottom:5%;margin-top:5%;" >
							<img src="https://jessehouwing.net/content/images/size/w2000/2018/07/stackoverflow-1.png" class="card-img-top" alt="..."/>
							<div class="card-body" style="padding:3% 3% 3% 3%;">
							<h5 class="card-title" ><p style="font-size:14px;">${b}</p></h3>
							<p class="card-text" style="font-size:12px;">${c}</p>
							<p class="card-text" style="font-size:12px;"><i>By ${d}<i></p>
							<a href="${e}" style="width:100%;font-size:11px;" class="btn btn-outline-primary">Open</a>
							</div>
							</div></div>`;
				}
			}
		}
		else if(x==1){
			stck='<div style="max-width:200px;margin-top:40px;"><img src="https://1000logos.net/wp-content/uploads/2017/05/Youtube-Logo-500x313.png" alt="YOUTUBE"></div>';
			if(pass_the_result.length==0){
				stck+=`<div>No Results Found ...</div>`;
			}
			else{
				for(num=0;num<min(5,pass_the_result.length);num++){
					a=pass_the_result[num].ThumbnailURL;
					b=pass_the_result[num].Title;
					c=pass_the_result[num].Description;
					d=pass_the_result[num].Owner;
					e=pass_the_result[num].Url;
					stck+=`<div><div class="card" style="width:100%;max-width:180px;margin-bottom:5%;margin-top:5%;" >
							<img class="card-img-top"  src="${a}" alt="YOUTUBE" >
							<div class="card-body" style="padding:3% 3% 3% 3%;">
							<h5 class="card-title" ><p style="font-size:14px;">${b}</p></h3>
							<p lass="card-text" style="font-size:12px;">${c}</p>
							<p lass="card-text" style="font-size:12px;"><i>By ${d}<i></p>
							<a href="${e}" style="width:100%;font-size:11px;" class="btn btn-outline-primary">Open</a>
							</div>
							</div></div>`;
				}
			}
		}
		else if(x==2){
			stck='<div style="max-width:200px;margin-top:40px;"><img src="https://1000logos.net/wp-content/uploads/2017/05/Youtube-Logo-500x313.png" alt="YOUTUBE"></div>';
			stck+=`<button class="buttonload">
			<i class="fa fa-refresh fa-spin"></i>
		  </button>`;
		}
		else if(x==3){
			stck='<div style="max-width:220px;margin-bottom:30px;margin-top:40px;"><img src="https://logos-download.com/wp-content/uploads/2019/01/Stack_Overflow_Logo-700x283.png" alt="StackOverFlow"/></div>'
			stck+=`<button class="buttonload">
			<i class="fa fa-refresh fa-spin"></i>
		  </button>`;
		}
		else if(x==4){
			stck='<div style="max-width:220px;margin-bottom:30px;margin-top:40px;"><img src="https://logos-download.com/wp-content/uploads/2019/01/Stack_Overflow_Logo-700x283.png" alt="StackOverFlow"/></div>'
			stck+=`<div>No Results Found ...</div>`;
		}
		else if(x==5){
			stck='<div style="max-width:200px;margin-top:40px;"><img src="https://1000logos.net/wp-content/uploads/2017/05/Youtube-Logo-500x313.png" alt="YOUTUBE"></div>';
			stck+=`<div>No Results Found ...</div>`;
		}
    else{
      stck='<div style="max-width:200px;"><img src="https://i.ibb.co/z7Bt1tN/bcg-white-dev-boon.png" alt="DEV BOON"></div><div style="margin-top:40px;"><h3>Automatically generating a Code Snippet ...</h3></div>';
      stck+=`<button class="buttonload">
			<i class="fa fa-refresh fa-spin"></i>
		  </button>`;
    }
		return `<!DOCTYPE html>
		<html>
		<head>
		<style>
			.buttonload {
        text-align: center;
				background-color: white;
				border: none; /* Remove borders */
				color: black; /* White text */
				padding: 12px 16px; /* Some padding */
				font-size: 30px; /* Set a font size */
        max-width:100px;
        width: 100%;
			}

      .testing {
        display: flex;
        
        flex-direction: column;
        align-items:center;
        justify-content: center;
      }
      .align {
        text-align: center;
        margin-top: 50vh;
      }
      .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
      }
      
      .switch input { 
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      
      

      input:checked + .slider {
        background-color: #2196F3;
      }/*  */
      

      input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
      }
      
      input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
      }
      
      /* Rounded sliders */
      .slider.round {
        border-radius: 34px;
      }
      
      .slider.round:before {
        border-radius: 50%;
      }
		</style>

		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous"
		</head>
		<body >
      <div id = "MyCustom">
        ${stck}
      </div>
      
		</body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
    
    </html>`;
	}
    return `<!DOCTYPE html>
	<html>
	<head>
	<style>
		.testing{
		display: flex;
		flex-direction: column;
		align-items:center;
		justify-content: center;
		}
	</style>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous"
	</head>
	<body>
	<div class = "testing" >
	<div style="max-width:200px;"><img src="https://i.ibb.co/z7Bt1tN/bcg-white-dev-boon.png" alt="DEV BOON"></div>
	</div>
	</body>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
	
  </html>`;
}
//https://i.ibb.co/XFHsytD/dev-boon-logo.png
//https://i.ibb.co/z7Bt1tN/bcg-white-dev-boon.png
export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {
    //vscode.window.showInformationMessage("SidebarProvider constructor is called");
    
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    //vscode.window.showErrorMessage("resolveWebviewView function is called");
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview,-1,[]);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        
        case "onInfo": {
          if (!data.value) {
            return;
          }
          //vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          //vscode.window.showErrorMessage(data.value);
          break;
        }
        
      }
    });
  }

  public customResolveWebviewView(x:number,pass_the_result:description[]) {
    //vscode.window.showErrorMessage("customResolveWebviewView function is called");
    // this._view = webviewView;
    if(this._view!==undefined){
      this._view.webview.options = {
        // Allow scripts in the webview
        enableScripts: true,
  
        localResourceRoots: [this._extensionUri],
      };
  
      this._view.webview.html = this._getHtmlForWebview(this._view.webview,x,pass_the_result);
  
      this._view.webview.onDidReceiveMessage(async (data) => {
        switch (data.type) {
          
          case "onInfo": {
            if (!data.value) {
              return;
            }
           // vscode.window.showInformationMessage(data.value);
            break;
          }
          case "onError": {
            if (!data.value) {
              return;
            }
            //vscode.window.showErrorMessage(data.value);
            break;
          }
          
        }
      });
    }else{
      //vscode.window.showErrorMessage("Something went wrong while showing UI:(");
    }
    
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview,x:number,pass_the_result:description[]) {
    return getWebviewContent(x,pass_the_result);
  }
  public customResolveWebviewViewS(x:number,pass_the_result:summary) {
    //vscode.window.showErrorMessage("customResolveWebviewView function is called");
    // this._view = webviewView;
    if(this._view!==undefined){
      this._view.webview.options = {
        // Allow scripts in the webview
        enableScripts: true,
  
        localResourceRoots: [this._extensionUri],
      };
  
      this._view.webview.html = this._getHtmlForWebviewS(this._view.webview,x,pass_the_result);
  
      this._view.webview.onDidReceiveMessage(async (data) => {
        switch (data.type) {
          
          case "onInfo": {
            if (!data.value) {
              return;
            }
           // vscode.window.showInformationMessage(data.value);
            break;
          }
          case "onError": {
            if (!data.value) {
              return;
            }
            //vscode.window.showErrorMessage(data.value);
            break;
          }
          
        }
      });
    }else{
      //vscode.window.showErrorMessage("Something went wrong while showing UI:(");
    }
    
  }

  private _getHtmlForWebviewS(webview: vscode.Webview,x:number,summary:summary) {
    return getWebviewContentS(x,summary);
  }
}

function getWebviewContentS(x:number,pass_the_result:summary){
	return `<!DOCTYPE html>
			<html>
			<head>

      <style>
      .testing {
        display: flex;
        
        flex-direction: column;
        align-items:center;
        justify-content: center;
      }
      
      </style>

			<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous"
			</head>
			<body>
      <div class = "testing" >
	  <div style="max-width:200px;"><img src="https://i.ibb.co/z7Bt1tN/bcg-white-dev-boon.png" alt="DEV BOON"></div>
      </div>
			<h4 style="font-size:17px;"></h4>
			<p style="font-size:14px">${pass_the_result.Summary}<p>
			</body>
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
    		</html>`;
}
