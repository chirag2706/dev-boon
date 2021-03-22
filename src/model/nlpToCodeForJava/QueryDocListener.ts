import { get } from 'node:https';
import { off } from 'node:process';
import { start } from 'node:repl';
import * as vscode from 'vscode';

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
    "\"":9
};

/**
 * class QueryDocListener
 *   Implements the required functionality to conduct code snippet queries by listening
 *    to document changes for a user to type a query in the format: ?{query}? and too only in comments
 */

export class QueryDocListener{
    

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

        console.log(`resultantQuery is ${resultantQuery}`);

        return [resultantQuery,offset[0]+countOfNewLines];
    }


    /*
		 * Function executeQuery
		 *   Extracts a query from the current line the cursor is on, and performs that query to retrieve
		 *   top code snippets for that query.
		 *   String line - the text in the current line that contains the query.
	*/

    executeQuery(query:string,offset:any){
        let out = query.match("[abcdefghijklmnopqrstuvwxyz ]*");
        if(out!==null && out.length === 0){
            return -1;
        }else if(out === null){
            return -1;
        }

        //offset means currentLine no of query

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
        // This is the part of the code where we format the event (encounter a ? xxx ? this will format and isolate
		// query in 'line' and search for code snippets using query.
        let selectedText=this.getSelectedTextFromEditor();
        
        let insertion = selectedText[0];
        let offset = selectedText[1];

        //now check whether selected text contains a single query in format ?{query}?
        if(insertion!==undefined&&insertion.length>2){
            let array = this.extractQueryFromInsertion(insertion,offset);
            let query = array[0];
            offset = array[1];
            if(query.length>0){
                this.executeQuery(query,offset);
            }
        }




    }


};