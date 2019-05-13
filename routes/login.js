const express = require('express');
const router = express.Router();
const request = require('request');
router.get('/login', (req, res) => {
  request(
    {
      method: 'GET',
      uri: 'https://accounts.spotify.com/authorize',
      useQuerystring: {
        client_id: process.env.Client_ID,
        response_type: 'code',
        redirect_uri: 'localhosts:3000/callback'
      }
    },
    (er, html, body) => {
      res.send(body);
    }
  );
});

router.get('/callback', (req, res) => {
  res.send('redirected here');
});

module.exports = router;
