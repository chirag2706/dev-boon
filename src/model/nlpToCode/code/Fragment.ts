import * as vscode from 'vscode';
import {Line} from './Line';
import {QueryDocListener} from '../QueryDocListener';

/**
 * A fragment represents a collection of lines of code, as well as a context ID that informs insertion.
 */
export class Fragment{
    lines:Line[] = [];
    codeString:string = "";
    formattedCode:string = "";
    type:number = -1;
    LOC:number = -1;

    //the comment attached to deleted lines for all snippets
    static deletionMessage:string = "// removed from dev-boon";

    /*types of fragments, this defines how a fragment will be integrated within the users code:
	 * 	we only use snippet and imports for now
	 */

    //default, snippets will insert at the insertion point
    static SNIPPET:number = 0;
    //import blocks, will insert at the beginning of the file
    static IMPORTS:number = 1;
    //UNUSED
    static METHOD:number = 2;
    //UNUSED
    static CLASS:number = 3;
    //UNUSED
    static FIELD:number = 4;

    /**
	 * Constructor for an empty fragment.
	 * @param type The type of fragment, one of the class constants.
	 */

    constructor(type:number){
        this.type=type;
    }

    /**
	 * Acts as Copy constructor
	 */

    static FragmentTakingFragment(that:Fragment){
        
        let newFragment:Fragment = new Fragment(that.type);

        newFragment.LOC = that.LOC;
        newFragment.formattedCode = that.formattedCode;
        newFragment.codeString = that.codeString;
        if(that.lines.length>0){
            newFragment.lines = [];
            that.lines.forEach((line)=>{
                newFragment.lines.push(Line.LineTakingLine(line));
            });
        }

        return newFragment;
        
    }

    isDeleted(idx:number){
        return this.lines[idx].isDeleted();
    }

    getLine(idx:number){
        return this.lines[idx].get();
    }


    /**
	 * String constructor for SNIPPET
	 * @param code
	 */

    static FragmentTakingString(code:string){
        let newFragment:Fragment = new Fragment(Fragment.SNIPPET);

        newFragment.codeString = code;
        newFragment.lines = [];
        return newFragment;
    }

    /**
     * Function helps in constructing lines
     */

    constructLines(){
        if(this.codeString.length === 0){
            this.lines = [];
            this.LOC = 0;
            return;
        }

        this.lines = [];
        this.LOC = 0;

        try{   
            let currentLine = "";
            let currIdx = 0;
            //assuming that code,which will be fetched from vscode editor will contain '\n' character at required locations
            while(currIdx<this.codeString.length){
                if(this.codeString[currIdx]!=='\n'){
                    currentLine+=this.codeString[currIdx];
                }else{

                    if(currentLine.trim().length>0 && !currentLine.trim().startsWith("//",0)){
                        this.LOC+=1;
                    }

                    this.lines.push(new Line(currentLine));
                    currentLine="";
                }
                currIdx+=1;
            }


            if(currentLine.length>0){
                if(currentLine.trim().length>0 && !currentLine.trim().startsWith("//",0)){
                    this.LOC+=1;
                }

                this.lines.push(new Line(currentLine));
                currentLine="";
            }

        }catch(err){
            console.log("Some error occured inside constructLines function in Fragment.ts file");
        }

    }

    /**
	 * Clears cache.
	 */


    changed(){
        this.codeString = "";
        this.formattedCode = "";
        this.LOC = -1;
    }


    /**
	 * Adds a line to the list of lines.
	 */

    addLine(line:string){
        if(this.lines.length === 0){
            this.constructLines();
        }

        if(this.lines.length>0){
            //filter duplicates for import blocks
            if(this.type === Fragment.IMPORTS){
                for(let i=0;i<this.lines.length;i++){
                    if(this.lines[i].get() === line){
                        return;
                    }
                }
            }
        }else{
            this.lines = [];
        }

        this.lines.push(new Line(line));
        this.changed();

    }

    /**
	 * Deletes a line at the given index.
	 * @param n The int index.
	 */

    deleteLine(n:number){
        if(this.lines.length === 0){
            this.constructLines();
        }
        if(this.lines.length === 0){
            return;
        }

        if(n>=0 && n<this.lines.length){
            this.lines[n].delete();
        }
        this.changed();

    }

    /**
	 * Returns a String of code without any formatting.
	 */

    getCode(){
        if(this.codeString.length>0){
            return this.codeString;
        }
        if(this.lines.length > 0){
            return this.constructCode();
        }

        return "";

    }

    /**
     * function tells how to construct code
     */

    constructCode(){
        if(this.lines.length === 0){
            this.LOC = 0;
            return "";
        }

        this.codeString = "";
        this.LOC = 0;

        for(let i=0;i<this.lines.length;i++){
            //ignore delete
            if(this.lines[i].isDeleted()){
                continue;
            }
            //ignore empty liness or comments
            if(this.lines[i].get().length === 0 || this.lines[i].get().trim().startsWith("//",0)){
                continue;
            }

            this.codeString+=this.lines[i].get()+"\n";
            this.LOC++;
        }
    }

    /**
	 * Returns a String of code how it would be inserted into the workspace.
	 */

    getFormattedCode(){
        if(this.formattedCode.length>0){
            return this.formattedCode;
        }
        return this.constructFormattedCode();
    }

    /**
     * returns type
     */

    getType(){
        return this.type;
    }

    /**
     * tells ,how formatted code is constructed
     */

    constructFormattedCode(){
        if(this.lines.length === 0){
            return "";
        }

        this.formattedCode = "";

        let currentQuery = QueryDocListener.queryString;

        let whitespace = "";

        if(currentQuery.length>0){
            whitespace = currentQuery.substring(0, currentQuery.indexOf(currentQuery.trim()));
        }

        if(this.type!==Fragment.SNIPPET){
            whitespace = "";
        }

        for(let i=0;i<this.lines.length;i++){
            let currentLine = this.lines[i];
            let currentString = currentLine.get();
            if(currentLine.isDeleted()){
                //ignore imports so we dont clog this up
                if(this.type === Fragment.IMPORTS){
                    continue;
                }

                //add comment to deleted
                currentString = "//"+currentString+Fragment.deletionMessage;
            }
            this.formattedCode += whitespace+currentString+"\n";
        }


        return this.formattedCode;



    }   

    /**
	 * The size of the fragment, as the size of the line list.
	 */

    size(){
        if(this.lines.length === 0){
            this.constructLines();
        }
        if(this.lines.length === 0){
            return 0;
        }
        return this.lines.length;
    }

    /**
	 * The number of non-deleted lines of code.
	 */

    getLOC(){
        if(this.LOC!==-1){
            return this.LOC;
        }
        if(this.codeString.length === 0){
            this.constructCode();
        }
        if(this.lines.length === 0){
            this.constructLines();
        }

        return this.LOC;
    }


    /**
	 * Delete a line containing an element. This is used to remove duplicate imports.
	 */


    deleteLineContaining(element:string){
        if(this.lines.length === 0){
            this.constructLines();
        }
        if(this.lines.length === 0){
            return;
        }
        for(let i=0;i<this.lines.length;i++){
            if(this.lines[i].get().includes(element)){
                this.lines[i].delete();
            }
        }
        this.changed();
    }


}