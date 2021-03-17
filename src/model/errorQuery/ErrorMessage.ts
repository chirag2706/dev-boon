export class ErrorMessage{
    information: string[];
    error: string[];
    warning: string[];
    constructor(){
        this.error = [];
        this.warning = [];
        this.information = [];
    }

    get(messageType: string){
        if(messageType === "ERROR"){
            return this.error;
        }else if(messageType === "WARNING"){
            return this.warning;
        }else if(messageType === "INFORMATION"){
            return this.information;
        }else{
            return ["messageType is unrecognized"];
        }
    }

    putSingleMessage(messageType: string,textMessage: string){
        if(messageType === "ERROR"){
            this.error.push(textMessage);
        }else if(messageType === "WARNING"){
            this.warning.push(textMessage);
        }else if(messageType === "INFORMATION"){
            this.information.push(textMessage);
        }else{
            console.log("Message inside ErrorMessage Class: put method is not recognized");
        }
    }


    putMultipleMessage(messageType: string,textMessageList: string[]){
        textMessageList.forEach((textMessage)=>{
            this.putSingleMessage(messageType,textMessage);
        });
    }

};
