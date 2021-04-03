from flask import Flask, request,redirect,jsonify
from flask_restful import Resource, Api
from json import *
import requests
# from apiclient.discovery import build
from googleapiclient.discovery import build
from pyyoutube import Api as API_YOUTUBE
from bs4 import BeautifulSoup
# from nltk.corpus import stopwords
# from nltk.cluster.util import cosine_distance
# import numpy as np
# import networkx as nx

app = Flask(__name__)
api = Api(app)


class StackOverFlow_apiSearchUrl_Single(Resource):
    def get(self,encodedAPISearchTerm):
        stackoverflowApiKey = 'Y3TeIyyVjpbz**icfv1oVg(('
        encodedTagsString=''
        apiSearchUrl = "https://api.stackexchange.com/2.2/search?order=desc&sort=relevance&intitle={encodedAPISearchTerm}&tagged={encodedTagsString}&site=stackoverflow&key={stackoverflowApiKey}".format(encodedAPISearchTerm=encodedAPISearchTerm,encodedTagsString=encodedTagsString,stackoverflowApiKey=stackoverflowApiKey)
        print(apiSearchUrl)
        resp = requests.get(apiSearchUrl)
        return resp.json()


class StackOverFlow_apiSearchUrl(Resource):
    def get(self,encodedAPISearchTerm,encodedTagsString):
        stackoverflowApiKey = 'Y3TeIyyVjpbz**icfv1oVg(('
        apiSearchUrl = "https://api.stackexchange.com/2.2/search?order=desc&sort=relevance&intitle={encodedAPISearchTerm}&tagged={encodedTagsString}&site=stackoverflow&key={stackoverflowApiKey}".format(encodedAPISearchTerm=encodedAPISearchTerm,encodedTagsString=encodedTagsString,stackoverflowApiKey=stackoverflowApiKey)
        resp = requests.get(apiSearchUrl)
        return resp.json()



class StackOverFlow_stackoverflowSearchUrl(Resource):
    def get(self,encodedWebSearchTerm):
        stackoverflowSearchUrl = "https://stackoverflow.com/search?q={encodedWebSearchTerm}".format(encodedWebSearchTerm=encodedWebSearchTerm)
        resp = requests.get(stackoverflowSearchUrl)
        return resp.json()



class StackOverFlow_googleSearchUrl(Resource):
    def get(self,encodedWebSearchTerm):
        googleSearchUrl = "https://www.google.com/search?q={encodedWebSearchTerm}".format(encodedWebSearchTerm=encodedWebSearchTerm)
        resp = requests.get(googleSearchUrl)
        return resp.json()


class YouTube(Resource):
    def get(self,encodedWebSearchTerm):
        api_key_="AIzaSyCy8jgQFIVEq2qLBdZMSaHQOiDGAggQTeQ"
        api = API_YOUTUBE(api_key=api_key_)
        r=api.search_by_keywords(q=encodedWebSearchTerm, search_type=["video"], count=15, limit=15)
        return jsonify(r)


class YouTube_youtubeSearchUrl(Resource):
    def get(self,encodedWebSearchTerm):
        googleSearchUrl = "https://www.youtube.com/results?search_query={encodedWebSearchTerm}".format(encodedWebSearchTerm=encodedWebSearchTerm)
        resp = requests.get(googleSearchUrl)        
        return resp.json()


class YouTube_googleSearchUrl(Resource):
    def get(self,encodedWebSearchTerm):
        googleSearchUrl = "https://www.google.com/search?q={encodedWebSearchTerm}".format(encodedWebSearchTerm=encodedWebSearchTerm)
        resp = requests.get(googleSearchUrl)        
        return resp.json()


class Code_Summary(Resource):
    def get(self,entire_code):
        return jsonify({'summary':entire_code})


class NlpToCode_googleSearchUrl(Resource):
    def get(self,key,cx,qry,num_urls):
        num_urls = str(num_urls)
        # The url is structured to do a custom search which only looks at StackOverflow sites.
        googleSearchUrl = "https://www.googleapis.com/customsearch/v1?key=" + key + "&cx=" + cx + "&q="+ qry + "&alt=json" + "&num="+num_urls
        resp = requests.get(googleSearchUrl)
        output = resp.json()
        

        return output


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
            cnt = 0  # keeps track of current length of snippets array

            if(len(arrayOfCodeSnippets) == 0):
                arrayOfCodeSnippets = (soup.find_all('code'))
                print("###################arrayOfCodeSnippetsWithoutAnswers#########################")
                print(arrayOfCodeSnippets)

            #considering only first n most relevant posts
            for codeSnippet in arrayOfCodeSnippets:
                currentCodeSnippet = codeSnippet.get_text()
                    
                # if(len(currentCodeSnippet)>0):
                snippets.append(" snippet from " + stackoverflowUrl+" \n"+currentCodeSnippet + "\n")
                cnt+=1

                if(cnt == 5):
                    break

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


class NlpToCode_snippetGFG(Resource):
    def get(self,address):
        try:
            # gfgUrl = "https://"+self.replaceAll(address,"$",'/')
            gfgUrl = "https://www.geeksforgeeks.org/copy-elements-of-vector-to-java-arraylist/"
            resp = requests.get(gfgUrl)
            snippets = []

            soup = BeautifulSoup(resp.content, 'html.parser')

            arrayOfCodeSnippets = soup.find_all("td",class_="code")


            print("########################")
            


            for codeSnippet in arrayOfCodeSnippets:
                currentSnippet = ""
                codeSnippetsInsideDiv = codeSnippet.find_all("div",class_="line")

                for i in codeSnippetsInsideDiv:
                    codeSnippetsInsideCode = i.find_all("code")
                    line = ""

                    for j in codeSnippetsInsideCode:
                        line+=j.get_text(strip=True)+" "
                    currentSnippet+=line+"\n"   

                snippets.append(currentSnippet)

            print(snippets)
            return {"snippets":snippets}

        except:
            return {"snippets":["some error occured"]}

    


api.add_resource(StackOverFlow_apiSearchUrl_Single,'/apiSearchUrl_Single/<encodedAPISearchTerm>')
api.add_resource(StackOverFlow_apiSearchUrl,'/apiSearchUrl/<encodedAPISearchTerm>/<encodedTagsString>')
api.add_resource(StackOverFlow_stackoverflowSearchUrl,'/stackoverflowSearchUrl/<encodedWebSearchTerm>')
api.add_resource(StackOverFlow_googleSearchUrl,'/googleSearchUrl/<encodedWebSearchTerm>')



api.add_resource(YouTube,'/YouTube/<encodedWebSearchTerm>')
api.add_resource(YouTube_youtubeSearchUrl,'/YouTube_youtubeSearchUrl/<encodedWebSearchTerm>')
api.add_resource(YouTube_googleSearchUrl,'/YouTube_googleSearchUrl/<encodedWebSearchTerm>')


api.add_resource(NlpToCode_googleSearchUrl,"/NlpToCode_googleSearchUrl/<key>/<cx>/<qry>/<num_urls>")
api.add_resource(NlpToCode_snippet,"/NlpToCode_snippet/<address>")
api.add_resource(NlpToCode_snippetGFG,"/NlpToCode_snippetGFG/<address>")

api.add_resource(Code_Summary,'/Code_Summary/<entire_code>')




if __name__ == '__main__':
     app.run(port='6615')
