import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var userPost = [];
var isEditing = false;

app.get("/", (req,res) => {
    res.render("index.ejs", { userPost:userPost });
});

app.get("/about", (req,res) => {
    res.render("about.ejs");
});

app.get("/contact", (req,res) => {
    res.render("contact.ejs");
});

app.post("/edit-post", (req,res) => {
    let editUserPost = {
        editPostID : req.body["userID"],
        editRecipeTitle : req.body["userRecipeTitle"],
        editRecipe : req.body["userRecipe"]
    };
    isEditing = true;
    res.render("index.ejs", { userPost: userPost, editUserPost: editUserPost, editStatus: isEditing });
});

app.post("/delete-post", (req,res) => {
    var deletePostID = req.body["userID"];
    userPost = userPost.filter(post => post["userID"] !== deletePostID);
    //res.render("index.ejs", { userPost:userPost });
    res.redirect("/");
});

app.post("/", (req,res) => {
    if (isEditing) {
        userPost = userPost.map(post => {
            if (post.userID === req.body.userID) {
                return {
                    userID: post.userID,
                    userRecipeTitle: req.body["userRecipeTitle"],
                    userRecipe: req.body["userRecipe"]
                };
            }
            return post; 
        });
        isEditing = false;
    } else {
        let newUserPost = {
            userID : uuidv4(),
            userRecipeTitle : req.body["userRecipeTitle"],
            userRecipe : req.body["userRecipe"]
        };
        userPost.push(newUserPost);
    }
    res.redirect("/");
});

app.post("/send-message", (req,res) => {
    res.redirect("/contact");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});