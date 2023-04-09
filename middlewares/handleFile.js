const multer = require("multer");
const errorWrapper = require("./errorWrapper");
// const unlinkFile = require('util').promisify(require('fs').unlink);
// const { v4: uuidv4 } = require('uuid');
// let key = uuidv4();

const handleFile = (fileName) => {
	return (req, res, next)=>{
		const upload = multer({
			dest: "./public/data/uploads/",
			fileFilter: (req, file, cb) => {
				console.log(file);
				const validFiles = ["image/jpeg", "image/png", "application/pdf"];
				if (validFiles.includes(file.mimetype)) {
					return cb(null, true);
				}
	
				return cb(new Error("File should be jpg, png or pdf"));
			},
			limits: { fileSize: 6 * 1000 * 1000 },
		}).single(fileName);
	
		upload(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				// A Multer error occurred when uploading.
				console.log(err.message);
			} else if (err) {
				// An unknown error occurred when uploading.
				return res.status(200).json({ message: "Please make sure file is of jpeg, png or pdf format" });
			}
	
			// Everything went fine.
			next();
		});
	}
};


const handleFiles = () => {
	return errorWrapper(async(req, res, next)=>{
		console.log(req.headers['image-fields']);
		const fields = JSON.parse(req.headers['image-fields']).map(field=>{
			return {name: field, maxCount: 1}
		})

		
		const upload = multer({
			dest: "./public/data/uploads/",
			fileFilter: (req, file, cb) => {
				// console.log(file);
				const validFiles = ["image/jpeg", "image/png", "application/pdf"];
				if (validFiles.includes(file.mimetype)) {
					return cb(null, true);
				}
	
				return cb(new Error("File should be jpg, png or pdf"));
			},
			limits: { fileSize: 6 * 1000 * 1000 },
		}).fields(fields)
	
		upload(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				// A Multer error occurred when uploading.
				console.log(err.message);
			} else if (err) {
				// An unknown error occurred when uploading.
				return res.status(200).json({ message: "Please make sure file is of jpeg, png or pdf format" });
			}
	
			// Everything went fine.
			next();
		});
	})
};

module.exports = {
	handleFile,
	handleFiles,
}