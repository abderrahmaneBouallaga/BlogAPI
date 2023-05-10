const Post = require("./../models/postsModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const mongoose = require('mongoose')

exports.getAllPosts = catchAsync(async (req, res, next) => {
    // EXECUTE QUERY //
    const features = new APIFeatures(Post.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const post = await features.query;

    res.status(200).json({
      status: "success",
      result: post.length,
      data: {
        post,
      },
    })
});

exports.getPost = catchAsync(async (req, res, next) => {

    const post = await Post.findById(req.params.id);
   
    if(!post) {
      return next(new AppError('No post found with that ID', 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
});

exports.createPost = catchAsync(async (req, res, next) => {
    const newPost = await Post.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        post: newPost,
      },
    });
});

exports.updatePost = catchAsync(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if(!post) {
      return next(new AppError('No post found with that ID', 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  })

exports.deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findByIdAndDelete(req.params.id);

    if(!post) {
      return next(new AppError('No post found with that ID', 404))
    }
 
    res.status(204).json({
      status: "success",
      data: null,
    });
});

exports.getNewPosts = catchAsync(async (req, res, next) => {
    const today = new Date().toISOString().slice(0, 10);

    const stats = await Post.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, today]
          }
        }
      }
    ])
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    })
})