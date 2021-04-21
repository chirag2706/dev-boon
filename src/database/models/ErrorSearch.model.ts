/**
 *  Schema(Logical) of our database for Error and Search Query
 */
const ErrorSearchScheme = new Schema(
  {
    link:{type:String,required:true},
    langauge:{type:String,required:true},
    codeSnippets:
        {
            code:{type:String},
            quality:{type:Number}
        }
  }
);

const ErrorSearch = mongoose.model('ErrorSearch', ErrorSearchScheme);

module.exports = ErrorSearch;



