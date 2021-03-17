from flask import Flask, request,redirect,jsonify
from flask_restful import Resource, Api
from json import dumps
import requests
from apiclient.discovery import build
from pyyoutube import Api as API_Y


app = Flask(__name__)
api = Api(app)


class StackOverFlow_apiSearchUrl_Single(Resource):
    def get(self,encodedAPISearchTerm):
        stackoverflowApiKey = 'Y3TeIyyVjpbz**icfv1oVg(('
        encodedTagsString=''
        apiSearchUrl = "https://api.stackexchange.com/2.2/search?order=desc&sort=relevance&intitle={encodedAPISearchTerm}&tagged={encodedTagsString}&site=stackoverflow&key={stackoverflowApiKey}".format(encodedAPISearchTerm=encodedAPISearchTerm,encodedTagsString=encodedTagsString,stackoverflowApiKey=stackoverflowApiKey)
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



class YouTube_youtubeSearchUrl(Resource):
    def get(self,encodedWebSearchTerm):
        api_key_="AIzaSyCy8jgQFIVEq2qLBdZMSaHQOiDGAggQTeQ"
        api = API_Y(api_key=api_key_)
        r=api.search_by_keywords(q=encodedWebSearchTerm, search_type=["video"], count=15, limit=15)
        print(r.items)
        return jsonify(r)



class YouTube_googleSearchUrl(Resource):
    def get(self,encodedWebSearchTerm):
        googleSearchUrl = "https://www.google.com/search?q={encodedWebSearchTerm}".format(encodedWebSearchTerm=encodedWebSearchTerm)
        resp = requests.get(googleSearchUrl)        
        return resp.json()





api.add_resource(StackOverFlow_apiSearchUrl_Single,'/apiSearchUrl_Single/<encodedAPISearchTerm>')
api.add_resource(StackOverFlow_apiSearchUrl,'/apiSearchUrl/<encodedAPISearchTerm>/<encodedTagsString>')
api.add_resource(StackOverFlow_stackoverflowSearchUrl,'/stackoverflowSearchUrl/<encodedWebSearchTerm>')
api.add_resource(StackOverFlow_googleSearchUrl,'/googleSearchUrl/<encodedWebSearchTerm>')


api.add_resource(YouTube_youtubeSearchUrl,'/YouTube_youtubeSearchUrl/<encodedWebSearchTerm>')
api.add_resource(YouTube_googleSearchUrl,'/YouTube_googleSearchUrl/<encodedWebSearchTerm>')







if __name__ == '__main__':
     app.run(port='5000')


