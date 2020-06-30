const express = require("express");
const express_handlebars = require("express-handlebars");
const body_parser = require("body-parser");

const app = express();
const port_num = 3000;

let web_data = {
    users: [
        {
            name: "Olin",
            token: 1
        },
        {
            name: "Clara",
            token: 1
        },
        {
            name: "Edo",
            token: 1
        },
    ]
}

function plus_one_to(web_data, name_to_find) {
    let user_index = web_data.users.findIndex((user) => {
        console.log(user.name)
        return user.name == name_to_find
    });

    if (user_index != -1) {
        web_data.users[user_index].token += 1;
    }
}

app.use(express.static(__dirname + '/public'));
app.use(body_parser.urlencoded("extended: true"));

app.engine("handlebars", express_handlebars());
app.set("view engine", "handlebars");

app.get("/", (request, response) => response.redirect("/home"));

app.get("/home", (request, response) => {
    response.render("home", web_data);
});

app.post("/plus", (request, response) => {
    plus_one_to(web_data, request.body.plus_one);
    response.redirect("/home");
});


app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

app.listen(port_num, () => {
    console.log(`[INFO] listening at http://localhost:${port_num}`)
})