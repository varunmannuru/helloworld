//var SERVER_HOST = '10.195.69.64';
var SERVER_HOST = '127.0.0.1:3000';

var API_ROUTE = '/nso/api';
var defPayload = {
    "serviceId": "1_coke_HR1418061014318",
    "providerId": "HR",
    "userId": "test user",
    "tenantId": "coke",
    "lang": "en_US"
};

var _ = require('lodash');
var should = require('chai').should();
var request = require('supertest');

var alphabeth = 'abcdefghijklmnopqrstuvwxyz0123456789';
var emails = ['@gmail.com', '@yahoo.com', '@mail.ru', '@me.com'];

function createUsername() {
    var minLength = 5;
    var maxLength = 15;

    var name = '';
    for (var i = 0; i < _.random(minLength, maxLength); i++) {
        name = name + alphabeth[_.random(0, alphabeth.length - 1)];
    }
    return name + _.shuffle(emails)[0];
}

function checkAPI(apiId, desc, payload, func) {
    var data = {
        "id": apiId,
        "payload": defPayload
    };

    data.payload = _.merge(payload, data.payload);
    console.log('checkAPI data:', data);

    it(apiId + " - " + desc, function(done) {
        request("http://" + SERVER_HOST)
            .post(API_ROUTE)
            .send(data)
            .set('Accept', 'application/json')
            //.set('Content-Length', data.length)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(func.bind(null, done));
    });
}

describe('getUsers', function() {

    checkAPI('getAccountInfo',
        'should return account info',
        {},
        function(done, err, res) {
            should.not.exist(err);
            var data = res.body;

            should.exist(data.lang);
            should.exist(data.providerId);
            should.exist(data.tenantId);
            should.exist(data.userId);
            data.service.should.not.be.empty;

            defPayload = _.merge(data, defPayload);

            var newUsername = createUsername();
            console.log('Created new username:', newUsername);

            describe('Users', function() {
                checkAPI('getUserList',
                    'Should return a non-empty list of users',
                    {},
                    function(done, err, res) {
                        should.not.exist(err);

                        var data = res.body;

                        data.should.not.be.empty;
                        data.should.be.an.Array;


                        var initialUserList = data;

                        console.log("Got users: ", data.map(function(user) {
                            return user.username;
                        }));

                        describe('addUsers', function() {
                            checkAPI('addUsers', 'Should add new users',
                                {
                                    'usernames': [newUsername]
                                }, function(done, err, res) {
                                    should.not.exist(err);
                                    res.body.status.should.equal(1);

                                    console.log("ok, new user added");

                                    // request users again and make sure
                                    // their number increased by 1 and
                                    // the newly created user actually exists
                                    describe('verify new user existance', function() {
                                        checkAPI('getUserList', 'New user should have been added',
                                            {},
                                            function(done, err, res) {
                                                should.not.exist(err);

                                                var data = res.body;

                                                data.should.not.be.empty;
                                                data.should.be.an.Array;

                                                // new user added
                                                (!!(_.find(data, function(user) {
                                                    return user.username == newUsername;
                                                }))).should.be.ok;

                                                console.log("ok, new user has been added");

                                                done();
                                            })

                                    });

                                    done();
                                });
                        });

                        describe('deleteUser', function() {
                            // find a random username to delete

                            var usernameToDelete = _.shuffle(_.map(initialUserList, function(user) {
                                return user.username
                            }))[0];

                            console.log("will detele user", usernameToDelete);

                            checkAPI('deleteUsers', 'Should delete user' + usernameToDelete,
                                {'usernames': [usernameToDelete]},
                                function(done, err, res) {
                                    should.not.exist(err);
                                    res.body.status.should.equal(1);

                                    describe('Verify that user has been deleted', function() {
                                        checkAPI('getUserList', 'New user should have been deleted',
                                            {},
                                            function(done, err, res) {
                                                should.not.exist(err);

                                                var data = res.body;

                                                data.should.not.be.empty;
                                                data.should.be.an.Array;

                                                // new user added
                                                (!!(_.find(data, function(user) {
                                                    return user.username == usernameToDelete;
                                                }))).should.not.be.ok;

                                                console.log("ok, new user has been deleted");

                                                done();
                                            })
                                    });

                                    done();
                                });

                        });

                        describe('updateUsersStatuses', function() {

                            // find a random username to update status
                            var userToUpdate = _.shuffle(initialUserList)[0];

                            var usernameToUpdate = userToUpdate.username;
                            var statusToSet = userToUpdate.status ? 0 : 1;

                            checkAPI('updateUsersStatuses',
                                    'Should update user ' + usernameToUpdate + ' to status ' + statusToSet,
                                {'usernames': [usernameToUpdate], 'status': statusToSet},
                                function(done, err, res) {
                                    should.not.exist(err);
                                    res.body.status.should.equal(1);

                                    describe('Verify that user has been updated', function() {
                                        checkAPI('getUserList', 'New user should have been updated',
                                            {},
                                            function(done, err, res) {
                                                should.not.exist(err);

                                                var data = res.body;

                                                data.should.not.be.empty;
                                                data.should.be.an.Array;

                                                // new user added
                                                var updatedUser = (_.find(data, function(user) {
                                                    return user.username == usernameToUpdate;
                                                }));

                                                updatedUser.status.should.equal(statusToSet);

                                                console.log("ok, new user has been updated");

                                                done();
                                            })
                                    });

                                    done();
                                });

                        });

                        done();
                    });
            });

            done();
        })
});
