import * as vscode from 'vscode';
import {Snippet} from "./code/Snippet";
import {Fragment} from "./code/Fragment";
import { off } from 'node:process';

/**
 * The DocHandler class includes functionality for modifying IDocuments and handling other workspace interactions.
 */
export class DocHandler{
    //the current documents abstract syntax tree
    static documentAST:any = null;
    //the global parser for java
    static javaParser:any = null;
    //documents current import statements
    static imports:string[] = [];
    //documents current import offset
    static importStart:number = -1;

    static replacing:boolean = false;
    static fileName:string = "";
    static currentEditor:any = null;

    /**
	 * Clear the cache on document change.
	 */

    static documentChanged(){
        DocHandler.imports = [];
        DocHandler.importStart = -1;
        DocHandler.fileName = "";
        DocHandler.documentAST = null;
        DocHandler.currentEditor = null;
    }

    /**
	 * Function to add a Snippet to the current document.
	 */

    static addSnippet(comment:string,snippet:Snippet,offset:number,length:number){
        let fragments = snippet.getNumFragments();
        let document = DocHandler.getDocument();
        if(document === null){
            return;
        }

        for(let i=fragments-1;i>=0;i--){
            let currentFragment:Fragment = snippet.getFragment(i);
            //add imports to top

            if(currentFragment.getType() === Fragment.IMPORTS){
                if(currentFragment.size()>=1){
                    let rep:string = "";
                    try{
                        let numberOflines = document.lineCount;
                        let pos1 = new vscode.Position(0,0);
                        let pos2 = new vscode.Position(max(0,offset-1),0);
                        let pos3 = new vscode.Position(offset+length,0);
                        let pos4 = new vscode.Position(numberOflines,0);
                        DocHandler.importStart = DocHandler.getImportOffset(document.getText(new vscode.Range(pos1,pos2))+document.getText(new vscode.Range(pos3,pos4)));
                    }catch(err){
                        console.log("Some error occured in addSnippet function in DocHandler.ts file");
                    }
                    //if the document has imports remove any duplicates
                    if(DocHandler.imports.length>0){
                        for(let j=0;j<DocHandler.imports.length;j++){
                            currentFragment.deleteLineContaining(DocHandler.imports[j].trim());
                        }
                        rep = currentFragment.getFormattedCode();
                    }else{
                        rep = currentFragment.getFormattedCode()+"\n";
                    }

                    //add imports
                    DocHandler.replace(rep,DocHandler.importStart,0);

                    


                }
            }

            //insert snippet at offset

            if(currentFragment.getType() === Fragment.SNIPPET){
                let rep = comment+currentFragment.getFormattedCode();
                DocHandler.replace(rep,offset,length);
                DocHandler.updateOffset(rep);
            }
        }
    }


    /**
	 * Adds to the current offset, the beginning of given string.
	 */


    static async updateOffset(rep:string){
        try{
            console.log("No bug came in updateOffset method in DocHandler.ts file\n");
        }catch(err){
            console.log("Some bug came in updateOffset method in DocHandler.ts file\n");
        }
    }



    /**
	 * Replaces range with given String.
	 */
    static async replace(rep:string,offset:number,length:number){
        try{
            DocHandler.replacing = true;
            let document  =DocHandler.getDocument();
            if(document === null){
                return;
            }
            let activeEditor = vscode.window.activeTextEditor;
            if(activeEditor === null || activeEditor === undefined){
                console.log("ActiveEditor has been undefined or null in replace method in DocHandler.ts");
                return;
            }

            //small bug is their which needs to be fixed
            const position = new vscode.Position(offset,0);
            activeEditor.edit(editBuilder=>{
                editBuilder.replace(position,rep);
            });
            DocHandler.replacing=false;
            return;

        }catch(err){
            DocHandler.replacing=false;
            console.log("Some bug is their in replace method in DocHandler.ts file\n");
            return;
        }
    }

    static getImportOffset(surrounding:string){

        if(DocHandler.importStart!==-1){
            return DocHandler.importStart;
        }
        if(surrounding.length === 0){
            let document = DocHandler.getDocument();
            if(document!==null && document!==undefined){
                surrounding = document.getText();
            }
        }
        let ast = null;
        DocHandler.importStart = 0;
        if(DocHandler.documentAST!==null){
            ast = DocHandler.documentAST;
        }else{
            if(DocHandler.javaParser === null){
                DocHandler.initializeJavaParser();
                // DocHandler.javaParser
            }
            //taking rest,will do after eating food
            // DocHandler.javaParser
        }

        return DocHandler.importStart;
    }


    /**
	 * Initializes the Eclipse ASTParser.
	 */

    static initializeJavaParser(){
        DocHandler.javaParser = "";
    }
    


    /**
	 * Returns the active document, otherwise null.
	 */

    static getDocument(){
        let activeEditor=vscode.window.activeTextEditor;
        if(activeEditor === null || activeEditor === undefined){
            return null;
        }

        let editorDocument = activeEditor.document;
        if(editorDocument === null || editorDocument === undefined){
            return null;
        }
        return editorDocument;
    }





}

function max(arg0: number, arg1: number): number {
    if(arg0>=arg1){
        return arg0;
    }
    return arg1;
}
