if(process.env.NODE_ENV !== "production"){
	require('dotenv').config(); 
}

const express = require('express');
const app =  express();
const cors = require('cors');
const axios = require('axios');

app.use(express.json());
app.use(cors());

const { scopes } = require('./config');

// Authorization Route
app.get("/oauth/authorize", (req, res) => {
	let { redirect_uri, response_type } = req.query;
	let queryStrings = 
	`client_id=${process.env.UNSPLASH_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=${response_type}&scope=${scopes.join("+")}`;
	let authUrl = `${process.env.UNSPLASH_AUTHORIZATION_URL}?${queryStrings}`;
	res.redirect(301, authUrl);
})

// Access Token Route
app.post("/oauth/token", async (req, res) => {
	let { redirect_uri, grant_type, code } = req.body;

	let data = {
		client_id: process.env.UNSPLASH_CLIENT_ID,
		client_secret: process.env.UNSPLASH_CLIENT_SECRET,
		redirect_uri,
		grant_type,
		code
	}

	try {
		const response = await axios.post(process.env.UNSPLASH_OAUTH_TOKEN_URL, data);
		res.status(response.status).json(response.data);
	} catch (err) {
		console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
})

var port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Meander API Server online on port ${port} - ` + new Date());
});