from flask import Flask, request
from flask_restful import Resource, Api
from json import dumps

app = Flask(__name__)
api = Api(app)


class StackOverFLow_apiSearchUrl(Resource):
    def get(self,encodedAPISearchTerm,encodedTagsString):
        stackoverflowApiKey = 'Y3TeIyyVjpbz**icfv1oVg(('
        apiSearchUrl = "https://api.stackexchange.com/2.2/search?order=desc&sort=relevance&intitle={encodedAPISearchTerm}&tagged={encodedTagsString}&site=stackoverflow&key={stackoverflowApiKey}".format(encodedAPISearchTerm=encodedAPISearchTerm,encodedTagsString=encodedTagsString,stackoverflowApiKey=stackoverflowApiKey)
        resp = requests.get(apiSearchUrl)
        return resp.text

class StackOverFLow_stackoverflowSearchUrl(Resource):
    def get(self,encodedWebSearchTerm):
        stackoverflowSearchUrl = "https://stackoverflow.com/search?q={encodedWebSearchTerm}".format(encodedWebSearchTerm=encodedWebSearchTerm)
        resp = requests.get(stackoverflowSearchUrl)
        return resp.text


class StackOverFLow_googleSearchUrl(Resource):
    def get(self,encodedWebSearchTerm):
        googleSearchUrl = "https://www.google.com/search?q={encodedWebSearchTerm}".format(encodedWebSearchTerm=encodedWebSearchTerm)
        resp = requests.get(googleSearchUrl)
        return resp.text


class YouTube_youtubeSearchUrl(Resource):
    def get(self,encodedWebSearchTerm):
        youtubeSearchUrl = "https://www.youtube.com/results?search_query={encodedWebSearchTerm}".format(encodedWebSearchTerm=encodedWebSearchTerm)
        resp = requests.get(youtubeSearchUrl)
        return resp.text


class YouTube_googleSearchUrl(Resource):
    def get(self,encodedWebSearchTerm):
        googleSearchUrl = "https://www.google.com/search?q={encodedWebSearchTerm}".format(encodedWebSearchTerm=encodedWebSearchTerm)
        resp = requests.get(googleSearchUrl)        
        return resp.text


api.add_resource(StackOverFLow_apiSearchUrl,'/stackoverflow_apiSearchUrl/<encodedAPISearchTerm>/<encodedTagsString>')
api.add_resource(StackOverFLow_stackoverflowSearchUrl,'/StackOverFLow_stackoverflowSearchUrl/<encodedWebSearchTerm>')
api.add_resource(StackOverFLow_googleSearchUrl,'/StackOverFLow_googleSearchUrl/<encodedWebSearchTerm>')

api.add_resource(YouTube_youtubeSearchUrl,'/YouTube_youtubeSearchUrl/<encodedWebSearchTerm>')
api.add_resource(YouTube_googleSearchUrl,'/YouTube_googleSearchUrl/<encodedWebSearchTerm>')


if __name__ == '__main__':
     app.run(port='5000')