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
	if(x==0 || x==1 || x==2 || x==3 || x==4 || x==5 || x==6){
		if(x==0){
      		stck='<h4>StackOverFlow</h4>';
			if(pass_the_result.length==0){
				stck='<h3>StackOverFlow</h3>';
				stck+=`No Results Found ...`;
			}
			else{
				for(num=0;num<min(10,pass_the_result.length);num++){
					a=pass_the_result[num].ThumbnailURL;
					b=pass_the_result[num].Title;
					c=pass_the_result[num].Description;
					d=pass_the_result[num].Owner;
					e=pass_the_result[num].Url;
					stck+=`<div class="card" style="width:100%;max-width:180px;margin-bottom:5%;" >
							<img src="https://jessehouwing.net/content/images/size/w2000/2018/07/stackoverflow-1.png" class="card-img-top" alt="..."/>
							<div class="card-body" style="padding:3% 3% 3% 3%;">
							<h5 class="card-title" ><p style="font-size:14px;">${b}</p></h3>
							<p lass="card-text" style="font-size:12px;">${c}</p>
							<p lass="card-text" style="font-size:12px;"><i>By ${d}<i></p>
							<a href="${e}" style="width:100%;font-size:11px;" class="btn btn-outline-primary">Open</a>
							</div>
							</div>`;
				}
			}
		}
		else if(x==1){
			stck='<h3>YOUTUBE</h3>';
			if(pass_the_result.length==0){
				stck='<h3>YOUTUBE</h3>';
				stck+=`No Results Found ...`
			}
			else{
				for(num=0;num<min(5,pass_the_result.length);num++){
					a=pass_the_result[num].ThumbnailURL;
					b=pass_the_result[num].Title;
					c=pass_the_result[num].Description;
					d=pass_the_result[num].Owner;
					e=pass_the_result[num].Url;
					stck+=`<div class="card" style="width:100%;max-width:180px;margin-bottom:5%;" >
							<img class="card-img-top"  src="${a}" alt="YOUTUBE" >
							<div class="card-body" style="padding:3% 3% 3% 3%;">
							<h5 class="card-title" ><p style="font-size:14px;">${b}</p></h3>
							<p lass="card-text" style="font-size:12px;">${c}</p>
							<p lass="card-text" style="font-size:12px;"><i>By ${d}<i></p>
							<a href="${e}" style="width:100%;font-size:11px;" class="btn btn-outline-primary">Open</a>
							</div>
							</div>`;
				}
			}
		}
		else if(x==2){
			stck='<h3>YOUTUBE</h3>';
			stck+=`<button class="buttonload">
			<i class="fa fa-refresh fa-spin"></i>Loading
		  </button>`
		}
		else if(x==3){
			stck='<h3>StackOverFlow</h3>';
			stck+=`<button class="buttonload">
			<i class="fa fa-refresh fa-spin"></i>Loading
		  </button>`
		}
		else if(x==4){
			stck='<h3>StackOverFlow</h3>';
			stck+=`No Results Found ...`
		}
		else if(x==5){
			stck='<h3>YOUTUBE</h3>';
			stck+=`No Results Found ...`;
		}
    else{
      stck='<h3>Generating an Automatic Code Snippet</h3>';
      stck+=`<button class="buttonload">
			<i class="fa fa-refresh fa-spin"></i>Loading
		  </button>`
    }
		return `<!DOCTYPE html>
		<html>
		<head>
		<style>
			.buttonload {
				background-color: #4CAF50; /* Green background */
				border: none; /* Remove borders */
				color: white; /* White text */
				padding: 12px 16px; /* Some padding */
				font-size: 16px; /* Set a font size */
				width:100%;
				margin:auto auto uto auto;
			}
		</style>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous"
		</head>
		<body>
			${stck}
		</body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
		</html>`;
	}
    return `<!DOCTYPE html>
    <html>
      <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous"
      </head>
      <body>
      <h2>DEV-BOON</h2>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
    </html>`;
  }

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
			<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous"
			</head>
			<body>
			<h2>DEV-BOON</h2>
			<h4 style="font-size:17px;"></h4>
			<p style="font-size:14px">${pass_the_result.Summary}<p>
			</body>
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
    		</html>`;
}
