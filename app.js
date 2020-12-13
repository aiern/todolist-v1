const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

let items = ["Return $10 to Mr Sheibal", "Email Gary"]

let workItems = []

app.get('/', function (req, res) {

  var today = new Date()

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  var day = today.toLocaleDateString("en-US", options)

  res.render("list", { listTitle: day, newListItem: items })

})

app.post('/', function (req, res) {

  var item = req.body.newItem

  if (req.body.list === 'Work') {
    workItems.push(item)
    res.redirect("/work")
  } else {

    items.push(item)
    res.redirect('/')
  }
  // console.log(req.body)

})

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItem: workItems })
})

// app.post("/work", function (req, res) {
//   let item = req.body.newItem
//   workItems.push(item)
//   res.redirect("/work")
// })
app.get('/about', function (req, res) {
  res.render("about")
})
app.listen(3000, function () {
  console.log('Listening to port 3000')
})