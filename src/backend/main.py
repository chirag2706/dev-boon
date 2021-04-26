from flask import Flask, request,redirect,jsonify
from flask_restful import Resource, Api
from json import *
import requests
# from apiclient.discovery import build
from googleapiclient.discovery import build
from pyyoutube import Api as API_YOUTUBE
from bs4 import BeautifulSoup

# completionQuery interaction class
from interact import InteractWithGptModel 
from ErrorSearchQuery.StackOverFLowPosts import GetDisplayInformation


#model_path indicates path where model is trained
model_path = "model/gpt2_medium_fine_tuned_coder"
max_length = 2560*2
temperature = 0.5
use_cuda = False #for now,we have used CPU to train models,Now, we will try to train much bigger models with more parameters and bigger dataset inorder to imporvise our model either using CUDA or some cloud service
gptModelInteractionWithExtension = InteractWithGptModel(model_path,max_length,temperature,use_cuda,None,None)
gptModelInteractionWithExtension.load_tokenizer()
gptModelInteractionWithExtension.load_model()    



print("=========================MODEL LOADED SUCCESSFULLY==============================")




app = Flask(__name__)
api = Api(app)

# class which is called in order to make get request to fetch stackoverflow posts based on query
class YouTube(Resource):
    def get(self,encodedWebSearchTerm):
        api_key_="AIzaSyCy8jgQFIVEq2qLBdZMSaHQOiDGAggQTeQ"
        api = API_YOUTUBE(api_key=api_key_)
        r=api.search_by_keywords(q=encodedWebSearchTerm, search_type=["video"], count=15, limit=15)
        return jsonify(r)



# This class basically helps to fetch website links of stackoverflow and geeksforgeeks based on query
class NlpToCode_googleSearchUrl(Resource):
    def get(self,key,cx,qry,num_urls):
        num_urls = str(num_urls)
        # The url is structured to do a custom search which only looks at StackOverflow and GeeksForGeeks sites.
        googleSearchUrl = "https://www.googleapis.com/customsearch/v1?key=" + key + "&cx=" + cx + "&q="+ qry + "&alt=json" + "&num="+num_urls
        resp = requests.get(googleSearchUrl)
        output = resp.json()


        return output

# This class basically tells logic on how snippets are extracted from stackoverflow website based on query and programming language
class NlpToCode_snippet(Resource):
    def get(self,address):
        try:
            stackoverflowUrl = "https://"+self.replaceAll(address,"$",'/')
            resp = requests.get(stackoverflowUrl)

            snippets = []

            soup = BeautifulSoup(resp.content, 'html.parser')

            

            arrayOfCodeSnippets = (soup.find_all(id="answers")[0].find_all('code'))
            print("###################arrayOfCodeSnippets#########################")
            print(arrayOfCodeSnippets)

            if(len(arrayOfCodeSnippets) == 0):
                arrayOfCodeSnippets = (soup.find_all('code'))
                print("###################arrayOfCodeSnippetsWithoutAnswers#########################")
                print(arrayOfCodeSnippets)

            #considering only first n most relevant posts
            for codeSnippet in arrayOfCodeSnippets:
                currentCodeSnippet = codeSnippet.get_text()
                    
                # if(len(currentCodeSnippet)>0):
                snippets.append(" snippet from " + stackoverflowUrl+" \n"+currentCodeSnippet + "\n")

                

            return {"snippets":snippets}
            
        except:
            return {"snippets":[]}



    def replaceAll(self,query,text,format):
        out = ""

        for i in query:
            if(i == text):
                out+=format
            else:
                out+=i
        return out


# This class basically tells logic on how snippets are extracted from geeksforgeeks website based on query and programming language
class NlpToCode_snippetGFG(Resource):
    def get(self,address,langType):
        try:
            # gfgUrl = "https://"+self.replaceAll(address,"$",'/')
            gfgUrl = "https://"+self.replaceAll(address,"$",'/')
            resp = requests.get(gfgUrl)
            snippets = []

            soup = BeautifulSoup(resp.content, 'html.parser')

            #assuming that length of arrayOfCodeSnippets and languageTypes is same
            arrayOfCodeSnippets = soup.find_all("td",class_="code")
            languageTypes = []
            lt = soup.find_all("h2",class_="tabtitle")

            for i in range(len(lt)):
                languageTypes.append(lt[i].get_text(strip=True))

            print(languageTypes)
            

            print("########################INSIDE GFG##########################")
            

            if(len(languageTypes) == len(arrayOfCodeSnippets)):

                for idxNo in range(len(arrayOfCodeSnippets)):
                    languageTypes[idxNo] = languageTypes[idxNo].lower()
                    if(languageTypes[idxNo] == "python"):
                        languageTypes[idxNo] = "python3"
                        
                    if(languageTypes[idxNo]!=langType):
                        continue

                    currentSnippet = ""
                    codeSnippetsInsideDiv = arrayOfCodeSnippets[idxNo].find_all("div",class_="line")
                    
                    

                    for i in codeSnippetsInsideDiv:
                        codeSnippetsInsideCode = i.find_all("code")
                        line = ""

                        for j in codeSnippetsInsideCode:
                            line+=j.get_text()+" "
                        currentSnippet+=line+"\n"   


                    snippets.append(" snippet from " + gfgUrl+" \n"+currentSnippet + "\n")
            else:
                for idxNo in range(len(arrayOfCodeSnippets)):

                    currentSnippet = ""
                    codeSnippetsInsideDiv = arrayOfCodeSnippets[idxNo].find_all("div",class_="line")
                    
                    

                    for i in codeSnippetsInsideDiv:
                        codeSnippetsInsideCode = i.find_all("code")
                        line = ""

                        for j in codeSnippetsInsideCode:
                            line+=j.get_text()+" "
                        currentSnippet+=line+"\n"   


                    snippets.append(" snippet from " + gfgUrl+" \n"+currentSnippet + "\n")

            return {"snippets":snippets}

        except:
            return {"snippets":["some error occured"]}

    def replaceAll(self,query,text,format):
        out = ""

        for i in query:
            if(i == text):
                out+=format
            else:
                out+=i
        return out


# completion query is basically a advanced and much more intelligent snippet query which tries to complete code just by function names
class CompletionQuery(Resource):
    def get(self,lang,query):

            #lang must be either python or java as models are right now trained on python and java only
        print("====================INSIDE COMPLETIONQUERY API CALL========================")
        gptModelInteractionWithExtension.set_lang(lang)
        gptModelInteractionWithExtension.set_query(query)    
        output = gptModelInteractionWithExtension.generate_output()

        

        print(output)

        return {"snippets":output}
        # except:
        #     return {"snippets":"Some error occured in completion query"}
            

#this class executes error query logic using get request
class ErrorAndSearchQuery(Resource):
    def get(self,encodedSearchTerm):
        return_dict=GetDisplayInformation(encodedSearchTerm)
        return return_dict

    

#The below code tells that which calls should be called based on given URL.

api.add_resource(ErrorAndSearchQuery,'/Custom_StackOverFlowUrl/<encodedSearchTerm>')
api.add_resource(YouTube,'/YouTube/<encodedWebSearchTerm>')
api.add_resource(NlpToCode_googleSearchUrl,"/NlpToCode_googleSearchUrl/<key>/<cx>/<qry>/<num_urls>")
api.add_resource(NlpToCode_snippet,"/NlpToCode_snippet/<address>")
api.add_resource(NlpToCode_snippetGFG,"/NlpToCode_snippetGFG/<address>/<langType>")

api.add_resource(CompletionQuery,"/CompletionQuery/<lang>/<query>")




if __name__ == '__main__':
    #app is running of port 6615
    app.run(port='6615')
