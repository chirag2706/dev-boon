import * as request from "request-promise-native";


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


    async getTopN(n:any,filePath:string):Promise<string[]>{
        let code:string = "";
        let author:string = "";

        // eslint-disable-next-line @typescript-eslint/naming-convention
        let top_n_snippets:string[] = [];
        let url = null;
        try{

            let modifiedText = URLReader.replaceAll(URLReader.address.substr(8),'/',"$");

            url = `http://127.0.0.1:6615/NlpToCodeForJava_snippet/${modifiedText}`;
            let uriOptions = {
                uri: url,
                json: true,
                gzip: true,
            };

            let res =  await request.get(uriOptions);
            


            

            if(res.length === 0){
                return top_n_snippets;
            }else{
                top_n_snippets = res['snippets'];
            }

            for(let i=0;i<top_n_snippets.length;i++){
                if(filePath === "java"){
                    top_n_snippets[i] = "//"+top_n_snippets[i];
                }else{
                    top_n_snippets[i] = "#"+top_n_snippets[i];
                }
            }


            console.log(`typeof top_n_snippets is:${typeof top_n_snippets}`);



            return top_n_snippets;



            

        }catch(err){
            console.log("Some bug occured in getTopN function");
        }


        return top_n_snippets;

        
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