
import {ErrorMessage} from './ErrorMessage';

var operatorsToBeRemoved = {
    "[":0,
    "]":1,
    "(":2,
    ")":3,
    "{":4,
    "}":5,
    ":":6,
    ";":7,
    "\'":8,
    "\"":9
};

export class ErrorMessageParser{

    javaVersionPattern: RegExp = new RegExp("((javac?)|(jdk)) ?(v(ersion)?)? ?1.([1-9])(.[\\d_]+)?");
    javaLangExceptionPattern: RegExp = new RegExp("java\\.lang\\.([a-zA-Z]+(Exception|Bounds|Error))");
    javaIOExceptionPattern: RegExp = new RegExp("java\\.io\\.([a-zA-Z]+(Exception|Error))");




    addAllInSet(matchedKeywords:Set<string>,matchedGroups:string[]){
        matchedGroups.forEach((group)=>{
            matchedKeywords.add(group);
        });
    }

    addAllInList(matchedKeywords:string[],matchedGroups:string[]){
        matchedGroups.forEach((group)=>{
            matchedKeywords.push(group);
        });
    }

    replaceAll(operatorsToBeRemoved:Object ,line:string){
        let output:string = "";

        for(let idx = 0;idx<line.length;idx++){
            if(!(line[idx] in operatorsToBeRemoved)){
                output+=line[idx];
            }
        }

        return output;

    }

    convertToArray(matchedKeywords:Set<string>){
        let outputArray = [];

        for(let item of matchedKeywords){
            outputArray.push(item);
        }

        return outputArray;

    }


    parseFirstLine(message:string[]){
        if(message.length === 0){
            return "";
        }
        if(message[0] === "\n"){
            return "";
        }

        return this.replaceAll({":":0},message[0].split("\n")[0]);
    }

    parseCompilerError(messages:ErrorMessage){
        let error = messages.get("ERROR");
        let warning = messages.get("WARNING");
        let information = messages.get("INFORMATION");

        let matchedKeywords:Set<string> =  new Set();

        matchedKeywords.add("COMPILE ERROR");
        this.addAllInSet(matchedKeywords,this.findPattern(this.javaLangExceptionPattern,[error]));
        this.addAllInSet(matchedKeywords,this.findPattern(this.javaIOExceptionPattern,[error]));
        this.addAllInSet(matchedKeywords,this.findPattern(this.javaVersionPattern,[error,warning,information]));


        //filtering of tokens is remaining
        error.forEach((errorMessage)=>{
            console.log(`${errorMessage} inside parseCompilerError function in ErrorMessageParser file`);
            errorMessage.split("\n").forEach((line)=>{
                let tokens = this.replaceAll(operatorsToBeRemoved,line).split("\n");
                this.addAllInSet(matchedKeywords,tokens);
            });

        });

        let newArray:string[] = this.convertToArray(matchedKeywords);
        newArray.push(this.parseFirstLine(error));

        console.log(newArray);

        return newArray.join(" ");

    }

    parseRuntimeError(messages:ErrorMessage){
        let error = messages.get("ERROR");
        let warning = messages.get("WARNING");
        let information = messages.get("INFORMATION");

        let matchedKeywords:Set<string> =  new Set();

        matchedKeywords.add("RUNTIME ERROR");
        this.addAllInSet(matchedKeywords,this.findPattern(this.javaLangExceptionPattern,[error]));
        this.addAllInSet(matchedKeywords,this.findPattern(this.javaIOExceptionPattern,[error]));
        this.addAllInSet(matchedKeywords,this.findPattern(this.javaVersionPattern,[error,warning,information]));


        //filtering of tokens is remaining
        error.forEach((errorMessage)=>{
            console.log(`${errorMessage} inside parseRuntimeError function in ErrorMessageParser file`);
            errorMessage.split("\n").forEach((line)=>{
                let tokens = this.replaceAll(operatorsToBeRemoved,line).split("\n");
                this.addAllInSet(matchedKeywords,tokens);
            });

        });

        let newArray:string[] = this.convertToArray(matchedKeywords);
        newArray.push(this.parseFirstLine(error));

        return newArray.join(" ");

    }



    findPattern(pattern:RegExp,textBlocks:any){
        let matchedGroups:string[] = [];
        textBlocks.forEach((messageArray: string[]) => {
            for(let i=0;i<messageArray.length;i++){
                let textMatcher = pattern.exec(messageArray[i]);
                let index = 0;  
                while(textMatcher!==null && textMatcher.length>0){
                    matchedGroups.push(textMatcher[index]);
                    index++;
                }
            }
        });

        return matchedGroups;
    }

};