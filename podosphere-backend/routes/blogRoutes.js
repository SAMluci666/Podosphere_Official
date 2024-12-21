const express = require("express");
const blogController = require("../controller/blogController");
const authController = require("../controller/authController");
const handlerFactory = require("../controller/handlerFactory");

const router = express.Router();

router
	.route("/")
	.get(handlerFactory.addResponseFieldRestriction("-author", "-description"), blogController.getAllBlogs);
router
	.route("/relevance")
	.get(
		blogController.sortByLikes,
		handlerFactory.addResponseFieldRestriction("-author", "-description"),
		blogController.getAllBlogs
	);

router.route("/detail/:slug").get(handlerFactory.addSlug, blogController.getAllBlogs);

router
	.route("/like/:slug")
	.post(handlerFactory.addSlug, blogController.addLike)
	.delete(handlerFactory.addSlug, blogController.removeLike);

// protect all routes after these middleware
router.use(authController.protect);

// restricting to admin
router.use(authController.restrictTo("admin"));

router.route("/").post(blogController.addAuthor, blogController.createBlog);

router.route("/:id").get(blogController.getBlog).patch(blogController.updateBlog).delete(blogController.deleteBlog);

module.exports = router;
