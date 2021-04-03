import * as request from "request-promise-native";
import * as vscode from 'vscode';	
import {SidebarProvider} from './sidebarProvider';
import {description} from "./description";
import {summary} from "./summary";
import {ErrorMessageParser} from './model/errorQuery/ErrorMessageParser';
import {ErrorMessage} from './model/errorQuery/ErrorMessage';
import {difficult_query_queue} from './difficult_query_queue';
import {error_query} from './error_query';
import {QueryDocListener} from './model/nlpToCode/QueryDocListener';
import { promises } from "node:fs";
import {
    IPCMessageReader, IPCMessageWriter, createConnection, IConnection, TextDocuments, TextDocument, 
    Diagnostic, DiagnosticSeverity, InitializeResult, TextDocumentPositionParams, CompletionItem, 
    CompletionItemKind
} from 'vscode-languageserver';
import { listenerCount } from "node:events";
import { Console } from "node:console";
import * as ChildProcess from 'child_process';
import * as FS from 'fs';
import { DateTime } from 'luxon';
import * as Net from 'net';
import * as Path from 'path';
import { LanguageClientOptions, StreamInfo } from 'vscode-languageclient';
import { SonarLintExtendedLanguageClient } from './client';
import { Commands } from './commands';
import {
	hideSecurityHotspot,
	HotspotsCodeActionProvider,
	hotspotsCollection,
	showHotspotDescription,
	showSecurityHotspot
  } from './hotspots';
  import { getJavaConfig, installClasspathListener } from './java';
  import { LocationTreeItem, navigateToLocation, SecondaryLocationsTree } from './locations';
  import * as protocol from './protocol';
  import { installManagedJre, JAVA_HOME_CONFIG, RequirementsData, resolveRequirements } from './requirements';
  import { computeRuleDescPanelContent } from './rulepanel';
  import { AllRulesTreeDataProvider, ConfigLevel, Rule, RuleNode } from './rules';
  import { code2ProtocolConverter, protocol2CodeConverter } from './uri';
  import * as util from './util';


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

let isExtensionActivated = 0; // 0 means that initially ,it is deactivated
let queryUnderProcess = 0; // 0 means that api call is under process
let searchText:string|undefined = "";
var terminal_array:string[]=new Array("Terminal");// Store terminal text so that we dont repeatedly search them

var catSmiley = String.fromCodePoint(0X0001F638);
const regex = /\[(.+?)\]/gm;

const DOCUMENT_SELECTOR = [
	{ scheme: 'file', language: 'java' },
	{ scheme: 'file', language: 'python' },
];


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
			difficult_query();// START DIFFICULT QUERY
			await activate(context);
		}else if(answer === "NO"){
			//vscode.window.showErrorMessage("Sorry to hear that 😣");
		}else{
			//vscode.window.showWarningMessage("Bug found,Something went wrong 😣");
		}
		return "";
	}catch(error){
		//vscode.window.showErrorMessage(`Error is ${error.message}`);
		return "";
	}
}

export async function show_dev_boon_side_bar(x:number){
	if(x==1){
		if(sidebarProvider!==null && sidebarProvider!==undefined){
			var pass_the_result:description[]=new Array(1);
			sidebarProvider.customResolveWebviewView(10,pass_the_result);
		}
	}
	else{
		if(sidebarProvider!==null && sidebarProvider!==undefined){
			var pass_the_result:description[]=new Array(1);
			sidebarProvider.customResolveWebviewView(6,pass_the_result);
		}
	}
	
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
		if(sidebarProvider===undefined){
			//vscode.window.showErrorMessage(`bug is their`);
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
		let CustomSearch = vscode.commands.registerCommand('dev-boon.CUSTOM_SEARCH', async () => {
			if(isExtensionActivated === 1){
				try {
					custom_search();
				}
				catch (err) {
					//vscode.window.showErrorMessage("Some Error occured while searching stackOverFlow posts 😣.Please try again");
				}
			}
			else{
				await check(context);
			}
		});
		context.subscriptions.push(CustomSearch);
		let Activate_Extension = vscode.commands.registerCommand('dev-boon.ACTIVATE_EXTENSION', async () => {
			if(isExtensionActivated === 1){
				// Do nothing
				vscode.window.showInformationMessage("Extension is already Activated...");
			}
			else{
				await check(context);
			}
		});
		context.subscriptions.push(Activate_Extension);

		let Code_Summary = vscode.commands.registerCommand('dev-boon.CODE_SUMMARY', async () => {
			if(isExtensionActivated === 1){
				try {
					code_summary();
				}
				catch (err) {
					//vscode.window.showErrorMessage("Some Error occured while searching stackOverFlow posts 😣.Please try again");
				}
			}
			else{
				await check(context);
			}
		});


		

		context.subscriptions.push(Code_Summary);


		let Error_Query = vscode.commands.registerCommand('dev-boon.ERROR_QUERY', async () => {
			if(isExtensionActivated === 1){
				try {
					terminal_capture();
				}
				catch (err) {
					//vscode.window.showErrorMessage("Some Error occured while searching stackOverFlow posts 😣.Please try again");
				}
			}
			else{
				await check(context);
			}
		});

		context.subscriptions.push(Error_Query);




		let NlpToCode = vscode.commands.registerCommand(`dev-boon.NLP_TO_CODE`,async ()=>{
			try{
				if(isExtensionActivated === 1){
					let docListener = new QueryDocListener();
					console.log("inside NLP function");
					await docListener.documentChanged();
				}
				else{
					await check(context);
				}
			}
			catch(err){
				//vscode.window.showErrorMessage("Something went wrong while searching for Stackoverflow posts 😣");
			}
		});



		
		context.subscriptions.push(NlpToCode);

		let EnterCommand = vscode.commands.registerCommand(`dev-boon.ENTER`,async ()=>{
			try{
				if(isExtensionActivated === 1){
					// let docListener = new QueryDocListener();
					// console.log("inside NLP function");
					// await docListener.documentChanged();
					custom_search();
					
				}
				else{
					await check(context);
				}
			}
			catch(err){
				//vscode.window.showErrorMessage("Something went wrong while searching for Stackoverflow posts 😣");
			}
		});




		context.subscriptions.push(EnterCommand);



		let stackOverFlowSearchBySelectingTextFromEditor = vscode.commands.registerCommand('dev-boon.STACKOVERFLOW_SEARCH_WITH_SELECTED_TEXT', async () => {
			if(isExtensionActivated === 1){
				try {
					if(sidebarProvider!==null && sidebarProvider!==undefined){
						var pass_the_result:description[]=new Array(1);
						sidebarProvider.customResolveWebviewView(3,pass_the_result);
					}
					let selectedText = await getSelectedTextFromEditor();
					

					console.log(selectedText);
					

					if(selectedText!==undefined){
						//vscode.window.showInformationMessage(`Working fine with ${isExtensionActivated}`);
						// if(queryUnderProcess === 0){
							await runSearchingForStackOverFlowPosts(selectedText);
						// }
						
					}else{
						//vscode.window.showErrorMessage("Something went Wrong 😣");
					}
	
				} catch (err) {
					//vscode.window.showErrorMessage("Some Error occured while searching stackOverFlow posts 😣.Please try again");
				}
			}
			else{
				await check(context);
			}

		});

		context.subscriptions.push(stackOverFlowSearchBySelectingTextFromEditor);


		let youTubeSearchBySelectingTextFromEditor = vscode.commands.registerCommand('dev-boon.YOUTUBE_SEARCH_WITH_SELECTED_TEXT', async () => {
			if(isExtensionActivated === 1){
				try {
					if(sidebarProvider!==null && sidebarProvider!==undefined){
						var pass_the_result:description[]=new Array(1);
						sidebarProvider.customResolveWebviewView(2,pass_the_result);
					}
					let selectedText = await getSelectedTextFromEditor();
					if(selectedText!==undefined){
						//vscode.window.showInformationMessage(`Working fine with ${isExtensionActivated}`);
						// if(queryUnderProcess === 0){
							await runSearchingForYouTube(selectedText);
						// }
					}else{
						//vscode.window.showErrorMessage("Something went Wrong 😣");
					}
				} catch (err) {
					//vscode.window.showErrorMessage("Some Error occured while searching youTube videos 😣.Please try again");
				}
			}
			else{
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

function getLatestErrorMessageFromTerminal(): string|undefined{
	return "";
	
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
		// console.log("bug");

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
	console.log(fetchSelectedLines);
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
		console.log(tags);
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
    try {

		var emptyArray:description[]=new Array(10);

		if(sidebarProvider!==null && sidebarProvider!==undefined){
			sidebarProvider.customResolveWebviewView(3,emptyArray);
		}

		console.log("Reached here...");
        const searchResponse = await request.get(uriOptions);
		console.log("Completed here...");
		//vscode.window.showInformationMessage(`stack api has responded with ${searchResponse}`);
		console.log(searchResponse);
		let test = getLatestErrorMessageFromTerminal();
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
				//vscode.window.showErrorMessage(`sidebarProvider is ${sidebarProvider} inside stack search`);
			}
			if(sidebarProvider!==null && sidebarProvider!==undefined){
				sidebarProvider.customResolveWebviewView(0,pass_the_result);
			}
        }
		else{
			var pass_the_result:description[]=new Array(10);
			if(sidebarProvider!==null && sidebarProvider!==undefined){
				sidebarProvider.customResolveWebviewView(4,pass_the_result);
			}
		}
    } 
	catch (error) {
		var pass_the_result:description[]=new Array(10);
        if(sidebarProvider!==null && sidebarProvider!==undefined){
			sidebarProvider.customResolveWebviewView(4,pass_the_result);
		}
    }
}
// function getStringOutOfTagList(tags:string[]): string{
// 	let result = "";

// 	tags.forEach((str)=>{
// 		result+=str;
// 		result+=" ";
// 	});
//         //vscode.window.showErrorMessage(`ErrorIPCMessageReader
// 	};
// 	//vscode.window.showInformationMessage(`Resultant string is: ${result}`);
// 	// return result;

// }
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
	const youtubeSearchUrl=`http://127.0.0.1:6615/YouTube_youtubeSearchUrl/${encodedWebSearchTerm}`;
    const googleSearchUrl = `http://127.0.0.1:6615/YouTube_googleSearchUrl/${encodedWebSearchTerm}`;
	const uriOptions = {
        uri: youtube,
        json: true,
        gzip: true,
    };

	// await terminal_capture();
	
    try {
		var emptyArray:description[]=new Array(10);

		if(sidebarProvider!==null && sidebarProvider!==undefined){
			sidebarProvider.customResolveWebviewView(2,emptyArray);
		}
		console.log(searchText);
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
				//vscode.window.showErrorMessage(`sidebarProvider is ${sidebarProvider} inside youtube search`);
			}
			if(sidebarProvider!==null && sidebarProvider!==undefined){
				sidebarProvider.customResolveWebviewView(1,pass_the_result);
			}
        }
		else{
			var pass_the_result:description[]=new Array(10);
			if(sidebarProvider!==null && sidebarProvider!==undefined){
				sidebarProvider.customResolveWebviewView(5,pass_the_result);
			}
		}
    }
	 catch (error) {
        var pass_the_result:description[]=new Array(10);
        if(sidebarProvider!==null && sidebarProvider!==undefined){
			sidebarProvider.customResolveWebviewView(5,pass_the_result);
		}
    }
}
async function custom_search(): Promise<void>{
	let options: vscode.InputBoxOptions = {
		prompt: "Label: ",
		placeHolder: "Search..."
	}
	vscode.window.showInputBox(options).then(async value => {
		if (!value) return;
		var search_string_by_user = value;
		let answer = await vscode.window.showInformationMessage(`Which content do u want to see? query is ${search_string_by_user}`,"Youtube","StackOverFlow");
		if(answer === "StackOverFlow"){
			await runSearchingForStackOverFlowPosts(search_string_by_user);
		}
		else if(answer === "Youtube"){
			await runSearchingForYouTube(search_string_by_user);
		}
	});
}


async function code_summary(): Promise<void> {
	var editor = vscode.window.activeTextEditor;
	if (!editor) {
		return; // No open text editor
	}
	var lines = editor.document;
	var entire_code="";
	for(var i=0;i<=lines.lineCount - 1;i++){
		entire_code+=lines.lineAt(i).text.toString();
		entire_code+="@NEWLINE@";
	}
	entire_code=entire_code.replace(/\//gi,"@BY@");
	entire_code=entire_code.replace(/#/gi,"@HASH@");
	const summ=`http://127.0.0.1:6615/Code_Summary/${entire_code}`;
	const uriOptions = {
        uri: summ,
        json: true,
        gzip: true,
    };
	var response = await request.get(uriOptions);
	let sum = response.summary;
	let x=new summary(sum);
	if(sidebarProvider!==null && sidebarProvider!==undefined){
		sidebarProvider.customResolveWebviewViewS(1,x);
	}
}

var terminal_data="";

async function terminal_capture(){
	await vscode.commands.executeCommand('workbench.action.terminal.selectAll').then(async () => {
	  await vscode.commands.executeCommand('workbench.action.terminal.copySelection').then(async () => {
		await vscode.commands.executeCommand('workbench.action.terminal.clearSelection').then(async () => {
			await vscode.env.clipboard.readText().then((text)=>{
				terminal_data=text;
			});
			
		});


	  });
	});

	
	let line:string = "";
	for(let i = 0;i<terminal_data.length;i++){
		
		if(terminal_data[i] === " "){
			// console.log("yes");
			line = line.trim();
			console.log(line);
			var check=1;
			if(line.length === 0){
				continue;
			}
			if(line.indexOf('java')!=-1){
				if(line.indexOf('error')==-1 && line.indexOf('exception')==-1){
					check=0;
				}
			}
			// for(var j=0;j<terminal_array.length;j++){
			// 	if(terminal_array[j]==line){
			// 		check=0;
			// 		break;
			// 	}
			// }
			if(check){
				terminal_array.push(line);
				var send_to_error_query:error_query=new error_query();
				var finalParsedString='';
				finalParsedString=await send_to_error_query.give_final_parsed_string(line);
				console.log(finalParsedString);
				if(finalParsedString!=='none'){
					let answer = await vscode.window.showInformationMessage(`Which content do u want to see? query is ${finalParsedString}`,"Youtube","StackOverFlow");
					if(answer === "StackOverFlow"){
						await runSearchingForStackOverFlowPosts(finalParsedString);
					}
					else if(answer === "Youtube"){
						await runSearchingForYouTube(finalParsedString);
					}
					// let answer = await vscode.window.showInformationMessage(`Which content do u want to see? query is ${finalParsedString}`,"StackOverFlow","Youtube");
					// if(answer === "StackOverFlow"){
					// 	await runSearchingForStackOverFlowPosts(finalParsedString);
					// }
					// else if(answer === "Youtube"){
					// 	await runSearchingForYouTube(finalParsedString);
					// }
				}
			line = "";
		}
	}
	else{
		// console.log("bye");
		line+=terminal_data[i];
	}
}

console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&");
	console.log(terminal_data);
	console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&");
}

var pre_line=0;
var cur_line=0;
var pre_line_text="";

var count0=0;  // count  0 -> no action 
var count_1=0; // count -1 -> deleted
var count1=0;  // count  1 -> added
var count2=0;  // count  2 -> new line

var idle=0;

var show=0;

var queue:difficult_query_queue[]=new Array();

function difficult_query(){
	var terminal=vscode.window.activeTerminal;
	var editor = vscode.window.activeTextEditor;
	if(!editor){
		return;
	}
	cur_line=editor.selection.active.line;
	var cur_line_text=editor.document.lineAt(editor.selection.active.line).text;
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
	if(cur_line==pre_line){
		if(cur_line_text!==pre_line_text){
			if(cur_line_text.length>pre_line_text.length){
				// ADDED
				var node=new difficult_query_queue(1);
				queue.push(node);
				count1++;
			}
			else{
				// DELETED
				var node=new difficult_query_queue(-1);
				queue.push(node);
				count_1++;
			}
		}
		else{
			// DID NOTHING
			var node=new difficult_query_queue(0);
			queue.push(node);
			count0++;
		}
	}
	else{
		// WENT TO NEW LINE
		var node=new difficult_query_queue(2);
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
				var pass_the_result:description[]=new Array(10);
				sidebarProvider.customResolveWebviewView(10,pass_the_result);
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
	setTimeout(difficult_query, 1000);
	pre_line=cur_line;
	pre_line_text=cur_line_text;
}