const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");


const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true});

const wikiSchema = {
  title:String,
  content: String
};

const articles = mongoose.model("articles",wikiSchema);

///////////////////////////routes for all post////////////////////////////////
app.route("/articles")
.get(function(req,res){
    articles.find(function(err,results){
      if (!err){
        res.send(results);
      }else{
        res.send(err);
      }
    });
})

.post(function(req,res){
  const article = new articles({
    title: req.body.title,
    content: req.body.content
  });
  article.save(function(err){
    if(!err){
    res.send("successfully saved");
  }else{
    res.send(err);
  }
  });
})

.delete(function(req,res){
  articles.deleteMany(function(err){
    if(!err){
      res.send("successfully deleted");
    }
    else{
      res.send(err);
    }
  });
});

/////////////////////////////Routes for specific post///////////////////////////
app.route("/articles/:post")
.get(function(req,res){
  articles.findOne({title:req.params.post},function(err,result){
    if(result){
    if (!err){
      res.send(result);
    }else{
      lres.send(err);
    }
  }else{
    res.send("No result match your query");
  }
  });
})

.put(function(req,res){
  console.log(req.body);
  articles.replaceOne(
    {title:req.params.post},
    req.body,
  function(err){
    if (!err){
      res.send("successfully updated");
    }else{
      res.send(err);
    }
  });
})

.patch(function(req,res){
  articles.updateOne({title:req.params.post},
  {$set:req.body},
function(err){
  if(!err){
    res.send("successfully updated");
  }else{
    res.send(err);
  }
});
})

.delete(function(req,res){
  articles.findOneAndDelete({title:req.params.post},function(err){
    if(!err){
      res.send("successfully deleted");
    }else{
      res.send(err);
    }
  });
});

app.listen(3000,function(){
  console.log("server is connected to port 3000");
});
