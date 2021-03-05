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
    if(x===0){
      for(num=0;num<min(10,pass_the_result.length);num++){
        a=pass_the_result[num].ThumbnailURL;
        b=pass_the_result[num].Title;
        c=pass_the_result[num].Description;
        d=pass_the_result[num].Owner;
        e=pass_the_result[num].Url;

        stck+=`<div class="card" style="width:20%;border: 0.1px solid white;margin-bottom:5px;padding:5px 5px 5px 5px;" >
            
            <div class="continer">
            <h3><b>${b}</b></h3>
            <p>${c}</p>
            <p>By ${d}</p>
            </ul>
            <a href="${e}" class="card-link button center">Click Here To Open</a>
            
            </div>
            </div>`

      stck+='</td></tr>';
      }
      return `<!DOCTYPE html>
        <html>
        <head>
        <style>
        .button {
          background-color: #4CAF50; /* Green */
          border: none;
          color: white;
          
          text-align: center;
          text-decoration: none;
          display: inline-block;
          
          transition-duration: 0.4s;
          cursor: pointer;
          background-color: white;
          color: black;
          border: 2px solid #e7e7e7;
          text-align: center;
            border-radius:20px;
        }
        .button:hover {background-color: #e7e7e7;transform: translateY(4px);}
        .center {
          display: block;
          margin-left: auto;
          margin-right: auto;
          width: 50%;
        }
        .card {
          /* Add shadows to create the "card" effect */
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
          transition: 0.3s;
        }
        
        /* On mouse-over, add a deeper shadow */
        .card:hover {
          box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
          z-index:100000 !important;
        }
        
        /* Add some padding inside the card container */
        .container {
          padding: 2px 16px;
        }
        </style>
          </head>
        <body>
        <h1>STACKOVERFLOW</h1>
          ${stck}
        </body>
        </html>`;
    }
    else if(x===1){
      for(num=0;num<min(5,pass_the_result.length);num++){
        a=pass_the_result[num].ThumbnailURL;
        b=pass_the_result[num].Title;
        c=pass_the_result[num].Description;
        d=pass_the_result[num].Owner;
        e=pass_the_result[num].Url;
        stck+=`<div class="card" style="width:20%;border: 0.1px solid white;margin-bottom:5px%;padding:5px 5px 5px 5px;" >
            <img  src="${a}" alt="YOUTUBE" class="center">
            <div class="continer">
            <h3><b>${b}</b></h3>
            <p>${c}</p>
            <p>By ${d}</p>
            </ul>
            <a href="${e}" class="card-link button center">Click Here To Open</a>
            
            </div>
            
            </div>`;
      }
      return `<!DOCTYPE html>
      <html>
      <head>
      <style>
      .button {
        background-color: purple; /* Green */
        border: none;
        color: white;
        
        text-align: center;
        text-decoration: none;
        display: inline-block;
        
        transition-duration: 0.4s;
        cursor: pointer;
        background-color: white;
          color: black;
          border: 2px solid #e7e7e7;
          text-align: center;
          border-radius:20px;
        }
      .button:hover {background-color: #e7e7e7;transform: translateY(4px);}
      .center {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
        }
      .card {
        /* Add shadows to create the "card" effect */
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
        }
        /* On mouse-over, add a deeper shadow */
        .card:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        z-index:100000 !important;
        }
        
        /* Add some padding inside the card container */
        .container {
        padding: 2px 16px;
        }
      </style>
        </head>
      <body>
      <h1>YOUTUBE</h1>
        ${stck}
      </body>
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

    // const styleResetUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    // );

    // const styleVSCodeUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    // );

    // const scriptUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    // );
    // const styleMainUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    // );
    

    // Use a nonce to only allow a sppa ecific script to be run.
    // const nonce = getNonce();

    return getWebviewContent(x,pass_the_result);
  }
}
