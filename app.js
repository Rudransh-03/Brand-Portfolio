//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

//newsletter
//const request= require("request");
const https= require("https");

const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Hello everyone and we are DEFINITELY NERDS! We, as college students are always looking for something to watch on youtube or try to find a blog which might summarize a book or talk about some trendy topics reason being students are so involved in their college work that it becomes impossible to find time to do that research on our own. We tried our best to find a resource which fulfills our needs but alas we couldn't find one. So, we decided to start our own project which may help any other person who wants a detailed book review or wants to listen to any 3rd person's review on a general topic may not return dejected. With this vision, we started DEFINITELY NERDS. We hope you stay with us on this journey :)";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://DefnitelyNerds:3JanurayOP@definitelynerds.ycgg4.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/videos", function(req, res){
  res.render("videos");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


//newsletter

// app.use(express.static("public"));
// app.use(bodyParser.urlencoded({extended: true}));

app.get("/newsletter", function(req, res){
  res.render("newsletter");
  //  res.sendFile(__dirname + "/signup.html");
});

app.post("/newsletter", function(req, res){

    const firstName=  req.body.fName;
    const lastName= req.body.lName;
    const email= req.body.email;

    const data= {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    app.post("/failure", function(req, res){
        res.redirect('/newsletter');
    })

    const jsonData= JSON.stringify(data);

    const url= "https://us6.api.mailchimp.com/3.0/lists/676021717c";

    const options= {
        method: "POST",
        auth: "rudransh03:8faf9b7edd8908b59518cb86caad2b35-us6"
    }

    const request= https.request(url, options, function(response){

        if(response.statusCode==200){
            res.redirect("/");
        } else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})




app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});




