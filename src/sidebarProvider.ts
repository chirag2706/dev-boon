import * as vscode from "vscode";
// import { getNonce } from "./getNonce";
import {description} from "./description";


  function min(x:number,y:number):number{
    if(x<=y){
      return x;
    }
    return y;
  }


  function getWebviewContent(x:number,pass_the_result:description[]) {

    vscode.window.showInformationMessage("getWebviewContent function is called");

    var stck:string;
    stck='';
    var num:number=0;
    var a:string;
    var b:string;
    var c:string;
    var d:string;
    var e:string;
	if(x==0 || x==1){
		if(x===0){
			for(num=0;num<min(10,pass_the_result.length);num++){
				a=pass_the_result[num].ThumbnailURL;
				b=pass_the_result[num].Title;
				c=pass_the_result[num].Description;
				d=pass_the_result[num].Owner;
				e=pass_the_result[num].Url;
				stck+=`<h1>STACKOVERFLOW</h1><div class="card" style="width:100%;max-width:200px;" >
						<div class="card-body">
						<h3 class="card-title"><b><p style="font-size:18px;">${b}</p></b></h3>
						<p lass="card-text" style="font-size:14px;">${c}</p>
						<p lass="card-text" style="font-size:14px;">By ${d}</p>
						<a href="${e}" style="max-width:200px;width:100%" class="btn btn-outline-info">Open</a>
						</div>
						</div>`;
			}
		}
		else if(x===1){
			for(num=0;num<min(5,pass_the_result.length);num++){
				a=pass_the_result[num].ThumbnailURL;
				b=pass_the_result[num].Title;
				c=pass_the_result[num].Description;
				d=pass_the_result[num].Owner;
				e=pass_the_result[num].Url;
				stck+=`<h1>YOUTUBE</h1><div class="card" style="width:100%;max-width:200px;" >
						<img class="card-img-top"  src="${a}" alt="YOUTUBE" >
						<div class="card-body">
						<h3 class="card-title"><b><p style="font-size:18px;">${b}</p></b></h3>
						<p lass="card-text" style="font-size:14px;">${c}</p>
						<p lass="card-text" style="font-size:14px;">By ${d}</p>
						<a href="${e}" style="max-width:200px;width:100%" class="btn btn-outline-info">Open</a>
						</div>
						</div>`;
			}
		}
		return `<!DOCTYPE html>
		<html>
		<head>
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
      </head>
      <body>
      <h1>WELCOME TO DEV-BOON</h1>
        
      </body>
    </html>`;
  }

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {
    vscode.window.showInformationMessage("SidebarProvider constructor is called");
    
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    vscode.window.showErrorMessage("resolveWebviewView function is called");
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
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        
      }
    });
  }

  public customResolveWebviewView(x:number,pass_the_result:description[]) {
    vscode.window.showErrorMessage("customResolveWebviewView function is called");
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
            vscode.window.showInformationMessage(data.value);
            break;
          }
          case "onError": {
            if (!data.value) {
              return;
            }
            vscode.window.showErrorMessage(data.value);
            break;
          }
          
        }
      });
    }else{
      vscode.window.showErrorMessage("Something went wrong while showing UI:(");
    }
    
  }

  public revive(panel: vscode.WebviewView) {
    vscode.window.showInformationMessage("revive function is called");
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview,x:number,pass_the_result:description[]) {

    vscode.window.showInformationMessage("_getHtmlForWebview function is called");

    return getWebviewContent(x,pass_the_result);
  }
}