const express = require('express');
const router = express.Router();

//Bring in post model
let Post = require('../models/post');

//bring in user model
let User = require('../models/user');

// Posts page
router.get('/', ensureAuthenticated, (req, res) => {
    Post.find({}, (err, posts) => {
    if (err){
      console.log(err);
    } else {
      res.render('posts', {
          url: '/posts',
        title: "Posts",
        posts: posts
      });
    }
  });
});

//Add post Route
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('add_post', {
		title: "Add Post"
	});
});

//Add Submit post route
router.post('/add', (req, res) => {
	req.checkBody('title', 'Title is required.').notEmpty();
	// req.checkBody('author', 'Author is required.').notEmpty();
	req.checkBody('body', 'Body is required.').notEmpty();
	
	
	// Get Errors
	let errors = req.validationErrors();
	
	if(errors){
		res.render('add_post', {
			title:'Add Post',
			errors:errors
		});
	} else {
	let post = new Post();
	post.title = req.body.title;
	post.author = req.user._id;
	post.body = req.body.body;

	post.save((err) => {
		if(err){
			console.log(err);
			return;
		} else {
			req.flash('positive', 'Post Added.');
			res.redirect('/posts');
		}
	});
	}
});

//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Post.findById(req.params.id, (err, post) => {
		if(post.author != req.user._id){
			req.flash('error', 'User not authorized!');
			res.redirect('/');
		}
		res.render('edit_post', {
			title:'Edit Post',
			post:post
		});
	});
});

//Update Submit post route
router.post('/edit/:id', (req, res) => {
	let post = {};
	post.title = req.body.title;
	post.author = req.body.author;
	post.body = req.body.body;
	
	let query = {_id:req.params.id}

	Post.update(query, post, (err) => {
		if(err){
			console.log(err);
			return;
		} else {
			req.flash('positive', 'Post Updated.')
			res.redirect('/');
		}
	});
});

//Delete Post Route
router.delete('/:id', (req, res) => {
	if(!req.user._id){
		res.status(500).send();
	}
	
	let query = {_id:req.params.id}
	
	Post.findById(req.params.id, (err, post) => {
		if(post.author != req.user._id){
			res.status(500).send();
		} else {
			Post.remove(query, (err) => {
				if(err){
					console.log(err);
				}
				res.send('Success');
			});
		}
	});
});

//Get Single Post
router.get('/:id', (req, res) => {
	Post.findById(req.params.id, (err, post) => {
		User.findById(post.author, (err, user) => {
			res.render('post', {
				post:post,
				author: user.name
			});	
		});
	});
});

//Access Control
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error', 'Please login.');
		res.redirect('/users/login');
	}
};

module.exports = router;
