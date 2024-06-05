const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/userRouter');
const cors = require('cors');

const app = express();

connectDB();

// Middleware
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Set up Handlebars 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
