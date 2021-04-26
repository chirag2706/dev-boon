from textblob import TextBlob

def Getpolarity_Score(comment_input):   # get the polarity score from textblob library using NLP
    analysis = TextBlob(comment_input).sentiment
    polarity_score=analysis.polarity
    return polarity_score
