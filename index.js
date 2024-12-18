let cipherText = "";
let pattern = "";

let spacingDetails = {
    spacingIgnorant: true,
    nextLetterIndexeroOrMoreSpaces: true, //aka let "helloworld" to be detected as "hello world". 0 or more spaces where original spaces are instead of 1 or more
    numOrMoreSpaces: true, //let "hello     world" be detected for input "hello  world", but not "hello"
    oneOrMoreSpaces: true //let "hello world" be detected for input "hello      world", but not "helloworld"
}

function ConvertToPattern(input, spacing){
    let spacelessInput = input.replaceAll("(\\s)", ""); //for use with letter indices for backref number calculation as spaces mess up the equation (since they arent surrounded by additional spaces when we are space ignorant, like all other letters are)
    let seenLetters = [];
    let patternArray = []
    for(let x = 0; x < input.length; x++){
        let seenLttrIndex = seenLetters.indexOf(spacelessInput[x]);
        if(seenLttrIndex>-1){ //if we've seen the letter before
            let backref = 0;
            if(spacing.spacingIgnorant == true){ //if we want to ignore spacing differences in pattern and sample
                backref = 2(seenLttrIndex)+1; //with the additional spacing capturing groups between each letter capturing group, this means we need to adjust the backref number. we're using a spaceless string as reference bc the spaces mess up this formula in ways that cannot easily be accounted for
                if(patternArray.length>0 && !(patternArray(x-1).includes("s"))){
                    patternArray.push("s*");
                }
            }
            else{
                backref = seenLttrIndex+1;
            }
            patternArray.push(+backref);
        }
        else if(/^\s/.test(input[x])){ //if current character is whitespace
            let numberOfWhitespace = 1; // we got 1 whitespace here
            if(nextLetterIndex!=input.length-1){
                let nextIsWhitespace = /^\s/.test(input[nextLetterIndex]); //check if theres whitespace after the one we just did. if theres more than one we're gonna merge them into 1 whitespace character
                while(nextIsWhitespace && nextLetterIndex!=input.length-1){
                    numberOfWhitespace++;
                    nextLetterIndex++
                    nextIsWhitespace = /^\s/.test(input[nextLetterIndex]);// test following letter
                }
            }
            if(spacing.numOrMoreSpaces){
                if(numberOfWhitespace==1){
                    patternArray.push("s+");
                }
                else{
                    patternArray.push("s{"+numberOfWhitespace+",}"); //if numOfWhitespace = 5 then = "s{5,}", which captures whitespace 5 or more times in a row. POSSIBLE ISSUE FOR FUTURE: Might try to capture '5' of the same whitespace. we dont mind if theyre different strings/types of whitespace
                }
            }
            else if(spacing.nextLetterIndexeroOrMoreSpaces){ //if we are doing complete spaceignorance
                patternArray.push("s*"); //nextLetterIndexero or more whitespace
            }
            else{ // if not then we're doing one or more whitespace
                patternArray.push("s+");
            }
            x+=numberOfWhitespace-1; //increase x by num of whitespace bc we included them all in our capturing group already. we minus one because its going to increase by one anyway in the next loop
        }
        else{ //if we havent seen it and it isnt a space
            if(spacing.spacingIgnorant == true){ //if we want to ignore spacing differences in pattern and sample
                if(patternArray.length>0 && !(patternArray(x-1).includes("s"))){ //if u need a space for after the las character and the last character wasnt a space itself
                    patternArray.push("s*"); //whitespace 0 or more times
                }
            }
            patternArray.push("w"); //just push a word capture
            seenLetters.push(input[x]); //push this letter onto the seen letters array
        }
    }
    return patternArray;
}

function PatternArrayToString(patternStr){} //currently we're putting capturing groups in an array like ["w","w","1","s*","w"]. need to convert that into a string like (\w)(\w)(\1)(\s*)(\w)

// sorry if this sucks. rn i feel like a mad genius despite not running this yet but i am probably fucking this up somewhere. flowcharts make me too confident.
//im half asleep i cant code anymore this is the last thing i will code   gootbye.



//also want to make program for snippets of patterns like e.g "WEDDING PORTRAITS RESTRATION DIDITAL PRINTING ID PASSPORT VIDEO TRANSFER FAX COPIES" has also been seen as just "PASSPORT VIDEO TRANSFER FAX COPIES". i want to be able to search snippets like this without manually adjusting numbers in back references. would be cool if i could search for both at same time.. regex is sadly limited