const express = require("express");
const express_handlebars = require("express-handlebars");
const body_parser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port_num = process.env.PORT || 3000;

const password = process.env.DB_PASSWORD;

mongoose.connect(`mongodb+srv://root:${password}@cluster0-2ojqq.mongodb.net/pair?retryWrites=true&w=majority`, { useNewUrlParser: true })
    .then(() => console.log("Connected to mongodb+srv")).catch(err => console.log(err));
var db = mongoose.connection;

const UserModel = mongoose.model("User", {
    "name": {
        type: String,
        trim: true,
        minlength: 1,
        required: true
    },
    "token": {
        type: Number,
    }
})

app.use(express.static(__dirname + '/public'));
app.use(body_parser.urlencoded("extended: true"));

app.engine("handlebars", express_handlebars());
app.set("view engine", "handlebars");

app.get("/", (request, response) => response.redirect("/home"));

app.get("/home", (request, response) => {
    UserModel.find().then((users) => {

        let user_list = users.map((user) => { return { id: user._id, name: user.name, token: user.token } })

        response.render("home", { users: user_list });
    })
});

app.post("/plus", (request, response) => {
    console.log(request.body)
    UserModel.findByIdAndUpdate(request.body.id, { $set: { "token": Number(request.body.token) + 1 } })
        .then((doc) => {
            if (!doc) {

                return response.status(404).send();
            }
            response.redirect("/home");
        })
        .catch((err) => {
            return response.status(400).send();
        })
});


app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

app.listen(port_num, () => {
    console.log(`[INFO] listening at http://localhost:${port_num}`)
})