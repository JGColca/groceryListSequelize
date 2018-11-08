const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
//const session = require('express-session')
const models = require('./models')

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/add-list', function (req, res) {
// create a new post
let shoppinglist = models.shoppinglist.build({
    name: req.body.listname,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state
})

shoppinglist.save().then(function (newList) {
    console.log(newList)
}).then(function(){
    res.redirect('/shoppinglists')
})
})

app.post('/update-list', function (req, res) {
    
    models.shoppinglist.update({
        name: req.body.listName,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state
    }, {
        where: {id: req.body.listId}}).then(function () {
        res.redirect('/shoppinglists')
    })
    

})

app.post('/delete-list', function (req, res) {
    // create a new post
    models.shoppinglist.destroy({
        where: {id: req.body.listId
        }
        
    }).then(function () {
        res.redirect('/shoppinglists')
    })
})

app.get('/shoppinglists/listid/:listId', function (req, res) {

    let listId = req.params.listId

    models.shoppinglist.findById(listId).then(function (shoppinglist) {
        res.json(shoppinglist)
    })

})

app.get('/shoppinglists/update/:listId', function (req, res) {

    let listId = req.params.listId

    models.shoppinglist.findById(listId).then(function (shoppinglists) {
        
        res.render('update-list', {shoppinglists: shoppinglists})
    })

})

app.get("/shoppinglists/state/:state", function (req, res) {

    let state = req.params.state

    models.shoppinglist.findAll({
        where: {
            state: state
        }
    }).then(function (lists) {
        res.json(lists)
    })

})
app.get('/shoppinglists', function (req, res) {

    models.shoppinglist.findAll().then(function (shoppinglists) {
        res.render('shoppinglists', {shoppinglists: shoppinglists})
    })
})

app.get('/shoppinglists/new', function (req, res) {
    res.render('new-list')
})



app.listen(3000, function (req, res) {
    console.log("Server started..")
})