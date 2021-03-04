// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as request from "request-promise-native";
import * as vscode from 'vscode';
import Youtube from './youtube';
let open = require('open'); //this module is used to open browser such as google chrome


let isExtensionActivated = 0; // o means thaT initially ,it is deactivated
var catSmiley = String.fromCodePoint(0X0001F638);
const regex = /\[(.+?)\]/gm;



async function check(context: vscode.ExtensionContext):Promise<string | undefined>{
	while(context.subscriptions.length>0){
		context.subscriptions.pop();
	}
	let answer = await vscode.window.showInformationMessage(`Extension dev-boon has not been activated 😣\nDo you want to activate it?`,"YES","NO");

	if(answer !== undefined && await answer === "YES"){
		isExtensionActivated = 1;
		await vscode.window.showInformationMessage(`Your extension has been activated successfully ${catSmiley} with ${isExtensionActivated} `);
		
		activate(context);
	}else if(answer === "NO"){
		await vscode.window.showErrorMessage("Sorry to hear that 😣");
	}else{
		await vscode.window.showWarningMessage("Something went wrong 😣");
	}
	return "";
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {


		let deactivateCommand = vscode.commands.registerCommand("dev-boon.DEACTIVATE_EXTENSION",()=>{
			
			if(isExtensionActivated === 1){
				deactivate(context);
			}else{
				check(context);
			}
			
		});

		context.subscriptions.push(deactivateCommand);


		let stackOverFlowSearchBySelectingTextFromEditorWithPrompt = vscode.commands.registerCommand(`dev-boon.STACKOVERFLOW_SEARCH_WITH_SELECTED_TEXT_USING_PROMPT`,async ()=>{
			try{
				if(isExtensionActivated === 1){
					let selectedText = getSelectedTextFromEditor();
					if(selectedText!==undefined){
						let searchTerm = await vscode.window.showInputBox({
							ignoreFocusOut: selectedText === '',
							placeHolder: 'Please enter your Stackoverflow query',
							// prompt: 'search for tooltip',
							value: selectedText,
							valueSelection: [0, selectedText.length + 1],
						});
				
						await runSearchingForStackOverFlowPosts(searchTerm!);
					}
				}else{
					check(context);
				}
			}catch(err){
				await vscode.window.showErrorMessage("Something went wrong while searching for Stackoverflow posts 😣");
			}
		});

		context.subscriptions.push(stackOverFlowSearchBySelectingTextFromEditorWithPrompt);

		let stackOverFlowSearchBySelectingTextFromEditor = vscode.commands.registerCommand('dev-boon.STACKOVERFLOW_SEARCH_WITH_SELECTED_TEXT', async () => {
			if(isExtensionActivated === 1){
				try {
					let selectedText = await getSelectedTextFromEditor();
	
					

					if(selectedText!==undefined){
						vscode.window.showInformationMessage(`Working fine with ${isExtensionActivated}`);
						await runSearchingForStackOverFlowPosts(selectedText);
					}else{
						vscode.window.showErrorMessage("Something went Wrong 😣");
					}
	
				} catch (err) {
					await vscode.window.showErrorMessage("Some Error occured while searching stackOverFlow posts 😣.Please try again");
				}
			}else{
				check(context);
			}

		});

		context.subscriptions.push(stackOverFlowSearchBySelectingTextFromEditor);


		let youTubeSearchBySelectingTextFromEditorWithPrompt = vscode.commands.registerCommand(`dev-boon.YOUTUBE_SEARCH_WITH_SELECTED_TEXT_USING_PROMPT`,async ()=>{
			try{
				if(isExtensionActivated === 1){
					let selectedText = getSelectedTextFromEditor();
					if(selectedText!==undefined){
						let searchTerm = await vscode.window.showInputBox({
							ignoreFocusOut: selectedText === '',
							placeHolder: 'Please enter your Youtube query',
							value: selectedText,
							valueSelection: [0, selectedText.length + 1],
						});
				
						await runSearchingForYouTube(searchTerm!);
					}
				}else{
					check(context);
				}
			}catch(err){
				await vscode.window.showErrorMessage("Something went wrong while searching for Youtube videos 😣");
			}
		});

		context.subscriptions.push(youTubeSearchBySelectingTextFromEditorWithPrompt);

		let youTubeSearchBySelectingTextFromEditor = vscode.commands.registerCommand('dev-boon.YOUTUBE_SEARCH_WITH_SELECTED_TEXT', async () => {
			if(isExtensionActivated === 1){
				try {
					let selectedText = await getSelectedTextFromEditor();
					if(selectedText!==undefined){
						vscode.window.showInformationMessage(`Working fine with ${isExtensionActivated}`);
						await runSearchingForYouTube(selectedText);
					}else{
						vscode.window.showErrorMessage("Something went Wrong 😣");
					}
	
				} catch (err) {
					await vscode.window.showErrorMessage("Some Error occured while searching youTube videos 😣.Please try again");
				}
			}else{
				check(context);
			}

		});

		context.subscriptions.push(youTubeSearchBySelectingTextFromEditor);


}

// this method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext) {
	isExtensionActivated = 0;
	while(context.subscriptions.length>0){
		context.subscriptions.pop();
	}
	vscode.window.showInformationMessage(`dev-boon extension has been deactivated successfully ${catSmiley} with ${isExtensionActivated}`);
}



//function which parses editor and gives only that text which is currently selected
function getSelectedTextFromEditor(): string|undefined{
	let activeEditor = vscode.window.activeTextEditor;

	if(activeEditor === null || activeEditor === undefined){
		return "";
	}

	let editorDocument = activeEditor.document;

	let finalSelectedString = "";

	let eol = "\n";

	if(editorDocument.eol !==1){
		eol = "\r\n";
	}

	let fetchSelectedLines: string[] = [];

	activeEditor.selections.forEach((selectedTextLine)=>{
		if(selectedTextLine.start.line === selectedTextLine.end.line && selectedTextLine.start.character === selectedTextLine.end.character){
			let range = editorDocument.lineAt(selectedTextLine.start).range;
			let text = "undefined";
			if(activeEditor!==undefined){
				text=activeEditor.document.getText(range);
			}

			fetchSelectedLines.push(`${text}${eol}`);
		}else{
			if(activeEditor!==undefined){
				fetchSelectedLines.push(activeEditor.document.getText(selectedTextLine));
			}
		}
	});

	

	if(fetchSelectedLines.length >0){
		finalSelectedString = fetchSelectedLines[0];
		finalSelectedString = finalSelectedString.trim();
	}

	return finalSelectedString;


}



async function runSearchingForStackOverFlowPosts(selectedText:string): Promise<void>{
	if(!selectedText || selectedText.trim() === ""){
		return;
	}

	selectedText = selectedText.trim();
    vscode.window.showInformationMessage(`User initiated a stackoverflow search with [${selectedText}] query`);

	let tags: string[] = [];
	let tagsMatch;
	let updatedSelectedText = selectedText;

	while ((tagsMatch = regex.exec(updatedSelectedText)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (tagsMatch.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        // The result can be accessed through the `m`-variable.
        tagsMatch.forEach((match, groupIndex) => {
            if(groupIndex === 0) { // full match without group for replace
                updatedSelectedText = updatedSelectedText.replace(match, "").trim();
            } else if(groupIndex === 1) { // not a full match
                tags.push(match);
            }
        });  
    }

	const stackoverflowApiKey = 'Y3TeIyyVjpbz**icfv1oVg((';
    const encodedTagsString = encodeURIComponent(tags.join(';'));
    const encodedAPISearchTerm = encodeURIComponent(updatedSelectedText);
    const encodedWebSearchTerm = encodeURIComponent(selectedText);
    const apiSearchUrl = `https://api.stackexchange.com/2.2/search?order=desc&sort=relevance&intitle=${encodedAPISearchTerm}&tagged=${encodedTagsString}&site=stackoverflow&key=${stackoverflowApiKey}`;
    const stackoverflowSearchUrl = `https://stackoverflow.com/search?q=${encodedWebSearchTerm}`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodedWebSearchTerm}`;
    const uriOptions = {
        uri: apiSearchUrl,
        json: true,
        gzip: true,
    };


	const questionsMeta = [
        { title: `🔎 Search Stackoverflow: ${selectedText}`, url: stackoverflowSearchUrl },
        { title: `🔎 Search Google: ${selectedText}`, url: googleSearchUrl },
    ];
    try {
        const searchResponse = await request.get(uriOptions);
        if (searchResponse.items && searchResponse.items.length > 0) {
			const panel = vscode.window.createWebviewPanel(
				'extension',
				'Extension',
				vscode.ViewColumn.One,
				{}
			  );
            
            var pass_the_result:description[]=new Array(10);
			var count:number=0;


            searchResponse.items.forEach((q: any, i: any) => {
				console.log(q);
				console.log("\n===========\n");

				if(count<10){
					pass_the_result[count]=new description(q.title,q.tags.join(','),q.owner.display_name,q.link,"");
					count=count+1;
				}
            });
			panel.webview.html = getWebviewContent(0,pass_the_result);
        }
    } catch (error) {
        console.error(error);
    }
}	


function getStringOutOfTagList(tags:string[]): string{
	let result = "";

	tags.forEach((str)=>{
		result+=str;
		result+=" ";
	});

	// result = result.trim();
	vscode.window.showInformationMessage(`Resultant string is: ${result}`);
	return result;

}


async function runSearchingForYouTube(selectedText:string): Promise<void>{
	if(!selectedText || selectedText.trim() === ""){
		return;
	}

	selectedText = selectedText.trim();
    vscode.window.showInformationMessage(`User initiated a youTube search with [${selectedText}] query`);

	let tags: string[] = [];
	let tagsMatch;
	let updatedSelectedText = selectedText;

	while ((tagsMatch = regex.exec(updatedSelectedText)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (tagsMatch.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        // The result can be accessed through the `m`-variable.
        tagsMatch.forEach((match, groupIndex) => {
            if(groupIndex === 0) { // full match without group for replace
                updatedSelectedText = updatedSelectedText.replace(match, "").trim();
            } else if(groupIndex === 1) { // not a full match
                tags.push(match);
            }
        }); 
		 
    }


    const encodedWebSearchTerm = encodeURIComponent(selectedText);

	vscode.window.showInformationMessage(`encodedWebSearchTerm is ${encodedWebSearchTerm}`);

    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodedWebSearchTerm}`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodedWebSearchTerm}`;
   


	const questionsMeta = [
        { title: `🔎 Search Youtube ${selectedText}`, url: youtubeSearchUrl },
        { title: `🔎 Search Google: ${selectedText}`, url: googleSearchUrl },
    ];
    try {

		var response = await Youtube.get("/search",{
			params:{
				q:selectedText,
				part:"snippet"
			}
		})

		let videoList = response.data.items;
		console.log(videoList[0]);
		if (videoList && videoList.length > 0) {
			const panel = vscode.window.createWebviewPanel(
				'extension',
				'Extension',
				vscode.ViewColumn.One,
				{}
			  );
            
            var pass_the_result:description[]=new Array(10);
			var count:number=0;


            videoList.forEach((video: any) => {
                if(video.id.videoId!==undefined && video.id.videoId!==null){
					if(count<10){
						pass_the_result[count]=new description(video.snippet.title,video.snippet.description,video.snippet.channelTitle ,`https://www.youtube.com/embed/${video.id.videoId}`,video.snippet.thumbnails.default.url);
					    count=count+1;
					}
				}
            });
			panel.webview.html = getWebviewContent(1,pass_the_result);
        }
		console.log(questionsMeta);
    } catch (error) {
        console.error(error);
    }
}	


class description{
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
}
function getWebviewContent(x:number,pass_the_result:description[]) {
	var stck:string;
	stck='';
	var num:number=0;
	var a:string;
	var b:string;
	var c:string;
	var d:string;
	var e:string;
	if(x==0){
		for(num=0;num<10;num++){
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

		stck+='</td></tr>'
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
	if(x==1){
		for(num=0;num<5;num++){
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
					
					</div>`
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
	return 'OOPS....';
  }