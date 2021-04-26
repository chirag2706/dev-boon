/**
 *  Schema(Logical) of our database for Error and Search Query
 */
const ErrorSearchScheme = new Schema(
  {
    query:{type:String,required:true},
    ans:{
      type:Object,
      required:true
    }
  }
);

const ErrorSearch = mongoose.model('ErrorSearch', ErrorSearchScheme);

module.exports = ErrorSearch;



