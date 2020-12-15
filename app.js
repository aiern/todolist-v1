const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const date = require(__dirname + "/date.js")

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true })

const itemsSchema = {
  name: String
}

const Item = mongoose.model(
  "Item", itemsSchema
)

const item1 = new Item({
  name: "Welcome to your todo list"
})
const item2 = new Item({
  name: "Hit the + button to add a new item"
})
const item3 = new Item({
  name: "<-- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3]

app.get('/', function (req, res) {


  Item.find({}, function (err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log("Successfully saved default items to database")
        }

      });
      res.redirect('/')
    } else {

      res.render("list", { listTitle: "Today", newListItem: foundItems })
    }
  });


  // const day = date.getDate()


});

app.post('/', function (req, res) {

  const itemName = req.body.newItem

  const item = new Item({
    name: itemName
  })

  // save itemName into the collection of item
  item.save()

  res.redirect('/')


  // if (req.body.list === 'Work') {
  //   workItems.push(item)
  //   res.redirect("/work")
  // } else {

  //   items.push(item)
  //   res.redirect('/')
  // }
  // console.log(req.body)

})

app.post('/delete', function (req, res) {
  const checkedItemId = req.body.checkbox
  Item.findByIdAndDelete(checkedItemId, function (err) {
    if (!err) {
      console.log("Successfully deletion")
      res.redirect('/')
    }
  })
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