import * as vscode from 'vscode';
import * as request from "request-promise-native";
import * as fs from "fs"; 
import {URLReader} from './URLReader';

/**
 * class Searcher
 * 	 Implements the required functionality to search for, and scrape Stack Overflow webpages
 *   to retrieve code snippets.
 *   Uses a combination of Goggle Custom Search Engine API and Jsoup to retrieve snippets.
 */
export class Searcher{
    // Defaults for the number of snippets to receive, and how many pages to look at for snippets.
	static NUM_URLS:number = 3;
	static NUM_ANSWERS_PER_URL:any = 4;

    static key:string = "AIzaSyClq5H_Nd7RdVSIMaRPQhwpG5m_-68fWRU";
    static cx:string = "011454571462803403544:zvy2e2weyy8";

    static activeFilePath:string = "";


    /**
     * 
     * @returns a string
     * This function basically tries to analyze whether user wants python code or java code or something else.
     */
    static findFileType():string{

        // vscode.window

        var currentlyOpenTabfilePath = vscode.window.activeTextEditor?.document.uri.fsPath;
        if(currentlyOpenTabfilePath === undefined){
            Searcher.activeFilePath = "";
        }

        if(currentlyOpenTabfilePath!== undefined && currentlyOpenTabfilePath.length >= 6){
            let lang = currentlyOpenTabfilePath.substr(currentlyOpenTabfilePath.length-4);
            if(lang === "java"){
                Searcher.activeFilePath = "java";
                return "java";
            }
        }
        
        if(currentlyOpenTabfilePath!== undefined && currentlyOpenTabfilePath.length >= 4){
            let lang = currentlyOpenTabfilePath.substr(currentlyOpenTabfilePath.length-2);
            if(lang === "py"){
                Searcher.activeFilePath = "python3";
                return "python3";
            }
        }

        return "";
    }


    /*
	 * Function getThreads
	 *   Given a string query to search for, retrieve NUM_URLS Stack Overflow forum
	 *   thread URLs and return them as a vector.
	 *   
	 *   Input: String query - query to serch for.
	 *   Returns: [] - list of URLS related to query.
	 */


    static async getThreads(query:string,type:string):Promise<string[]>{
        if(query.length === 0){
            return [];
        }
        query = await Searcher.setTargetLanguage(query,Searcher.findFileType());

        if(query.length === 0){
            return [];
        }

        let urls:string[] = []; //array of urls

        let qry = query;



        qry = Searcher.replaceAll(qry, " ", "%20");

        if(type === "geeksForgeeks"){
            this.cx = "546cdf07893198cb9";
        }else{
            this.cx = "011454571462803403544:zvy2e2weyy8";
        }
        let url = null;
        try{        
            url = `http://127.0.0.1:6615/NlpToCode_googleSearchUrl/${this.key}/${this.cx}/${qry}/${this.NUM_URLS}`;
            const uriOptions = {
                uri: url,
                json: true,
                gzip: true,
            };

            const searchResponse = await request.get(uriOptions);
            for(let i=0;i<searchResponse.items.length;i++){
                urls.push(searchResponse.items[i].link);
            }
            return urls;

        }catch(err){
            vscode.window.showErrorMessage("Something went wrong while searching for query");
            return [];
        }

    }

    /*
	 * Function getCodeSnippets
	 *   Given a vector of StackOverflow forum thread URLs, retrieve the top NUM_ANSWERS_PER_URL answers from each thread (based on upvotes).
	 *   
	 *   Input: Vector<String> urls - vector of StackOverflow thread urls.
	 *   Returns: Vector<String> - vector of top code snippets from each given url.
	 */

    static async  getCodeSnippets(urls:string[],type:string){
        try{
            let code:any = [];

            for(let i=0;i<urls.length;i++){
                // Create a new url and open using soup so we can do easy queries on the results (formats code for us nicely at cost of time).
                let ur:URLReader = new URLReader();

                ur.openHTML(urls[i]);
    
                let topnAnswers = await ur.getTopN(Searcher.NUM_ANSWERS_PER_URL,Searcher.activeFilePath,type);

                if((await topnAnswers).length === 0){
                    vscode.window.showErrorMessage(`Code snippet not found from url: ${urls[i]}`);
                }else{
                    code.push(topnAnswers);
                }
    
            }

            return code;

        }catch(err){
            vscode.window.showErrorMessage("Something went wrong while getting code snippets");
            return [[]];
        }


    }

    /**
     * 
     * @param qry 
     * @param text 
     * @param format 
     * @returns a string
     * Function which replaces characters
     */
    static replaceAll(qry:string,text:string,format:string){
        let res = "";

        for(let i=0;i<qry.length;i++){
            if(qry[i] === text){
                res+=format;
            }else{
                res+=qry[i];
            }
        }
        return res;
    }

    /**
     * 
     * @param query 
     * @param text 
     * @returns either true or false
     * Function which checks whether @param text exists inside @param query 
     */
    static contains(query:string,text:string){
        let len = query.length;

        for(let i=0;i<=len-4;i++){
            if(query.substr(i,4) === text){
                return true;
            }
        }
        return false;

    }


    /*
	 * Function setTargetLanguage
	 *   Given a query to search for, add the text " in java" to the end of the text if it isn't already there.
	 *   
	 *   Input: String text - a task query.
	 *   Returns: String - query + " in java"
	 */


    static setTargetLanguage(query:string,targetLang:string){

        if(targetLang.length === 0){
            return "";
        }

        if(Searcher.contains(query," in ")){
            return query; 
        }

        return query + " in " + targetLang;
    }
};