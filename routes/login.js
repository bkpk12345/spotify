const express = require('express');
const router = express.Router();
const request = require('request');
const rp = require('request-promise');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const generateRandomString = function(length) {
  let text = '';
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
const stateKey = 'spotify_auth_state';

router.get('/login', (req, res) => {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.Client_ID,
        scope: scope,
        redirect_uri: 'http://localhost:3000/api/callback',
        state: state
      })
  );
});

router.get('/callback', (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  // if (state === null || state !== storedState) {
  //   res.redirect(
  //     '/#' +
  //       querystring.stringify({
  //         error: 'state_mismatch'
  //       })
  //   );
  // } else {
  res.clearCookie(stateKey);
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: 'http://localhost:3000/api/callback',
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(
          process.env.Client_ID + ':' + process.env.Client_Secret
        ).toString('base64')
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token,
        refresh_token = body.refresh_token;

      // console.log('<<>>>>>><<<', { access_token, refresh_token });

      var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { Authorization: 'Bearer ' + access_token },
        json: true
      };

      // use the access token to access the Spotify Web API
      request.get(options, function(error, response, body) {
        // console.log({ body });
      });

      // we can also pass the token to the browser to make requests from there
      res.redirect(
        '/api/home?' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          })
      );
    } else {
      res.redirect(
        '/api/error?' +
          querystring.stringify({
            error: 'invalid_token'
          })
      );
    }
  });
  // }
});

router.get('/home', async (req, res) => {
  let options = {
    uri: 'https://api.spotify.com/v1/artists/53A0W3U0s8diEn9RhXQhVz',
    headers: {
      Authorization: `Bearer ${req.query.access_token}`
    }
  };

  let data = await rp(options);
  data = JSON.parse(data);
  res.send({ data: data.href });

  // request(options, (er, html, body) => {
  //   return res.pipe({ body });
  // });
});

router.get('/error', (req, res) => {
  res.send('some error');
});
module.exports = router;
