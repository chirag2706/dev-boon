import * as vscode from 'vscode';
import {InputHandler} from './InputHandler';


export class Activator{
    /*
	 *  Constructor.
	 *  Initializes defaults for document listeners, loads the list of tasks from the local database, and
	 *  saves the Google Custom Search engine defaults to a preferences file.
	 */

    constructor(){
        let activeEditor = vscode.window.activeTextEditor;
        if(activeEditor === null || activeEditor === undefined){
            return "";
        }
        let editorDocument = activeEditor.document;
        // editorDocument.

    }
}