require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (for contact form)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    // We could pass dynamic data here, like projects or skills from a JSON file
    res.render('index');
});

// Resume download route
app.get('/resume/Madana_Venkatesh_Resume.pdf', (req, res) => {
    const resumePath = path.join(__dirname, 'public', 'resume', 'Madana_Venkatesh_Resume.pdf');
    res.download(resumePath, 'Madana_Venkatesh_Resume.pdf', (err) => {
        if (err) {
            res.status(404).send('Resume not found. Please check back later.');
        }
    });
});

// Start the server
const https = require('https');
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
    // Self-ping to prevent Render's free tier from sleeping
    const APP_URL = process.env.APP_URL; 
    if (APP_URL) {
        // Ping every 14 minutes (Render sleeps after 15 mins of inactivity)
        setInterval(() => {
            https.get(APP_URL, (res) => {
                console.log(`Self-ping status: ${res.statusCode} to keep server awake`);
            }).on('error', (err) => {
                console.error(`Self-ping error: ${err.message}`);
            });
        }, 14 * 60 * 1000); 
    }
});
