import * as request from "request-promise-native";
import * as vscode from 'vscode';	
import {SidebarProvider} from './sidebarProvider';
import {description} from "./description";
import {summary} from "./summary";
import {difficultQueryQueue} from './difficult_query_queue';
import {errorQuery} from './error_query';
import {QueryDocListener} from './snippetQuery/QueryDocListener';
const mongoose = require('mongoose');
//Devboon123
let uri = "mongodb+srv://chirag2706:Devboon123@cluster0.ihmsp.mongodb.net/snippetQuery?retryWrites=true&w=majority";

mongoose.connect(uri,{ 
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
}).then(()=>{
	console.log("Database has been connected successfully");
}).catch((err:any)=>{
	console.log(`${err.message}`);
});

// var {spawn} = require('child_process');// RUN THE FLASK LOCALLY ON PORT 6615
var j;


for(var i=__dirname.length;i>=0;i--){
	if(__dirname.charAt(i)=="/"){
		j=i;
		break;
	}
}

var path=__dirname.slice(0,j);
// var stopRunningServer=spawn('fuser',['-n','tcp','-k','6615']);// STOP THE FLASK SERVER IF RUNNING ON PORT 6615
// var python=spawn('python3',[path+'/src/Python/main.py']);//START FLASK ON PORT 6615
var sidebarProvider:any = undefined ; // represents dev-boon extension sidebar is closed
let isExtensionActivated = 0; // 0 means that initially ,it is deactivated
let queryUnderProcess = 0; // 0 means that api call is under process
let searchText:string|undefined = "";
var terminalArray:string[]=new Array("Terminal");// Store terminal text so that we dont repeatedly search them
var catSmiley = String.fromCodePoint(0X0001F638);//cat emoji
const regex = /\[(.+?)\]/gm; // regular expression applied on text taken from vscode editor



/**
 * 
 * @param context 
 * Funtion which checks whether extension has been activated or not
 * 
 */
async function check(context: vscode.ExtensionContext):Promise<string | undefined>{
	try{
		while(context.subscriptions.length>0){
			context.subscriptions.pop();
		}
		let answer = await vscode.window.showInformationMessage(`Extension dev-boon has not been activated 😣\nDo you want to activate it?`,"YES","NO");
		
		if(answer !== undefined && answer === "YES"){
			isExtensionActivated = 1;
			//sidebar of dev-boon extension will get activated
			vscode.commands.executeCommand("workbench.view.extension.dev-boon-sidebar-view");
			
			vscode.window.showInformationMessage(`Your extension has been activated successfully ${catSmiley} with ${isExtensionActivated} `);
			
			// difficult query gets started
			difficultQuery();

			//extension gets activated successfully
			await activate(context);
		}
		return "";
	}catch(error){
		return "";
	}
}

/**
 * 
 * @param x is a number which tells what type of action should be taken by sidebar
 * Funtion will show information on sidebar based on parameter @param x
 */
export async function showDevBoonSearchBar(x:number,message:string){
	if(x==1){
		if(sidebarProvider!==null && sidebarProvider!==undefined){
			var passTheResult:description[]=new Array(1);
			sidebarProvider.customResolveWebviewView(10,passTheResult,message);
		}
	}
	else{
		if(sidebarProvider!==null && sidebarProvider!==undefined){
			var passTheResult:description[]=new Array(1);
			sidebarProvider.customResolveWebviewView(6,passTheResult,message);
		}
	}
	
}



/**
 * 
 * @param context 
 * this method is called when your extension is activated
 * your extension is activated the very first time the command is executed
 */
export async function activate(context: vscode.ExtensionContext) {

		/**
		 * tells to register sidebar in vscode
		 */
		if(sidebarProvider===undefined){
			sidebarProvider = new SidebarProvider(context.extensionUri);
			let sideBar = vscode.window.registerWebviewViewProvider(
				"dev-boon-sidebar",
				sidebarProvider
			);
			context.subscriptions.push(sideBar);
		}
		
		/**
		 * command which deactivates extension
		 */
		let deactivateCommand = vscode.commands.registerCommand("dev-boon.DEACTIVATE_EXTENSION",()=>{
			if(isExtensionActivated === 1){
				deactivate(context); //deactivates extension
			}else{
				check(context); //checks whether a extension is activated or not
			}
		});

		context.subscriptions.push(deactivateCommand);

		/**
		 * command which helps to do custom search,both for youtube and stackoverflow
		 */
		let customSrh = vscode.commands.registerCommand('dev-boon.CUSTOM_SEARCH', async () => {
			if(isExtensionActivated === 1){
				try {
					customSearch(); //function do a custom search of youtube and stackoverflow
				}
				catch (err) {
					return;
				}
			}
			else{
				await check(context); //checks whether a extension is activated or not
			}
		});
		context.subscriptions.push(customSrh);

		/**
		 * command to activate extension
		 */
		let activateExtension = vscode.commands.registerCommand('dev-boon.ACTIVATE_EXTENSION', async () => {
			if(isExtensionActivated === 1){
				vscode.window.showInformationMessage("Extension is already Activated...");
			}
			else{
				await check(context); //checks whether a extension is activated or not
			}
		});
		context.subscriptions.push(activateExtension);


		/**
		 * command to do code summarization
		 */


		/**
		 * command which executes error query
		 */
		let errorQuery = vscode.commands.registerCommand('dev-boon.ERROR_QUERY', async () => {
			if(isExtensionActivated === 1){
				try {
					terminalCapture(); //function which captures and monitors terminal
				}
				catch (err) {
					// showDevBoonSearchBar(0);
					return;
				}
			}
			else{
				await check(context); //checks whether a extension is activated or not
			}
		});

		context.subscriptions.push(errorQuery);


		/**
		 * this commands executes completionQuery 
		 */
		let completionQuery = vscode.commands.registerCommand(`dev-boon.COMPLETION_QUERY`,async ()=>{
			try{
				if(isExtensionActivated === 1){
					let docListener = new QueryDocListener("");
					await docListener.completionQuery(); //function executes the logic of completion query
				}
				else{
					await check(context); //checks whether a extension is activated or not
				}
			}
			catch(err){
				showDevBoonSearchBar(1,"Something went wrong while execution of completion query.");
				return;
			}
		});

		context.subscriptions.push(completionQuery);



		/**
		 * this command executes snippet query
		 */
		let snippetQuery = vscode.commands.registerCommand(`dev-boon.NLP_TO_CODE`,async ()=>{
			try{
				if(isExtensionActivated === 1){
					let answer:string|undefined = await vscode.window.showInformationMessage(`Which website codeSnippets you prefer`,"stackOverFlow","geeksForgeeks");
					if((answer === undefined) || (answer!=="stackOverFlow" && answer!=="geeksForgeeks")){
						return;
					}
					let docListener = new QueryDocListener(answer);
					await docListener.documentChanged(); // executes snippet query
				}
				else{
					await check(context); //checks whether a extension is activated or not
				}
			}
			catch(err){
				showDevBoonSearchBar(1,"Something went wrong while execution of snippet query.");
				return;
			}
		});
		context.subscriptions.push(snippetQuery);


		/**
		 * this command executes a functionality which searches from stackoverflow posts based on selected text from editor
		 */
		let stackOverFlowSearchBySelectingTextFromEditor = vscode.commands.registerCommand('dev-boon.STACKOVERFLOW_SEARCH_WITH_SELECTED_TEXT', async () => {
			if(isExtensionActivated === 1){
				try {
					if(sidebarProvider!==null && sidebarProvider!==undefined){
						var passTheResult:description[]=new Array(1);
						sidebarProvider.customResolveWebviewView(3,passTheResult); //opens a sidebar
					}
					let selectedText = await getSelectedTextFromEditor(); //fetching selected Text from editor
					if(selectedText!==undefined){
						await runSearchingForStackOverFlowPosts(selectedText); // calls a function which try to search from stackoverflow posts based on selected text from editor 
					}else{
						return;
					}
				} catch (err) {
					return;
				}
			}
			else{
				await check(context); //checks whether a extension is activated or not
			}

		});
		context.subscriptions.push(stackOverFlowSearchBySelectingTextFromEditor);

		/**
		 * this command executes a functionality which searches from youtube videos based on selected text from editor
		 */
		let youTubeSearchBySelectingTextFromEditor = vscode.commands.registerCommand('dev-boon.YOUTUBE_SEARCH_WITH_SELECTED_TEXT', async () => {
			if(isExtensionActivated === 1){
				try {
					if(sidebarProvider!==null && sidebarProvider!==undefined){
						var passTheResult:description[]=new Array(1);
						sidebarProvider.customResolveWebviewView(2,passTheResult);
					}
					let selectedText = await getSelectedTextFromEditor();
					if(selectedText!==undefined){
							await runSearchingForYouTube(selectedText);
					}else{
						return;
					}
				} catch (err) {
					return;
				}
			}
			else{
				await check(context);
			}
		});
		context.subscriptions.push(youTubeSearchBySelectingTextFromEditor);
}

/**
 *  this method is called when your extension is deactivated
 */ 
export function deactivate(context: vscode.ExtensionContext) {
	isExtensionActivated = 0;
	while(context.subscriptions.length>0){
		context.subscriptions.pop();
	}
	vscode.window.showInformationMessage(`dev-boon extension has been deactivated successfully ${catSmiley} with ${isExtensionActivated}`);
}

/**
 * 
 * @returns the selected text from vscode editor
 * function which parses editor and gives only that text which is currently selected
 * 
 */
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
			console.log(editorDocument.lineAt(selectedTextLine.start));
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

	if(fetchSelectedLines.length>0){
		finalSelectedString = fetchSelectedLines[0];
		finalSelectedString = finalSelectedString.trim();
	}
	return finalSelectedString;
}

/**
 * 
 * @param selectedText 
 * Function which searches stackoverflowposts based on @param selectedText
 */

async function runSearchingForStackOverFlowPosts(selectedText:string): Promise<void>{
	if(!selectedText || selectedText.trim() === ""){
		return;
	}
	selectedText = selectedText.trim();
    vscode.window.showInformationMessage(`Initiated a StackOverFlow search with \"[${selectedText}]\" query`);

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
    	apiSearchUrl = `http://127.0.0.1:6615/Custom_StackOverFlowUrl/${encodedAPISearchTerm}`;
	}
	else{
		apiSearchUrl = `http://127.0.0.1:6615/Custom_StackOverFlowUrl/${encodedAPISearchTerm}`;
	}
    const uriOptions = {
        uri: apiSearchUrl,
        json: true,
        gzip: true,
    };
    try {

		var emptyArray:description[]=new Array(10);

		if(sidebarProvider!==null && sidebarProvider!==undefined){
			sidebarProvider.customResolveWebviewView(3,emptyArray);
		}

		console.log("Reached here...");
        const sr = await request.get(uriOptions);
		console.log("Completed here...");
		//console.log(searchResponse.0);
		let searchResponse = JSON.parse(sr);
		console.log(Object.keys(searchResponse).length);
		var mm=5;
		if(Object.keys(searchResponse).length<mm){
			mm=Object.keys(searchResponse).length;
		}
		if(mm>0){
			var pass_the_result:description[]=new Array(3);
			for(var i=0;i<mm;i++){
				console.log(searchResponse[i].question);
				console.log(searchResponse[i].AnswerText);
				console.log(searchResponse[i].AnswerCode);
				console.log(searchResponse[i].link);

				pass_the_result[i]=new description(searchResponse[i].question,searchResponse[i].AnswerText,searchResponse[i].AnswerCode,searchResponse[i].link,"");
			}
			if(sidebarProvider === undefined || sidebarProvider === null){
				//vscode.window.showErrorMessage(`sidebarProvider is ${sidebarProvider} inside stack search`);
			}
			if(sidebarProvider!==null && sidebarProvider!==undefined){
				console.log("passed 7");
				sidebarProvider.customResolveWebviewView(7,pass_the_result);
			}
		}
		else if(mm==0){
			var pass_the_result:description[]=new Array(10);
			if(sidebarProvider!==null && sidebarProvider!==undefined){
				sidebarProvider.customResolveWebviewView(4,pass_the_result);
			}
		}
    } 
	catch (error) {
		var passTheResult:description[]=new Array(10);
        if(sidebarProvider!==null && sidebarProvider!==undefined){
			sidebarProvider.customResolveWebviewView(4,passTheResult);
		}
    }
}

/**
 * 
 * @param selectedText 
 * Function which searches youtube videos based on @param selectedText
 */

async function runSearchingForYouTube(selectedText:string): Promise<void>{
	if(!selectedText || selectedText.trim() === ""){
		return;
	}
	selectedText = selectedText.trim();
    vscode.window.showInformationMessage(`Initiated a YouTube Search with \"[${selectedText}]\" query`);
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
	// const youtubeSearchUrl=`http://127.0.0.1:6615/YouTube_youtubeSearchUrl/${encodedWebSearchTerm}`;
    // const googleSearchUrl = `http://127.0.0.1:6615/YouTube_googleSearchUrl/${encodedWebSearchTerm}`;
	const uriOptions = {
        uri: youtube,
        json: true,
        gzip: true,
    };

    try {
		var emptyArray:description[]=new Array(10);

		if(sidebarProvider!==null && sidebarProvider!==undefined){
			sidebarProvider.customResolveWebviewView(2,emptyArray);
		}

		var response = await request.get(uriOptions); //api call
		let videoList = response.items;

		if (videoList && videoList.length > 0) {
            var passTheResult:description[]=new Array(10);
			var count:number=0;
            videoList.forEach((video: any) => {
                if(video.id.videoId!==undefined && video.id.videoId!==null){
					if(count<10){
						passTheResult[count]=new description(video.snippet.title,video.snippet.description,video.snippet.channelTitle ,`https://www.youtube.com/embed/${video.id.videoId}`,video.snippet.thumbnails.default.url);
					    count=count+1;
					}
				}
            });
			if(sidebarProvider === undefined || sidebarProvider === null){
				return;
			}
			if(sidebarProvider!==null && sidebarProvider!==undefined){
				sidebarProvider.customResolveWebviewView(1,passTheResult);
			}
        }
		else{
			var passTheResult:description[]=new Array(10);
			if(sidebarProvider!==null && sidebarProvider!==undefined){
				sidebarProvider.customResolveWebviewView(5,passTheResult);
			}
		}
    }
	 catch (error) {
        var passTheResult:description[]=new Array(10);
        if(sidebarProvider!==null && sidebarProvider!==undefined){
			sidebarProvider.customResolveWebviewView(5,passTheResult);
		}
    }
}


/**
 * Function which executes logic of custom search command
 */
async function customSearch(): Promise<void>{
	let options: vscode.InputBoxOptions = {
		prompt: "Label: ",
		placeHolder: "Search..."
	};

	//shows input box as search bar inorder to write query on search bar
	vscode.window.showInputBox(options).then(async value => {
		if (!value) return;
		var searchStringByUser = value;
		let answer = await vscode.window.showInformationMessage(`Which content do u want to see? query is ${searchStringByUser}`,"Youtube","StackOverFlow");
		if(answer === "StackOverFlow"){
			await runSearchingForStackOverFlowPosts(searchStringByUser);
		}
		else if(answer === "Youtube"){
			await runSearchingForYouTube(searchStringByUser);
		}
	});
}

/**
 * Function which executes code Summary logic 
 */


var terminalData="";


/**
 * function which captures and monitors vscode terminal and its data
 */
async function terminalCapture(){
	await vscode.commands.executeCommand('workbench.action.terminal.selectAll').then(async () => {
	  await vscode.commands.executeCommand('workbench.action.terminal.copySelection').then(async () => {
		await vscode.commands.executeCommand('workbench.action.terminal.clearSelection').then(async () => {
			await vscode.env.clipboard.readText().then((text)=>{
				terminalData=text;
			});
		});
	  });
	});

	//console.log(terminalData);
	console.log("************************************");
	let lines = terminalData.split("\n");
	let line:string = "";
	for(let i = 0;i<lines.length;i++){
		if(lines[i].indexOf("exception")!=-1 || lines[i].indexOf("error")!=-1 || lines[i].indexOf("Error")!=-1 || lines[i].indexOf("Exception")!=-1){
			if(lines[i].indexOf("$")==-1){
				let answer = await vscode.window.showInformationMessage(`Which content do u want to see? query is ${lines[i]}`,"Youtube","StackOverFlow");
				if(answer === "StackOverFlow"){
					await runSearchingForStackOverFlowPosts(lines[i]);
				}
				else if(answer === "Youtube"){
					await runSearchingForYouTube(lines[i]);
				}
			}
		}
	}
}



var preLine=0;
var curLine=0;
var preLineText="";

var count0=0;  // count  0 -> no action 
var count_1=0; // count -1 -> deleted
var count1=0;  // count  1 -> added
var count2=0;  // count  2 -> new line

var idle=0;

var show=0;

var queue:difficultQueryQueue[]=new Array();


/**
 * Function which executes notification system of this extension
 */

function difficultQuery(){
	var terminal=vscode.window.activeTerminal;
	var editor = vscode.window.activeTextEditor;
	if(!editor){
		return;
	}
	curLine=editor.selection.active.line;
	var curLineText=editor.document.lineAt(editor.selection.active.line).text;
	if(queue.length==50){
		var x=queue[0].OperationType;
		if(x==-1){
			count_1--;
		}
		else if(x==1){
			count1--;
		}
		else if(x==2){
			count2--;
		}
		else{
			count0--;
		}
		queue.shift();
	}
	if(curLine==preLine){
		if(curLineText!==preLineText){
			if(curLineText.length>preLineText.length){
				// ADDED
				var node=new difficultQueryQueue(1);
				queue.push(node);
				count1++;
			}
			else{
				// DELETED
				var node=new difficultQueryQueue(-1);
				queue.push(node);
				count_1++;
			}
		}
		else{
			// DID NOTHING
			var node=new difficultQueryQueue(0);
			queue.push(node);
			count0++;
		}
	}
	else{
		// WENT TO NEW LINE
		var node=new difficultQueryQueue(2);
		queue.push(node);
		count2++;	
	}
	if((count_1/count1)>0.65 && (count_1+count1>=40)){
		if(show==0){
			if(sidebarProvider!==null && sidebarProvider!==undefined){
				let x=new summary("Looks like You are struck.Please take the help of our Extension");
				sidebarProvider.customResolveWebviewViewS(1,x);
			}
			show=1;
		}
	}
	else{
		if(show==1){
			if(sidebarProvider!==null && sidebarProvider!==undefined){
				var passTheResult:description[]=new Array(10);
				sidebarProvider.customResolveWebviewView(10,passTheResult);
			}
			show=0;
		}
	}
	if(count0>=49){
		idle++;
		if(idle%300==0){
			vscode.window.showInformationMessage("Looks Like You are Struck. Take help of our DEV-BOON extension to maximise your productivity.");
			idle=0;
		}
	}
	else{
		idle=0;
	}
	setTimeout(difficultQuery, 1000);
	preLine=curLine;
	preLineText=curLineText;
}
