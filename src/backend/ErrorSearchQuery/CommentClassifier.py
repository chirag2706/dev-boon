from textblob import TextBlob

def Getpolarity(comment_input):
    analysis = TextBlob(comment_input).sentiment
    polarity_score=analysis.polarity
    return polarity_score