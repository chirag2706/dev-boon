# from transformers import GPT2LMHeadModel, GPT2Tokenizer
from transformers import AutoTokenizer,AutoModelWithLMHead
""" 
    Class which acts as a user interface and which tries to interact with gpt2-medium model
"""
class InteractWithGptModel():
    def __init__(self,model_path,max_length,temperature,use_cuda,lang,query):
        self.model_path = model_path
        self.max_length = max_length
        self.temperature = temperature
        self.use_cuda = use_cuda
        self.model = None
        self.tokenizer = None
        self.lang = lang #can be python or java ,otherwise this class will never be called
        self.query = query #oriignal query taken from vscode editor


        

        print("InteractWithGptModel object succesfully created")

    # load fine-tunned model from path

    def load_model(self):
        self.model = AutoModelWithLMHead.from_pretrained("chirag2706/gpt2_code_generation_model")

    #load tokenizer from path

    def load_tokenizer(self):
        self.tokenizer = AutoTokenizer.from_pretrained("chirag2706/gpt2_code_generation_model")

    #set language ,either python or java as for now the fine-tunned model supports two programming languages, namely, python and java
    def set_lang(self,lang):
        self.lang = lang

    def set_query(self,query):
        self.query  = query

    

    # function which tries to generate output(generate code) based on given query and based on language (either python3 or java)
    def generate_output(self):
        print(self.model_path)
        print(self.max_length)
        print(self.temperature)
        print(self.use_cuda)
        print(self.lang)
        print(self.query)
        input_ids = self.tokenizer.encode("<python> " + self.query, return_tensors='pt') if self.lang == "python3" else self.tokenizer.encode("<java> " + self.query, return_tensors='pt')
        outputs = self.model.generate(input_ids=input_ids.to("cuda") if self.use_cuda else input_ids,
                                 max_length=self.max_length,
                                 temperature=self.temperature,
                                 num_return_sequences=1)

        print(len(outputs))
        
        decoded = self.tokenizer.decode(outputs[0], skip_special_tokens=True)

        # # # ends with occurence of double new lines (to meet the convention of code completion)
        if "\n\n" in decoded:
            decoded = decoded[:decoded.index("\n\n")]

        return decoded
