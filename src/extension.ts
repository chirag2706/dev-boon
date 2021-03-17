import * as request from "request-promise-native";
import * as vscode from 'vscode';	
import {SidebarProvider} from './sidebarProvider';
import {description} from "./description";



//// RUN THE FLASK LOCALLY ON PORT 6615
var {spawn} = require('child_process');
var j;
for(var i=__dirname.length;i>=0;i--){
	if(__dirname.charAt(i)=="/"){
		j=i;
		break;
	}
}
var path=__dirname.slice(0,j);
// STOP THE FLASK SERVER IF RUNNING ON PORT 6615
var stop_running_server=spawn('fuser',['-n','tcp','-k','6615']);

//START FLASK ON PORT 6615
var python=spawn('python3',[path+'/src/Python/PythonScript1.py']);


///////////////


var sidebarProvider:any = undefined ;

let open = require('open'); //this module is used to open browser such as google chrome


let isExtensionActivated = 0; // o means thaT initially ,it is deactivated
var catSmiley = String.fromCodePoint(0X0001F638);
const regex = /\[(.+?)\]/gm;



async function check(context: vscode.ExtensionContext):Promise<string | undefined>{
	try{
		while(context.subscriptions.length>0){
			context.subscriptions.pop();
		}
		
		let answer = await vscode.window.showInformationMessage(`Extension dev-boon has not been activated 😣\nDo you want to activate it?`,"YES","NO");
		// vscode.window.showInformationMessage(`answer is ${answer}`);
		if(answer !== undefined && answer === "YES"){
			isExtensionActivated = 1;
			vscode.commands.executeCommand("workbench.view.extension.dev-boon-sidebar-view");
			vscode.window.showInformationMessage(`Your extension has been activated successfully ${catSmiley} with ${isExtensionActivated} `);
			
			await activate(context);
		}else if(answer === "NO"){
			vscode.window.showErrorMessage("Sorry to hear that 😣");
		}else{
			vscode.window.showWarningMessage("Bug found,Something went wrong 😣");
		}
		return "";
	}catch(error){
		vscode.window.showErrorMessage(`Error is ${error.message}`);
		return "";
	}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
		if(sidebarProvider===undefined){
			// vscode.window.showErrorMessage(`bug is their`);
			sidebarProvider = new SidebarProvider(context.extensionUri);

			let sideBar = vscode.window.registerWebviewViewProvider(
				"dev-boon-sidebar",
				sidebarProvider
			);

			context.subscriptions.push(sideBar);

		}


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
					await check(context);
				}
			}catch(err){
				vscode.window.showErrorMessage("Something went wrong while searching for Stackoverflow posts 😣");
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
					vscode.window.showErrorMessage("Some Error occured while searching stackOverFlow posts 😣.Please try again");
				}
			}else{
				await check(context);
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
					await check(context);
				}
			}catch(err){
				vscode.window.showErrorMessage("Something went wrong while searching for Youtube videos 😣");
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
					vscode.window.showErrorMessage("Some Error occured while searching youTube videos 😣.Please try again");
				}
			}else{
				await check(context);
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

    var encodedTagsString = encodeURIComponent(tags.join(';'));
    const encodedAPISearchTerm = encodeURIComponent(updatedSelectedText);
    const encodedWebSearchTerm = encodeURIComponent(selectedText);
	console.log(encodedTagsString);
	var apiSearchUrl;
	if(encodedTagsString.length>0){
    	apiSearchUrl = `http://127.0.0.1:6615/apiSearchUrl/${encodedAPISearchTerm}/${encodedTagsString}`;
	}
	else{
		apiSearchUrl = `http://127.0.0.1:6615/apiSearchUrl_Single/${encodedAPISearchTerm}`
	}
	const stackoverflowSearchUrl = `http://127.0.0.1:6615/stackoverflowSearchUrl/${encodedWebSearchTerm}`;
    const googleSearchUrl = `http://127.0.0.1:6615/googleSearchUrl/${encodedWebSearchTerm}`;
    const uriOptions = {
        uri: apiSearchUrl,
        json: true,
        gzip: true,
    };
	// const questionsMeta = [
    //     { title: `🔎 Search Stackoverflow: ${selectedText}`, url: stackoverflowSearchUrl },
    //     { title: `🔎 Search Google: ${selectedText}`, url: googleSearchUrl },
    // ];
    try {
        const searchResponse = await request.get(uriOptions);

		vscode.window.showInformationMessage(`stack api has responded with ${searchResponse}`);
        if (searchResponse.items && searchResponse.items.length > 0) {
            var pass_the_result:description[]=new Array(10);
			var count:number=0;
            searchResponse.items.forEach((q: any, i: any) => {
				if(count<10){
					pass_the_result[count]=new description(q.title,q.tags.join(','),q.owner.display_name,q.link,"");
					count=count+1;
				}
            });

			if(sidebarProvider === undefined || sidebarProvider === null){
				vscode.window.showErrorMessage(`sidebarProvider is ${sidebarProvider} inside stack search`);
			}

			if(sidebarProvider!==null && sidebarProvider!==undefined){
				sidebarProvider.customResolveWebviewView(0,pass_the_result);
			}

        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error Pranav is: ${error.message}`);
    }
}
function getStringOutOfTagList(tags:string[]): string{
	let result = "";

	tags.forEach((str)=>{
		result+=str;
		result+=" ";
	});
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
	const youtube=`http://127.0.0.1:6615/YouTube/${encodedWebSearchTerm}`;
	const youtubeSearchUrl=`https://www.youtube.com/results?search_query=${encodedWebSearchTerm}`;
    const googleSearchUrl = `http://127.0.0.1:dfb6615//YouTube_googleSearchUrl/${encodedWebSearchTerm}`;
	// const questionsMeta = [
    //     { title: `🔎 Search Youtube ${selectedText}`, url: youtubeSearchUrl },
    //     { title: `🔎 Search Google: ${selectedText}`, url: googleSearchUrl },
    // ];
	const uriOptions = {
        uri: youtube,
        json: true,
        gzip: true,
    };
    try {
		var response = await request.get(uriOptions);
		let videoList = response.items;
		console.log(videoList[0]);
		if (videoList && videoList.length > 0) {
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
			if(sidebarProvider === undefined || sidebarProvider === null){
				vscode.window.showErrorMessage(`sidebarProvider is ${sidebarProvider} inside youtube search`);
			}
			if(sidebarProvider!==null && sidebarProvider!==undefined){
				sidebarProvider.customResolveWebviewView(1,pass_the_result);
			}
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error is: ${error.message}`);
    }
}