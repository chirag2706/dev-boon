import * as vscode from 'vscode';


/**
 * A Line is a representation of a single line of code, as well as state information.
 */
export class Line{
    //The string contents of the code line
    contents:string = "";
    //If the line has been deleted
    deleted:boolean = false;
    /**
	 * Constructs a new Line from a string.
	 * @param contents
	 */

    constructor(contents:string){
        this.contents = contents;
    }

    /*
        Acts as a copy constructor
    */

    static LineTakingLine(that:Line){
        let newLine:any = new Line(that.contents);
        newLine.deleted = that.deleted;
        return newLine;
    }

    length(){
        return this.contents.length;
    }

    get(){
        return this.contents;
    }

    delete(){
        this.deleted = true;
        // this.contents = "";
    }

    isDeleted(){
        return this.deleted;
    }


}