const express = require("express");
const multer = require("multer");

const fileUploadController = require("../controller/fileUploadController");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/uploads/");
	},
	filename: function (req, file, cb) {
		const ext = file.originalname.split(".").pop() ?? "";
		const fileName = Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext;

		cb(null, fileName);
	},
});
const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024 * 1,
		files: 1,
	},
});

const router = express.Router();

router.route("/").post(upload.single("file"), fileUploadController.uploadFile);
router.route("/:fileName").post(fileUploadController.deleteFile);

module.exports = router;
