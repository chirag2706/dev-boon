import * as request from "request-promise-native";

/**
 * Class URLReader basically tries to read URL and extract code snippets from that given URL
 */
export class URLReader{
    static address: string = "";

    /*
		 * Function OpenHTML
		 *   Sets the currently opened address to a new URL.
		 *   
		 *   Input: String address - new URL to read HTML from.
    */

    openHTML(address:string){
        URLReader.address = address;
    }


    /*
		 * Function getTopN
		 * 	 Performs JQuery statements on the currently opened URL address to retrieve the top n code snippets
		 *   from the Stack Overflow forum page.
		 *   
		 *   Input: int n - number of code snippets to retreive from the current webpage.
		 *   Returns: Vector<String> - vector of top n code snippets extracted from the Stack Overflow forum page.
    */


    async getTopN(n:any,filePath:string,type:string):Promise<string[]>{
        let code:string = "";
        let author:string = "";

        let topnSnippets:string[] = [];
        let url = null;
        try{

            let modifiedText = URLReader.replaceAll(URLReader.address.substr(8),'/',"$");

            if(type === "stackOverFlow"){
                url = `http://127.0.0.1:6615/NlpToCode_snippet/${modifiedText}`;
            }else{
                url = `http://127.0.0.1:6615/NlpToCode_snippetGFG/${modifiedText}/${filePath}`;
            }
            
            let uriOptions = {
                uri: url,
                json: true,
                gzip: true,
            };

            let res =  await request.get(uriOptions);
            if(res.length === 0){
                return topnSnippets;
            }else{
                topnSnippets = res['snippets'];
            }

            for(let i=0;i<topnSnippets.length;i++){
                if(filePath === "java"){
                    topnSnippets[i] = "//"+topnSnippets[i];
                }else{
                    topnSnippets[i] = "#"+topnSnippets[i];
                }
            }
            return topnSnippets;
        }catch(err){
            console.log("Some bug occured in getTopN function");
        }


        return topnSnippets;

        
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

     /*
		 * Function formatResponse
		 *   Given a Stack Overflow response post, replace all XML escape character codes with the
		 *   characters they represent.
		 *   
		 *   Input: String post - Stack Overflow answer, or block of text with XML escape character codes.
		 *   Returns: String - formatted post with XML escape character codes removed.
	*/


    static formatResponse(post:string){
        post = URLReader.replaceAll(post,"&;quot;", "\"");
        post = URLReader.replaceAll(post,"&quot;", "\"");
        post = URLReader.replaceAll(post,"&quot", "\"");
        post = URLReader.replaceAll(post,"&;apos;", "'");
        post = URLReader.replaceAll(post,"&apos;", "'");
        post = URLReader.replaceAll(post,"&apos", "'");
        post = URLReader.replaceAll(post,"&;lt;","<");
        post = URLReader.replaceAll(post,"&lt;","<");
        post = URLReader.replaceAll(post,"&lt", "<");
        post = URLReader.replaceAll(post,"&;gt;",">");
        post = URLReader.replaceAll(post,"&gt;", ">");
        post = URLReader.replaceAll(post,"&gt", ">");
        post = URLReader.replaceAll(post,"&;amp;", "&");
        post = URLReader.replaceAll(post,"&amp;", "&");
        post = URLReader.replaceAll(post,"&amp", "&");

        return post;

    }


    




    
};