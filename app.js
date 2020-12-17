const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
// const date = require(__dirname + "/date.js")
const _ = require("lodash")


const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true }, { useFindAndModify: false })

const itemsSchema = {
  name: String
}

const Item = mongoose.model("Item", itemsSchema)

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

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)

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

});

app.get('/:customeListName', function (req, res) {
  const customeListName = _.capitalize(req.params.customeListName)

  List.findOne({ name: customeListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //Create a new list 
        const list = new List({
          name: customeListName,
          items: defaultItems
        })
        list.save();
        res.redirect("/" + customeListName)
      } else {
        res.render("list", { listTitle: foundList.name, newListItem: foundList.items })
      }
    }
  });

});

app.post('/', function (req, res) {

  // value of users' input stored in the name of input in form 'newItem'
  const itemName = req.body.newItem

  // value of title stored in the name of button in form 'listTitle'
  const listName = req.body.list

  const item = new Item({
    name: itemName
  })

  //if the list name triggered by post request is not the default "Today" it will find the custome list and then
  // addthat item to the custome list
  if (listName === "Today") {
    item.save()
    res.redirect('/')
  } else {
    List.findOne(
      { name: listName }, function (err, foundList) {
        foundList.items.push(item)
        foundList.save()
        res.redirect("/" + listName)
        console.log(listName)
      })
  }
})

app.post('/delete', function (req, res) {
  const checkedItemId = req.body.checkbox
  const listName = req.body.listName

  if (listName === "Today") {
    Item.findByIdAndDelete(checkedItemId, function (err) {
      if (!err) {
        console.log("Successfully deletion")
        res.redirect('/')
      }
    })
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
      if (!err) {
        res.redirect("/" + listName)
      }
    })
  }
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