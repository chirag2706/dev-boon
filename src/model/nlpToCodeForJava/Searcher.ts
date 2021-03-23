import * as vscode from 'vscode';
import * as request from "request-promise-native";
import {URLReader} from './URLReader';

/**
 * class Searcher
 * 	 Implements the required functionality to search for, and scrape Stack Overflow webpages
 *   to retrieve code snippets.
 *   Uses a combination of Goggle Custom Search Engine API and Jsoup to retrieve snippets.
 */
export class Searcher{
    // Defaults for the number of snippets to receive, and how many pages to look at for snippets.
	// eslint-disable-next-line @typescript-eslint/naming-convention
	static NUM_URLS:number = 3;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	static NUM_ANSWERS_PER_URL:any = 4;

    static key:string = "AIzaSyClq5H_Nd7RdVSIMaRPQhwpG5m_-68fWRU";
    static cx:string = "011454571462803403544:zvy2e2weyy8";


    /*
	 * Function getThreads
	 *   Given a string query to search for, retrieve NUM_URLS Stack Overflow forum
	 *   thread URLs and return them as a vector.
	 *   
	 *   Input: String query - query to serch for.
	 *   Returns: [] - list of URLS related to query.
	 */


    static getThreads(query:string):string[]{
        if(query.length === 0){
            return [];
        }
        query = Searcher.setTargetLanguage(query);

        let urls = []; //array of urls

        let qry = query;

        qry = Searcher.replaceAll(qry, " ", "%20");
        let url = null;
        try{        
            url = `http://127.0.0.1:6615/NplToCodeForJava_googleSearchUrl/${this.key}/${this.cx}/${qry}/${this.NUM_URLS}`;
            const uriOptions = {
                uri: url,
                json: true,
                gzip: true,
            };

            const res = request.get(uriOptions);
            console.log(res);

            // const searchResponse = res['output'];
            // urls = res['urls'];

            return [];


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

    static getCodeSnippets(urls:string[]){
        let code:string[] = [];

        for(let i=0;i<urls.length;i++){
            // Create a new url and open using jsoup so we can do easy queries on the results (formats code for us nicely at cost of time).
	        let ur:URLReader = new URLReader();

            ur.openHTML(urls[i]);

            let top_n_answers = ur.getTopN(Searcher.NUM_ANSWERS_PER_URL);
            if(top_n_answers.length === 0){
                vscode.window.showErrorMessage(`Code snippet not found from url: ${urls[i]}`);
            }else{
                for(let j = 0;j<top_n_answers.length;j++){
                    code.push(top_n_answers[j]);
                }
            }

        }

        return code;

    }


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


    static setTargetLanguage(query:string){
        let lang = "java";
        if(Searcher.contains(query," in ")){
            return query; 
        }

        return query + " in " + lang;
    }




    

};