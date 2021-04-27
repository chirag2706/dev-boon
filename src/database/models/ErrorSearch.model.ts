const mongoose_ = require('mongoose');
const Schema_ = mongoose_.Schema;

/**
 *  Schema(Logical) of our database for Error and Search Query
 */
const ErrorSearchScheme = new Schema_(
  {
    query:{type:String,required:true},
    ans:{
      type:Object,
      required:true
    }
  }
);

const ErrorSearch = mongoose_.model('ErrorSearch', ErrorSearchScheme);

module.exports = ErrorSearch;



