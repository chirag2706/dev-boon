from googlesearch import search
import requests
from bs4 import BeautifulSoup
from textblob import TextBlob
import statistics
import json  
from Summarizer import generate_summary

def GetDisplayInformation(query):
    
    req_links={}
    for j in search(query, tld="co.in", num=15, stop=15, pause=2):
        if "stackoverflow.com" in j:
            req_links[j]=[]

    # dict has link and list as key and value
    # each value list contains
    # rating of question as 1st element ( based on custom parameters)
    # question as 2nd element
    # rating of accepted answer as 3rd element
    # accepted answer as 4th element
    # rating of best other answer as 5th element
    # best other answer as 6th element


    # all_details :
    #             question
    #             time
    #             Viewed
    #             NumAnswers
    #             VoteCount
    #             AuthorReputationScore

    #             acceted_answer


    everything=[]

    for link in req_links:
        all_details={}
        all_details["link"]=link


        r=requests.get(link)
        soup = BeautifulSoup(r.content, 'html5lib')

        ############################################################################################################################################
        #       QUESTION
        ############################################################################################################################################



        ######################################################################
        #question

        question = soup.find('a', attrs = {'class':'question-hyperlink'}) 
        question=question.text
        #print(question)

        all_details["question"]=question

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

        all_details["time_passed"]=time

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

        all_details["Viewed"]=Viewed


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
            NumAnswers=0


        all_details["NumAnswers"]=NumAnswers

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

        all_details["VoteCount"]=VoteCount



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
            #print(AuthorReputationScore)
        except:
            # assume the reputation score as 5
            AuthorReputationScore=5


        all_details["AuthorReputationScore"]=AuthorReputationScore


        ############################################################################################################################################
        #       ACCEPTED ANSWER
        ############################################################################################################################################

        

        accanswer={}
        Answers=soup.find("div",{"class":"answer accepted-answer"})



        ######################################################################
        #Vote count of accepted answer

        try:
            VoteCount=Answers.find("div",attrs={"itemprop":"upvoteCount"})
            VoteCount=VoteCount.text
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
            accanswer["Upvotes"]=VoteCount
        except:
            # assume there are 5 votes
            VoteCount=5
            accanswer["Upvotes"]=VoteCount



        #####################################################################
        # Accepted answer
        try:
            ans=Answers.find("div",attrs={"class":"s-prose js-post-body"})
            accanswer["AnswerCode"]=""
            accanswer["AnswerText"]=""
            for item in ans.find_all("p"):
                accanswer["AnswerText"]+=item.text
            for item in ans.find_all("code"):
                accanswer["AnswerCode"]+=item.text
        except:
            accanswer["AnswerText"]="NO ANSWER"
            accanswer["AnswerCode"]="NO CODE"



        ######################################################################
        #ReputationScore of answerer

        try:
            ans=Answers.find("div",attrs={"itemprop":"author"})
            AuthorReputationScore=Answers.find("span",attrs={'class':"reputation-score"})
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
            #print(AuthorReputationScore)
            accanswer["ReputationScore"]=AuthorReputationScore
        except:
            AuthorReputationScore=5
            accanswer["ReputationScore"]=AuthorReputationScore



        ######################################################################
        #Comments score of answerer

        try:
            comments=[]
            Comment=Answers.find("div",{"class":"js-post-comments-component"})
            Comment=Comment.find_all("li",{"class":"comment js-comment"})
            score=0
            num=0
            for c in Comment:
                cc=c.find("span",{"class":"comment-copy"})
                cc=cc.text
                comments.append(cc)
                #print(cc)
                analysis = TextBlob(cc).sentiment
                score+=analysis.polarity
            score/=num

            accanswer["Comments"]=score
        except:
            # assume the commments polarity as 0.1
            score=0.1
            accanswer["Comments"]=score


        all_details["accepted_answer"]=accanswer
        

        ######################################################################
        #       OTHER ANSWER
        ######################################################################


        answers=[]
        a={}
        Answers=soup.find_all("div",{"itemprop":"suggestedAnswer"})

        for answer in Answers:
            a={}
            ######################################################################
            #Vote count of this answer

            try:
                VoteCount=answer.find("div",attrs={"itemprop":"upvoteCount"})
                VoteCount=VoteCount.text
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
                a["Upvotes"]=VoteCount
            except:
                # assume there are 5 votes
                VoteCount=5
                a["Upvotes"]=VoteCount
            #print(VoteCount)



            #####################################################################
            # Accepted answer
            try:
                ans=answer.find("div",attrs={"class":"s-prose js-post-body"})
                a["AnswerCode"]=""
                a["AnswerText"]=""
                for item in ans.find_all("p"):
                    a["AnswerText"]+=item.text
                for item in ans.find_all("code"):
                    a["AnswerCode"]+=item.text
            except:
                a["AnswerText"]="NO ANSWER"
                a["AnswerCode"]="NO CODE"

            #print(a["AnswerCode"])

            ######################################################################
            #ReputationScore of answerer

            try:
                ans=answer.find("div",attrs={"itemprop":"author"})
                AuthorReputationScore=answer.find("span",attrs={'class':"reputation-score"})
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
                #print(AuthorReputationScore)
                a["ReputationScore"]=AuthorReputationScore
            except:
                AuthorReputationScore=5
                a["ReputationScore"]=AuthorReputationScore

            #print(a["ReputationScore"])



            ######################################################################
            #Comments score of answerer

            try:
                comments=[]
                Comment=answer.find("div",{"class":"js-post-comments-component"})
                Comment=Comment.find_all("li",{"class":"comment js-comment"})
                score=0
                num=0
                for c in Comment:
                    cc=c.find("span",{"class":"comment-copy"})
                    cc=cc.text
                    comments.append(cc)
                    #print(cc)
                    analysis = TextBlob(cc).sentiment
                    num+=1
                    score+=analysis.polarity
                score/=num
                a["Comments"]=score
            except:
                # assume the commments polarity as 0.1
                score=0
                a["Comments"]=score

            #print(a["Comments"])

            answers.append(a)

        all_details["AllAnswers"]=answers

        everything.append(all_details)
        all_details={}


    tim={}   #20
    view={} #100
    NumAns={} #20
    VotC={}  #100
    AuthRep={} #20
    score={}
    codw={}
    answ={}
    ################################################3
    #Select 3 questions to show in order


    for i in range(len(everything)):
        tim[i]=everything[i]["time_passed"]
        view[i]=everything[i]["Viewed"]
        NumAns[i]=everything[i]["NumAnswers"]
        VotC[i]=everything[i]["VoteCount"]
        AuthRep[i]=everything[i]["AuthorReputationScore"]
        score[i]=0
        answ[i]=everything[i]["accepted_answer"]["AnswerText"]
        codw[i]=everything[i]["accepted_answer"]["AnswerCode"]


    tim=dict(sorted(tim.items(), key=lambda item: item[1]))
    view=dict(sorted(view.items(), key=lambda item: item[1]))
    NumAns=dict(sorted(NumAns.items(), key=lambda item: item[1]))
    VotC=dict(sorted(VotC.items(), key=lambda item: item[1]))
    AuthRep=dict(sorted(AuthRep.items(), key=lambda item: item[1]))
    

    s=0
    for k in tim.keys():
        score[k]+=s
        s+=20
    s=0
    for k in view.keys():
        score[k]+=s
        s+=100
    s=0
    for k in NumAns.keys():
        score[k]+=s
        s+=20
    s=0
    for k in VotC.keys():
        score[k]+=s
        s+=100
    s=0
    for k in AuthRep.keys():
        score[k]+=s
        s+=20
    for k in answ.keys():
        if answ[k]=="NO ANSWER":
            score[k]-=150
    for k in codw.keys():
        if codw[k]=="NO CODE":
            score[k]-=150
    
    score=dict(sorted(score.items(), key=lambda item: item[1],reverse=True))
    score
    count=5

    return_dict={}
    i=0

    for k in score.keys():
        if count>0:
            x={}
            #print("********************************************")
            #print(everything[k]["question"])
            x["link"]=everything[k]["link"]
            x["question"]=everything[k]["question"]
            #print("********************************************")
            #print(everything[k]["accepted_answer"]["AnswerText"])
            try:
                #print(generate_summary(everything[k]["accepted_answer"]["AnswerText"]))
                x["AnswerText"]=generate_summary(everything[k]["accepted_answer"]["AnswerText"])
            except:
                #print(everything[k]["accepted_answer"]["AnswerText"])
                x["AnswerText"]=everything[k]["accepted_answer"]["AnswerText"]
            # print("********************************************")
            # print(everything[k]["accepted_answer"]["AnswerCode"])
            # print(everything[k]["accepted_answer"]["AnswerCode"])
            # print("********************************************")
            
            x["AnswerCode"]=everything[k]["accepted_answer"]["AnswerCode"]

            return_dict[i]=x
            count-=1
            i+=1

        else:
            pass

    json_return_obj=json.dumps(return_dict)
    return json_return_obj



# query = "TypeError: search() got multiple values for argument 'tld'"
# GetDisplayInformation(query)

