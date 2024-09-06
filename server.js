const express = require("express");
const app = express();
const port = 3000;
const methodOverride = require('method-override');
const slugify = require("slugify");

// In-memory storage for blog posts
const posts = [
    {
        id: 'successful-people-tend-to-be-persistent',
        title: 'Successful people tend to be persistent',
        content: "Successful people tend to be persistent. New ideas often don't work at first, but they're not deterred. They keep trying and eventually find something that does. Mere obstinacy, on the other hand, is a recipe for failure."
    },
    {
        id: "they-wont-listen",
        title: `They won't listen`,
        content: "They won't listen. They beat their heads against a wall and get nowhere. But is there any real difference between these two cases? Are persistent and obstinate people actually behaving differently? Or are they doing the same thing, and we just label them later as persistent or obstinate depending on whether they turned out to be right or not?"
    }
];

// Middleware setup
app.use(methodOverride('_method')); // Allows HTTP method overrides (e.g., PUT, DELETE) using query parameters
app.use(express.static('public')); // Serves static files from the 'public' directory
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies (from forms)
app.set('view engine', 'ejs'); // Sets EJS as the templating engine

// Routes

// Route for displaying all posts
app.get('/', (req, res) => {
    res.render('index', { posts: posts }); // Render the 'index' view with the posts data
});

// Route for displaying a specific post by ID
app.get('/post/:id', (req, res) => {
    const postId = req.params.id; // Extract post ID from URL parameters
    const post = posts.find(p => p.id === postId); // Find post by ID
    res.render('post', { post: post }); // Render the 'post' view with the post data

    console.log(`Post with ID ${postId} was viewed.`); // Log view action
});

// Route for displaying the new post form
app.get('/newpost', (req, res) => {
    res.render('newpost'); // Render the 'newpost' view
});

// Route for creating a new post
app.post('/newpost', (req, res) => {
    // Extract title and content from form submission
    const { title, content } = req.body;

    // Generate a slug from the title
    const slug = slugify(title, {
        lower: true, // Convert to lowercase
        strict: true // Remove special characters
    });

    // Ensure the slug is unique
    let uniqueSlug = slug;
    let counter = 1;
    while (posts.find(post => post.id === uniqueSlug)) {
        uniqueSlug = `${slug}-${counter}`; // Append counter to slug if needed
        counter++;
    }

    // Create a new post object
    const newPost = {
        id: uniqueSlug,
        title,
        content
    };
    posts.push(newPost); // Add new post to the posts array
    console.log(`Post with ID ${uniqueSlug} was created.`); // Log creation action
    res.redirect("/"); // Redirect to the home page
});

// Route for displaying the edit post form
app.get('/editpost/:id', (req, res) => {
    const id = req.params.id; // Extract post ID from URL parameters
    const post = posts.find(p => p.id === id); // Find post by ID

    if (!post) {
        res.status(404).send('Post not found'); // Handle case where post is not found
    } else {
        res.render('editpost', { post: post, id: id }); // Render the 'editpost' view with post data
    }
});

// Route for updating a post
app.put('/editpost/:id', (req, res) => {
    const id = req.params.id; // Extract post ID from URL parameters
    const post = posts.find(p => p.id === id); // Find post by ID

    if (!post) {
        res.status(404).send('Post not found'); // Handle case where post is not found
    } else {
        // Update post properties
        post.title = req.body.title;
        post.content = req.body.content;
        res.redirect('/'); // Redirect to the home page
    }
});

// Route for deleting a post
app.delete('/deletepost/:id', (req, res) => {
    const id = req.params.id; // Extract post ID from URL parameters
    const postIndex = posts.findIndex(post => post.id === id); // Find index of post

    if (postIndex === -1) {
        res.status(404).send('Post not found'); // Handle case where post is not found
    } else {
        posts.splice(postIndex, 1); // Remove post from posts array
        res.redirect('/'); // Redirect to the home page
    }

    console.log(`Post with ID ${id} was deleted.`); // Log deletion action
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`); // Log server start
});
