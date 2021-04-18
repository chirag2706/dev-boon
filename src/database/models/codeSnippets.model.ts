const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *  Schema(Logical) of our database for snippet Query
 */
const codeSnippetsSchema = new Schema(
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

const codeSnippets = mongoose.model('codeSnippets', codeSnippetsSchema);

module.exports = codeSnippets;