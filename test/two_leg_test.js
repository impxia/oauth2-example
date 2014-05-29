var app = require('./../app');
var assert = require('assert');
var request = require('supertest');
var models = require('./../models');

describe('Two legged sign in', function() {
  var accessToken;
  var refreshToken;

  it('should allow tokens to be requested', function(done) {
    request(app)
      .post('/oauth/token')
      .type('form')
      .send({
        grant_type: 'client_credentials',
        client_id: 'papers3',
        client_secret: '123'
      })
      .expect(200)
      .end(function(err, res) {
        assert(res.body.access_token, 'Ensure the access_token was set');
        assert(res.body.refresh_token, 'Ensure the refresh_token was set');
        accessToken = res.body.access_token;
        refreshToken = res.body.refresh_token;
        done();
      });
  });

  it('should deny tokens to be requested when credential is wrong', function(done) {
    request(app)
      .post('/oauth/token')
      .type('form')
      .send({
        grant_type: 'client_credentials',
        client_id: 'papers3',
        client_secret: '12'
      })
      .expect(400, done);
  });

  it('should permit access to routes that require a access_token', function(done) {
    request(app)
      .get('/secret')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .end(function(err,res){
        console.log(res);
        done();
      });
  });
  
  it('should deny access to routes that provide wrong access_token', function(done) {
    request(app)
      .get('/secret')
      .set('Authorization', 'Bearer ' + accessToken + 'wrong')
      .expect(401, done);
  });
});
