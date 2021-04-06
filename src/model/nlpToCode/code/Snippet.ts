import * as vscode from 'vscode';
import {Fragment} from './Fragment';
import {DocHandler} from "../DocHandler";

/**
 * A snippet object represents a piece of code to be inserted into the user's editor.
 * A snippet is separated into a list of Fragment objects, when a snippet contains
 * segments that need to be integrated at different locations. By default, import
 * statements will be separated into their own fragment during creation. The first
 * fragment in the list always represents the import block, even if a snippet has
 * no associated imports.
 * 
 * The previous implementation simply had a separate list for imports, but hopefully
 * this new representation is more easily extended.
 * 
 * The fragment list should be in order of position: imports -> fields -> snippets -> methods -> classes.
 * 
 * There should only ever be one snippet type fragment.
 * 
 */


export class Snippet{
    //Code, as a list of fragments
    code:Fragment[] = [];
    //Thread ID
    ID:number = -1;
    //Cached size
    size:number = -1;
    //cached LOC
    LOC:number = -1;
    //cached errors
    errors:number = -1;
    //cached tests
    passedTests:number = -1;
    //cached AST
    ast:any = null;

    /**
	 * Constructs a snippet object from a String of code;
	 * @param code The code to store in this snippet.
	 * @param ID The snippet's thread ID.
	 */

    constructor(code:string,ID:number){
		this.ID = ID;
		this.constructFragments(code);
	}


    /**
     * Acts as a copy constructor
     *
     */

    SnippetTakesSnippet(that:Snippet){
        let newSnippet = new Snippet("",that.ID);
        newSnippet.ast = that.ast;
        newSnippet.passedTests = that.passedTests;
		newSnippet.errors = that.errors;
		newSnippet.LOC = that.LOC;
		newSnippet.size = that.size;
        for(let i=0;i<that.code.length;i++){
            newSnippet.code.push(Fragment.FragmentTakingFragment(that.code[i]));
        }
        return newSnippet;
    }

    /**
	 * Formats a String of code into our fragment representation.
	 * @param code The code to process.
	 */

    constructFragments(codeString:string){
        //all snippets by default have these sections, even if there are no imports
        let imports = new Fragment(Fragment.IMPORTS);
        let body = new Fragment(Fragment.SNIPPET);



        try{
            //read string
            let currentLine = "";
            let currIdx = 0;
            //assuming that code,Stringwhich will be fetched from vscode editor will contain '\n' character at required locations
            while(currIdx<codeString.length){
                if(codeString[currIdx]!=='\n'){
                    currentLine+=codeString[currIdx];
                }else{

                    if(currentLine.trim().startsWith("import")){
                        //add imports to the import block
                        imports.addLine(currentLine);
                    }else{
                        //by default add to main body of snippet
                        body.addLine(currentLine);
                    }
                    
                    currentLine="";
                }
                currIdx+=1;
            }

            if(currentLine.length>0){
                if(currentLine.trim().startsWith("import")){
                    //add imports to the import block
                    imports.addLine(currentLine);
                }else{
                    //by default add to main body of snippet
                    body.addLine(currentLine);
                }
                
                currentLine="";
            }

        }catch(err){
            console.log("Some error occured inside constructLines function in Fragment.ts file");
        }

        //add to fragment list
        this.code = [];
        this.code.push(imports);
        this.code.push(body);

    }

    /**
	 * Clears cached data on modification.
	 */
	changed() {
		this.size = -1;
		this.LOC = -1;
		this.errors = -1;
		this.passedTests = -1;
		this.ast = null;
	}

    /**
	 * Returns the number of errors.
	 */

    getErrors(){
        return this.errors;
    }


    /**
	 * Returns the number of passed tests.
	 */

    getPassedTests(){
        return this.passedTests;
    }


    /**
	 * Return the lines of code, excluding deleted lines.
	 */

    getLOC(){
        if(this.LOC!==-1){
            return this.LOC;
        }
        this.LOC = 0;
        for(let i=0;i<this.code.length;i++){
            this.LOC+=this.code[i].getLOC();
        }
        return this.LOC;
    }

    /**
     * returns ID of snippet
     */

    getID(){
        return this.ID;
    }

    /**
     * 
     * returns Fragment array size
     */

    getNumFragments(){
        return this.code.length;
    }

    /**
     * 
     * @param n means index
     * returns fragment at index n 
     */

    getFragment(n:number){
        return this.code[n];
    }

    /**
	 * Returns the snippet code for compat with old functions.
	 * @return
	 */

    getCode(){
        let currentFragment;
        for(let i=0;i<this.code.length;i++){
            currentFragment = this.code[i];

            if(currentFragment.getType() === Fragment.SNIPPET){
                return currentFragment.getCode();
            }

        }
        return "";
    }

    /**
	 * Compat set code
	 */

    setCode(replacement:string){
        let currentFragment;
        for(let i=0;i<this.code.length;i++){
            currentFragment = this.code[i];
            if(currentFragment.getType() === Fragment.SNIPPET){
                this.code[i] = Fragment.FragmentTakingString(replacement);
            }
        }
        this.changed();
    }

    compareTo(currentSnippet:Snippet){
        if(currentSnippet.getLOC() === 0 && this.getLOC()!==0){
            //rank this higher
            return -1;
        }

        if(this.getLOC() === 0 && currentSnippet.getLOC()!==0){
            //rank this lower
            return 1;
        }

        if(currentSnippet.getErrors()=== -1 && this.getErrors()!==-1){
            //rank this higher
            return -1;
        }

        if(currentSnippet.getErrors()!==-1 && this.getErrors() === -1){
            //rank this lower
            return 1;
        }

        //if error value is 0, look at passed tests
        if(currentSnippet.getErrors() === 0 && this.getErrors() === 0){
            //handle any negatives
            if(currentSnippet.getPassedTests() === -1 &&this.getPassedTests()!==-1){
                //rank this higher
                return -1;
            }
            if(currentSnippet.getPassedTests()!==-1 && this.getPassedTests() === -1){
                //rank this lower
                return 1;
            }

            //otherwise, compare passed, largets at top
            if(currentSnippet.getPassedTests()>this.getPassedTests()){
                return 1;
            }else if(currentSnippet.getPassedTests()<this.getPassedTests()){
                return -1;
            }
            return 0;


        }

        //otherwise, compare passed, largets at top
        if(currentSnippet.getErrors()<this.getErrors()){
            return 1;
        }else if(currentSnippet.getErrors()>this.getErrors()){
            return -1;
        }
        return 0;
    }

    /**
	 * Update error information.
	 * @param errors The error value to use.
	 */

    updateErrors(errors:number){
        this.errors = errors;
    }

    
    /**
	 * Deletes the nth line from the snippet, starting at 1.
	 */

    deleteLine(n:number){
        let i=0;
        let currentFragment;
        //process each fragment
        for(let k=0;k<this.code.length;k++){
            currentFragment = this.code[k];
            for(let j=0;j<currentFragment.size();j++){
                if(i === n-1){
                    currentFragment.deleteLine(j);
                    break;
                }
                i++;
            }
        }

        this.changed();
        
    }


    /**
	 * Returns the nth line, starting at 1. Includes deleted lines.
	 */

    getLine(n:number){
        let i=0;
        let currentFragment;

        //process each fragment
        for(let k=0;k<this.code.length;k++){
            currentFragment = this.code[k];
            for(let j=0;j<currentFragment.size();j++){
                if(i === n-1){
                    return currentFragment.getLine(j);
                }
                i++;
            }
        }
        return "";
    }

    /**
	 * Checks if a given line is deleted, starting at 1.
	 * @param n
	 * @return
	 */

    isDeleted(n:number){
        let i=0;
        let currentFragment;

        //process each fragment
        for(let k=0;k<this.code.length;k++){
            currentFragment = this.code[k];
            for(let j=0;j<currentFragment.size();j++){
                if(i === n-1){
                    return currentFragment.isDeleted(j);
                }
                i++;
            }
        }
        return false;
        
    }

    //get the import block
    //will come back and write this function
    getImportBlock(surrounding:string){
        
    }














}