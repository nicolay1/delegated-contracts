const express = require('express')
const ejs = require('ejs')

const app = express()
app.set('view engine', 'ejs');
app.use(express.static('static'));

app.get('/', function (req, res) {
  res.render('index', {});
})

const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Chart app listening on port '+server.address().port)
})
