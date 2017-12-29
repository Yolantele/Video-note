if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI: 'mongodb://jolanta:jolanta@ds231987.mlab.com:31987/jolantajas'}
} else {
  module.exports = {
    mongoURI: 'mongodb://jolanta:jolanta@ds231987.mlab.com:31987/jolantajas'}
}
