from googlesearch import search
import requests
from bs4 import BeautifulSoup

query = "TypeError: search() got multiple values for argument 'tld'"

req_links=[]

# for j in search(query, tld="co.in", num=12, stop=12, pause=2):
#     if "stackoverflow" in j:
#         req_links.append(j)


test_link="https://stackoverflow.com/questions/21764770/typeerror-got-multiple-values-for-argument"
req_links.append(test_link)

for link in req_links:
    r=requests.get(link)
    soup = BeautifulSoup(r.content, 'html5lib')

    question = soup.find('a', attrs = {'class':'question-hyperlink'}) 
    question=question.text
    #print(question)

    DateCreated=soup.find('time' , attrs={'itemprop':"dateCreated"})
    DateCreated=DateCreated.text
    #print(DateCreated)

    Viewed=soup.find('div' , attrs={'class':"grid--cell ws-nowrap mb8"})
    Viewed=Viewed.text
    Viewed=Viewed.replace(" ","")
    Viewed=Viewed.replace("\n","")
    #print(Viewed)

    NumAnswers=soup.find("h2",attrs={"class":"mb0"})
    NumAnswers=NumAnswers["data-answercount"]
    #print(NumAnswers)

    #####################

    QuestionSoup=soup.find("div",{"class":"question"})

    VoteCount=QuestionSoup.find("div",attrs={"itemprop":"upvoteCount"})
    VoteCount=VoteCount.text
    #print(VoteCount)


    Author=QuestionSoup.find("div",attrs={"itemprop":"author"})
    AuthorReputationScore=Author.find("span",attrs={'class':"reputation-score"})
    AuthorReputationScore=AuthorReputationScore.text
    #print(AuthorReputationScore)


    comments=[]
    Comment=QuestionSoup.find("div",{"class":"js-post-comments-component"})
    Comment=Comment.find_all("li",{"class":"comment js-comment"})
    for c in Comment:
        cc=c.find("span",{"class":"comment-copy"})
        cc=cc.text
        comments.append(cc)
    #print(comments)


    AnswerSoup=soup.find("div",{"id":"answers"})

    accanswer=[]
    a={}
    Answers=AnswerSoup.find_all("div",{"itemprop":"acceptedAnswer"})

    for answer in Answers:
        a={}
        VoteCount=answer.find("div",attrs={"itemprop":"upvoteCount"})
        VoteCount=VoteCount.text
        a["Upvotes"]=VoteCount

        ans=answer.find("div",attrs={"class":"s-prose js-post-body"})
        a["Answer"]=ans.text
        print(a["Answer"])

        ans=answer.find("div",attrs={"itemprop":"author"})
        AuthorReputationScore=answer.find("span",attrs={'class':"reputation-score"})
        AuthorReputationScore=AuthorReputationScore.text
        a["ReputationScore"]=AuthorReputationScore

        comments=[]
        Comment=answer.find("div",{"class":"js-post-comments-component"})
        Comment=Comment.find_all("li",{"class":"comment js-comment"})
        for c in Comment:
            cc=c.find("span",{"class":"comment-copy"})
            cc=cc.text
            comments.append(cc)
        a["Comments"]=comments

        accanswer.append(a)

    #print(accanswer)

    


    answers=[]
    a={}
    Answers=AnswerSoup.find_all("div",{"itemprop":"suggestedAnswer"})

    for answer in Answers:
        a={}
        VoteCount=answer.find("div",attrs={"itemprop":"upvoteCount"})
        VoteCount=VoteCount.text
        a["Upvotes"]=VoteCount

        ans=answer.find("div",attrs={"class":"s-prose js-post-body"})
        a["Answer"]=ans.text

        ans=answer.find("div",attrs={"itemprop":"author"})
        AuthorReputationScore=answer.find("span",attrs={'class':"reputation-score"})
        AuthorReputationScore=AuthorReputationScore.text
        a["ReputationScore"]=AuthorReputationScore

        comments=[]
        Comment=answer.find("div",{"class":"js-post-comments-component"})
        Comment=Comment.find_all("li",{"class":"comment js-comment"})
        for c in Comment:
            cc=c.find("span",{"class":"comment-copy"})
            cc=cc.text
            comments.append(cc)
        a["Comments"]=comments

        answers.append(a)

    #print(answers)