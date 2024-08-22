const express = require("express");
const app = express();
const port = 3000;
const methodOverride = require('method-override');

const posts = [
    {
        id: 1,
        title: 'Successful people tend to be persistent',
        content: "Successful people tend to be persistent. New ideas often don't work at first, but they're not deterred. They keep trying and eventually find something that does. Mere obstinacy, on the other hand, is a recipe for failure. "
    },
    {
        id: 2,
        title: `They won't listen`,
        content: "They won't listen. They beat their heads against a wall and get nowhere. But is there any real difference between these two cases? Are persistent and obstinate people actually behaving differently? Or are they doing the same thing, and we just label them later as persistent or obstinate depending on whether they turned out to be right or not?"
    }
];

app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));  
app.set('view engine', 'ejs');

//ROUTES

app.get('/', (req,res) =>{
    res.render('index', {posts:posts})
})

app.get('/post/:id', (req,res) =>{
    const post = posts.find(p => p.id === parseInt(req.params.id))
    res.render('post', {post:post})
})

app.get('/newpost', (req,res) =>{
    res.render('newpost')

})

app.post('/newpost', (req,res) =>{
    // to be done
    const { title, content} = req.body;
    const newPost = {
        id:posts.length + 1,
        title,
        content
    };
    posts.push(newPost);
    res.redirect("/")
})

app.get('/editpost/:id', (req,res) =>{
     const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);
  

    if (!post) {
            res.status(404).send('Post not found');
          } else {
            // post.title = req.body.title;
            // post.content = req.body.content;
            res.render('editpost', {post:post, id:id})
          }
    
})

app.post('/editpost/:id', (req,res) =>{
    // to be done
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id)

    if (!post) {
        res.status(404).send('Post not found');
      } else {
        post.title = req.body.title;
        post.content = req.body.content;
        res.redirect('/');
      }
})



app.delete('/deletepost/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const postIndex = posts.findIndex(post => post.id === id);

    if (postIndex === -1) {
      res.status(404).send('Post not found');
    } else {
      posts.splice(postIndex, 1);

      res.redirect('/');
    }
  });

app.listen(port, ()=>{
    console.log(` server started on port ${port}`)
})