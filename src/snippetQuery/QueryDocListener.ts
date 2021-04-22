import { get } from 'node:https';
import { off } from 'node:process';
import { start } from 'node:repl';
import * as vscode from 'vscode';
import {Searcher} from './Searcher';
import {SidebarProvider} from '../sidebarProvider';
import {description} from "../description";
import {summary} from "../summary";
import * as extension from '../extension';
import * as request from "request-promise-native";

var operatorsToBeRemoved = {
    "[":0,
    "]":1,
    "(":2,
    ")":3,
    "{":4,
    "}":5,
    ":":6,
    ";":7,
    "\'":8,
    "\"":9,
    "?":10
};

/**
 * class QueryDocListener
 *   Implements the required functionality to conduct code snippet queries by listening
 *    to document changes for a user to type a query in the format: ?{query}? and too only in comments
 */

export class QueryDocListener{

    //insertion contexts depending on user's cursor
	//some features would need to be tackled differently depending on context
	//we mostly just handle inserting inside a function for now

    static queryString:string = "";

    type: string;

    constructor(type:string){
        this.type = type;
    }
	
    

    //function which parses editor and gives only that text which is currently selected
    getSelectedTextFromEditor(): any[]{
        let activeEditor = vscode.window.activeTextEditor;

        if(activeEditor === null || activeEditor === undefined){
            return [""];
        }

        let editorDocument = activeEditor.document;

        let finalSelectedString = "";

        let eol = "\n";

        if(editorDocument.eol !==1){
            eol = "\r\n";
        }
        let fetchSelectedLines: string[] = [];
        let offset:any = [];
        activeEditor.selections.forEach((selectedTextLine)=>{
            if(offset.length === 0){
                offset.push(editorDocument.lineAt(selectedTextLine.start).lineNumber);
                offset.push(editorDocument.lineAt(selectedTextLine.end).lineNumber);
            }else{
                offset[1] = editorDocument.lineAt(selectedTextLine.end).lineNumber;
            }
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
        return [finalSelectedString,offset];
    }



    removeExtraOperators(text:string){
        let query = "";

        for(let i=0;i<text.length;i++){
            if(!(text[i] in operatorsToBeRemoved)){
                query+=text[i];
            }
        }

        return query;

    }


    /*
		 * Function extractQueryFromInsertion
		 *   Retrieves the text on the current line the text edit cursor is on.
		 *   
		 *   Returns: String - The line of text for the line the cursor is on.
	*/

    extractQueryFromInsertion(text:string,offset:any[]){
        let resultantQuery:string = "";
        let startIndex = -1;
        let endIndex = -1;

        let countOfNewLines = 0;

        for(let i=0;i<text.length;i++){

            if(text[i] === '\n'){
                countOfNewLines++;
            }

            if(startIndex===-1){
                if(text[i] === '?'){
                    startIndex = i;
                }
            }else{
                if(text[i] === '?'){
                    endIndex = i;
                    break;
                }
            }
        }


        if(startIndex!==-1 && endIndex!==-1){
            resultantQuery = text.substr(startIndex,endIndex-startIndex+1);
        }


        resultantQuery = this.removeExtraOperators(resultantQuery);
        resultantQuery = resultantQuery.trim();
        resultantQuery = resultantQuery.toLowerCase();

        return [resultantQuery,offset[0]+countOfNewLines];
    }


    /*
		 * Function executeQuery
		 *   Extracts a query from the current line the cursor is on, and performs that query to retrieve
		 *   top code snippets for that query.
		 *   String line - the text in the current line that contains the query.
	*/

    async executeQuery(query:string,offset:any){
        try{
            let out = query.match("[abcdefghijklmnopqrstuvwxyz ]*");
            if(out!==null && out.length === 0){
                extension.showDevBoonSearchBar(1,"Something went wrong while execution of snippet query.");
                return -1;
            }else if(out === null){
                extension.showDevBoonSearchBar(1,"Something went wrong while execution of snippet query.");
                return -1;
            }
    
            //offset means currentLine no of query
    
            //Now Convert The Stack Overflow thread IDs to specific post URLs.
            let result = Searcher.getThreads(query,this.type);    
            if((await result).length === 0){
                extension.showDevBoonSearchBar(1,"Something went wrong while execution of snippet query.");
                return -1;
            }
    
            let urls = [];
    
            for(let i=0;i<(await result).length;i++){
                if(i === Searcher.NUM_URLS){
                    break;
                }
                urls.push((await result)[i]);
            }
    
            let code = await Searcher.getCodeSnippets(urls,this.type);
            if(code === null || code === undefined||code.length === 0){
                extension.showDevBoonSearchBar(1,"Something went wrong while execution of snippet query.");
                return -1;
            }

            let mostValidSnippet = code[code.length-1]["code"];

            QueryDocListener.writeOnVscodeEditor(mostValidSnippet);
    
            extension.showDevBoonSearchBar(1,"Snippet query has been executed successfully.");
        }
        catch(err){
            extension.showDevBoonSearchBar(1,"Something went wrong while execution of snippet query.");
            vscode.window.showErrorMessage(err.message);
        }
    }


    /**
     * 
     * @param mostValidSnippet 
     * Function which write the valid code snippet on vscode editor based on either selected text or based on current position of cursor
     */
    static writeOnVscodeEditor(mostValidSnippet:string){
        //now ,we need to print that code on offset+1 line number
        let activeEditor = vscode.window.activeTextEditor;

        if(activeEditor){
            const selection = activeEditor.selection;
            
            //edits only if something is selected in editor
            //can be improved by finding current location of cursor

            // activeEditor.selections
            // check if there is no selection
            if (activeEditor.selection.isEmpty) {
                // the Position object gives you the line and character where the cursor is
                const position = activeEditor.selection.active;
                activeEditor.edit(editBuilder=>{
                    editBuilder.replace(position,mostValidSnippet);
                });
            }else{
                activeEditor.edit(editBuilder=>{
                    editBuilder.replace(selection,mostValidSnippet);
                });
            }
        }
    }

    /**
     * 
     * @param code 
     * @returns quality of a particular code snippet
     * Function which measures quality of code snippet
     */

    /**
         * This algorithm was implemented in Release 2 of this tool
         *  
         * logic: We will be differentiating our code based on 3 different models and all these models are regression models
         * 
         * The three models are :
         * 1.)Organic model
         * 2.)Semi-detached model
         * 3.)Embedded model
         * 
         * some coefficients are decided for three different types of models based on regression model.
         * Each model will use 4 coefficients inorder to find quality of code snippet
         * 
         * Actual thought process: Code snippets will be first sorted based on upvotes(fetched from stackoverflow website and people votes)
         * After minimizing the number of code snippets,we will be analyzing each snippet based on COCOMO model to determine best code snippet  
         * 
    */
    static measureQuality(code:string){
        /**
         * these are parameters which have been calculated from regression model
         * So,don't think that these parameters are static or hard coded.These parameters have been calculated from regression Ml algorithm
         * We have just used parameters instead of whole ML algorithm ,just to increase speed of this function
         */
        let tableOfCoefficients = [[2.4,1.05,2.5,0.38],[3.0,1.12,2.5,0.35],[3.6,1.20,2.5,0.32]]; 
        let currLen:number = 0;

        //indicates type of model
        let modelType:number = 0;

        let effort = 0;
        let time = 0;

        let codeQuality = 0;

        let currentCodeQuality = -1;
        currLen = code.length;
            
            
        if(currLen>=2 && currLen<=50){
            modelType = 0;
        }else if(currLen>50 && currLen <=300){
            modelType = 1;
        }else if(currLen>300){
            modelType = 2;
        }


        effort  = tableOfCoefficients[modelType][0]*(Math.pow(currLen,tableOfCoefficients[modelType][1]));
        time = tableOfCoefficients[modelType][2]*(Math.pow(effort,tableOfCoefficients[modelType][3]));

        currentCodeQuality = effort/time;
        
        return currentCodeQuality;
    }
    /*
		 * Function documentChanged
		 *   Function that activates every time the current edited document is changed.
		 *   
		 *   Simply put, this document listener listens for ?{query}? format queries in the document,
		 *   and conducts a query whenever this format is identified in the document.
		 *   This allows for easy query-making without using any external buttons or widgets.
	*/

    documentChanged(){
        extension.showDevBoonSearchBar(0,"");
        // This is the part of the code where we format the event (encounter a ? xxx ? this will format and isolate
		// query in 'line' and search for code snippets using query.
        let selectedText=this.getSelectedTextFromEditor();
        
        let insertion = selectedText[0];
        let offset = selectedText[1];

        //now check whether selected text contains a single query in format ?{query}?
        if(insertion!==undefined&&insertion.length>2){
            let array = this.extractQueryFromInsertion(insertion,offset);
            let query = array[0];
            QueryDocListener.queryString = query;
            offset = array[1];
            if(query.length>0){
                this.executeQuery(query,offset);
            }
        }
        
    }



    /*
		 * Function completionQuery
		 *   Function that helps to interact with GPT-2-medium model inorder to complete code
	*/


    async completionQuery(){
        extension.showDevBoonSearchBar(0,"");
        
        try{
            let selectedText=await this.getSelectedTextFromEditor(); //query
            let lang = await Searcher.findFileType(); //file type 
            if(lang !== "python3" && lang!== "java"){
                extension.showDevBoonSearchBar(1,"Completion Query works only on python and java code snippets");
                vscode.window.showErrorMessage("Completion Query works only on python and java code snippets");
                return "";
            }
            let url = `http://127.0.0.1:6615/CompletionQuery/${lang}/${selectedText[0]}`;
            const uriOptions = {
                uri: url,
                json: true,
                gzip: true,
            };

            const searchResponse = await request.get(uriOptions);
            console.log(searchResponse);

            await QueryDocListener.writeOnVscodeEditor(searchResponse["snippets"]);

            extension.showDevBoonSearchBar(1,"Completion Query has been executed successfully");
        }catch(err){
            extension.showDevBoonSearchBar(1,"Something went wrong while execution of completion query.");
            vscode.window.showErrorMessage("Something Went Wrong!!!");
            return;
        }
        
    }
};