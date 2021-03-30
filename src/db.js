const mongoose = require('mongoose')

const connectDB = async (db) => {
  try {
    await mongoose.connect(db, {
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useCreateIndex:true,
        useFindAndModify:false
    });
    console.log('MongoDB is connected')
  } catch(err) {
      console.error(err.message);
      //Exit process with failure 1
      process.exit(1)
  }
}

module.exports = connectDB

//siempre que usemos async await querremos utilizar un try-catch block
//en caso de que ocurran algun error, evitamos el crash y mostramos el error
