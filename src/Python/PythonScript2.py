from googlesearch import search
import requests
from bs4 import BeautifulSoup
from textblob import TextBlob


query = "TypeError: search() got multiple values for argument 'tld'"

req_links={}

for j in search(query, tld="co.in", num=12, stop=12, pause=2):
    if "stackoverflow" in j:
        req_links[j]=[]

# dict has link and list as key and value
# each value list contains
# rating of question as 1st element ( based on custom parameters)
# question as 2nd element
# rating of accepted answer as 3rd element
# accepted answer as 4th element
# rating of best other answer as 5th element
# best other answer as 6th element


for link in req_links:
    r=requests.get(link)
    soup = BeautifulSoup(r.content, 'html5lib')

    ######################################################################
    #       QUESTION
    ######################################################################

    question = soup.find('a', attrs = {'class':'question-hyperlink'}) 
    question=question.text
    #print(question)

    ######################################################################

    #Number of Months passed after this question was asked
    try:
        DateCreated=soup.find('time' , attrs={'itemprop':"dateCreated"})
        DateCreated=DateCreated.text
        #print(DateCreated)
        if "years" in DateCreated:
            y=DateCreated.split("years")[0]
            y=y.replace(" ","")
            y=int(y)
            y*=12
        if "month" in DateCreated:
            m=DateCreated.split("month")[0]
            m=m.split(",")[1]
            m=m.replace(" ","")
            m=int(m)
        time=m+y
    except:
        #assume question is asked 5 years ago
        time=60

    ######################################################################

    #Number of Views to this question
    try:
        Viewed=soup.find('div' , attrs={'class':"grid--cell ws-nowrap mb8"})
        Viewed=Viewed.text
        Viewed=Viewed.replace(" ","")
        Viewed=Viewed.replace("\n","")
        #print(Viewed)
        Viewed=Viewed.replace("Viewed","")
        Viewed=Viewed.replace("times","")
        Viewed=Viewed.replace(" ","")
        Viewed=Viewed.replace(",","")
        if "k" in Viewed:
            Viewed=Viewed.replace("k","")
            Viewed=Viewed*(1000)
        if "m" in Viewed:
            Viewed=Viewed.replace("m","")
            Viewed=Viewed*(1000000)
        Viewed=float(Viewed)
        Viewed=int(Viewed)
    except:
        # assume 100 people viewed this
        Viewed=100

    ######################################################################

    #Number of answers to this question
    try:
        NumAnswers=soup.find("h2",attrs={"class":"mb0"})
        NumAnswers=NumAnswers["data-answercount"]
        #print(NumAnswers)
        NumAnswers=NumAnswers.replace(" ","")
        NumAnswers=NumAnswers.replace(",","")
        if "k" in NumAnswers:
            NumAnswers=NumAnswers.replace("k","")
            NumAnswers=NumAnswers*(1000)
        if "m" in NumAnswers:
            NumAnswers=NumAnswers.replace("m","")
            NumAnswers=NumAnswers*(1000000)
        NumAnswers=float(NumAnswers)
        NumAnswers=int(NumAnswers)
    except:
        # assume there is 1 answer
        NumAnswers=1

    ######################################################################

    QuestionSoup=soup.find("div",{"class":"question"})


    #Number of votes to this question
    try:
        VoteCount=QuestionSoup.find("div",attrs={"itemprop":"upvoteCount"})
        VoteCount=VoteCount.text
        #print(VoteCount)
        VoteCount=VoteCount.replace(" ","")
        VoteCount=VoteCount.replace(",","")
        if "k" in VoteCount:
            VoteCount=VoteCount.replace("k","")
            VoteCount=VoteCount*(1000)
        if "m" in VoteCount:
            VoteCount=VoteCount.replace("m","")
            VoteCount=VoteCount*(1000000)
        VoteCount=float(VoteCount)
        VoteCount=int(VoteCount)
    except:
        # assume there are 5 votes
        VoteCount=5

    ######################################################################


    #Question author reputation score
    try:
        Author=QuestionSoup.find("div",attrs={"itemprop":"author"})
        AuthorReputationScore=Author.find("span",attrs={'class':"reputation-score"})
        AuthorReputationScore=AuthorReputationScore.text
        AuthorReputationScore=AuthorReputationScore.replace(" ","")
        AuthorReputationScore=AuthorReputationScore.replace(",","")
        if "k" in AuthorReputationScore:
            AuthorReputationScore=AuthorReputationScore.replace("k","")
            AuthorReputationScore=AuthorReputationScore*(1000)
        if "m" in AuthorReputationScore:
            AuthorReputationScore=AuthorReputationScore.replace("m","")
            AuthorReputationScore=AuthorReputationScore*(1000000)
        AuthorReputationScore=float(AuthorReputationScore)
        AuthorReputationScore=int(AuthorReputationScore)
    except:
        # assume the reputation score as 5
        AuthorReputationScore=5

    ######################################################################
    #       ACCEPTED ANSWER
    ######################################################################

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

    a={}
    VoteCount=Answers.find("div",attrs={"itemprop":"upvoteCount"})
    VoteCount=VoteCount.text
    a["Upvotes"]=VoteCount

    ans=Answers.find("div",attrs={"class":"s-prose js-post-body"})
    a["Answers"]=ans.text
    #print(a["Answers"])

    ans=Answers.find("div",attrs={"itemprop":"author"})
    AuthorReputationScore=Answers.find("span",attrs={'class':"reputation-score"})
    AuthorReputationScore=AuthorReputationScore.text
    a["ReputationScore"]=AuthorReputationScore

    comments=[]
    Comment=Answers.find("div",{"class":"js-post-comments-component"})
    Comment=Comment.find_all("li",{"class":"comment js-comment"})
    for c in Comment:
        cc=c.find("span",{"class":"comment-copy"})
        cc=cc.text
        comments.append(cc)
    a["Comments"]=comments

    accanswer.append(a)

    #print(accanswer)

    ######################################################################
    #       OTHER ANSWER
    ######################################################################


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