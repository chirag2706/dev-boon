
import {SidebarProvider} from './sidebarProvider';
import {description} from "./description";

var operatorsToBeRemoved = {
    "\'":0,
    "\"":1,
    "\\":2,
    "\/":3
};
function replaceAll(operatorsToBeRemoved:Object ,line:string){
    let output:string = "";
    for(let idx = 0;idx<line.length;idx++){
        if(!(line[idx] in operatorsToBeRemoved)){
            output+=line[idx];
        }
    }
    return output;
}

export class error_query{
    async give_final_parsed_string(line:string){
        if(line.indexOf('java')!==-1){
            line=line.toLowerCase();
            line = replaceAll(operatorsToBeRemoved,line);
            var startIndex = line.indexOf('error');
            var checkIndex = line.indexOf('java');
            var exceptionIndex = line.indexOf('exception');
            console.log(`startIndex is:${startIndex}`);
            console.log(`checkIndex is:${checkIndex}`);
            console.log(`exceptionIndex is:${exceptionIndex}`);
            var finalParsedString='none';
            if((startIndex !== -1 && checkIndex!==-1)||(checkIndex !== -1 && exceptionIndex!== -1)){
                finalParsedString = line.substr(checkIndex,line.length-checkIndex);
            }
            return finalParsedString;
        }
        console.log(line);
        var Python_ModuleNotFoundError= new RegExp("ModuleNotFoundError"); // match[1]
        var Python_ImportError = new RegExp("ImportError"); // match[1]

        var Python_ZeroDivisionError = new RegExp("ZeroDivisionError");
        var Python_KeyboardInterrupt = new RegExp("KeyboardInterrupt");
        var Python_ValueError = new RegExp("ValueError");
        var Python_TypeError = new RegExp("TypeError");
        var Python_IndentationError = new RegExp("IndentationError");
        var Python_SyntaxError = new RegExp("SyntaxError");
        var Python_RuntimeError = new RegExp("RuntimeError");
        var Python_ReferenceError = new RegExp("ReferenceError");
        var Python_OSError = new RegExp("OSError");
        var Python_KeyError = new RegExp("KeyError");
        var Python_IndexError = new RegExp("IndexError");
        var Python_FloatingPointError = new RegExp("FloatingPointError");
        var Python_EOFError = new RegExp("EOFError");
        var Python_AttributeError = new RegExp("AttributeError");
        var Python_AssertionError = new RegExp("AssertionError");
        var Python_NameError = new RegExp("NameError");

        var r1=Python_ModuleNotFoundError.test(line);
        var r2=Python_ImportError.test(line);
        var r3=Python_ZeroDivisionError.test(line);
        var r4=Python_KeyboardInterrupt.test(line);
        var r5= Python_ValueError.test(line); 
        var r6= Python_TypeError.test(line);
        var r7= Python_IndentationError.test(line);
        var r8= Python_SyntaxError.test(line);
        var r9= Python_RuntimeError.test(line);
        var r10= Python_ReferenceError.test(line);
        var r11= Python_OSError.test(line);
        var r12= Python_KeyError.test(line);
        var r13= Python_IndexError.test(line);
        var r14= Python_FloatingPointError.test(line);
        var r15= Python_EOFError.test(line);
        var r16= Python_AttributeError.test(line);
        var r17= Python_AssertionError.test(line);
        var r18=Python_NameError.test(line);

        if(r1){
            return line;
        }
        else if(r2){
            return line;
        }
        else if(r3){
            return "Python ZeroDivisionError ";
        }
        else if(r4){
            return "Python KeyboardInterrupt ";
        }
        else if(r5){
            return "Python ValueError ";
        }
        else if(r6){
            return "Python TypeError ";
        }
        else if(r7){
            return "Python IndentationError ";
        }

        else if(r8){
            return "Python SyntaxError ";
        }
        else if(r9){
            return "Python RuntimeError ";
        }
        else if(r10){
            return "Python ReferenceError ";
        }
        else if(r11){
            return "Python OSError ";
        }
        else if(r12){
            return "Python KeyError ";
        }
        else if(r13){
            return "Python IndexError ";
        }
        else if(r14){
            return "Python FloatingPointError ";
        }
        else if(r15){
            return "Python EOFError ";
        }
        else if(r16){
            return "Python AttributeError ";
        }
        else if(r17){
            return "Python AssertionError ";
        }
        else if(r18){
            return "Python NameError ";
        }
        else{
            return 'none';
        }
    }
}