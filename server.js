const express = require('express');
const app = express();
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, `.env`) });
const cors = require("cors")
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const notFoundMiddleware = require("./middlewares/notFound");
const bodyParser = require('body-parser');
const connectDB = require('./utils/db')

// Connect Database
connectDB()

// Init Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan("tiny"));

const whitelist = ["http://127.0.0.1:3000", "localhost", "http://localhost:3000", "https://teranis.in"];

const corsOptions = {
	// eslint-disable-next-line consistent-return
	origin(origin, callback) {
		if (!origin) { // for mobile app and postman client
			return callback(null, true);
		}
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (req, res, ) => {
    res.send('API of Teranis 23 website is running successfully');
});

// Define Routes
app.use('/api/v1', require('./routes/index'));

app.use(notFoundMiddleware);
app.use(require("./middlewares/errorHandler"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));