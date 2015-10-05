var SERVER_HOST = '10.195.69.64';
//var SERVER_HOST = '127.0.0.1:3000';

var API_ROUTE = '/nso/api';
var defPayload = {};

var _       = require('lodash');
var should  = require('chai').should();
var request = require('supertest');

function checkAPI(apiId, desc, payload, func) {
  var data = {
    "id": apiId,
    "payload": defPayload
  };

  data.payload = _.merge(payload, data.payload);
  console.log('checkAPI apiId:', apiId, ', data:', JSON.stringify(_.cloneDeep(data), null, 2));

  it(apiId +" - " + desc, function (done) {
    request("http://"+SERVER_HOST)
      .post(API_ROUTE)
      .send(data)
      .timeout(30*1000)
      .set('Accept', 'application/json')
      //.set('Content-Length', data.length)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(func.bind(null, done));
  });
}


describe("getAccountInfo", function () {

  checkAPI('getAccountInfo',
    'should return account info',
    {},
    function (done, err, res) {
      should.not.exist(err);
      var data = res.body;
      console.log('getAccountInfo data:', data);

      data.should.have.property('lang');
      data.should.have.property('providerId');
      data.should.have.property('tenantId');
      data.should.have.property('userId');
      data.service.should.not.be.empty;

      // set default payload
      defPayload.lang = data.lang;
      defPayload.providerId = data.providerId;
      defPayload.tenantId = data.tenantId;
      defPayload.userId = data.userId;
      defPayload.serviceId = data.service[0];


      describe("Devices", function () {


        checkAPI('getSupportedDeviceTypes',
          'should return a list of SupportedDeviceTypes with length greater then 0',
          {},
          function (done, err, res) {
            should.not.exist(err);
            var data = res.body;

            should.not.exist(data.error);

            should.exist(data.list);
            data.list.should.not.be.empty;

            done();
          });

        checkAPI('getDevices',
          'should return a list of Devices with length greater then 0',
          {},
          function (done, err, res) {
            should.not.exist(err);
            var data = res.body;

            should.not.exist(data.error);

            should.exist(data.list);
            data.list.should.not.be.empty;


            // find device that does not have a serial
            var deviceId = null;
            for(var i = 0; i < data.list.length; i++) {
              if(!data.list[i].serialId) {
                deviceId = data.list[i].id;
                break;
              }
            }

            if(deviceId) {
              /*
              checkAPI('setDeviceInfo',
                'should set device serialId',
                {
                  "deviceId": deviceId,
                  "serialId": ""
                },
                function (done, err, res) {
                  should.not.exist(err);
                  var data = res.body;

                  should.not.exist(data.error);

                  done();
                });
                */
            }

            done();
          });

        /*
        var randomSerialId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        var deviceId = null;
        checkAPI('validateDeviceSerial',
          'should validate new device',
          {
            "serialId": randomSerialId
          },
          function (done, err, res) {
            should.not.exist(err);
            var data = res.body;

            should.not.exist(data.error);

            should.exist(data.status);
            data.status.should.equal('ok');

            done();
          });
          */

        /*
        checkAPI('addDevice',
          'should add a new device',
          {
            "serialId": randomSerialId
          },
          function (done, err, res) {
            should.not.exist(err);
            var data = res.body;

            try {
              should.not.exist(data.error);
            } catch (err) {
              console.log("addDevice data:", data);
              throw err;
            }

            should.exist(data.id);
            // save device for later
            deviceId = data.id;


            if (deviceId) {
              describe("Remove Devices", function () {
                var newRandomSerialId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

                checkAPI('validateDeviceSerial',
                  'should validate new device',
                  {
                    "serialId": randomSerialId
                  },
                  function (done, err, res) {
                    should.not.exist(err);
                    var data = res.body;

                    should.exist(data.error);
                    data.error.should.equal("serialId.duplicate");

                    done();
                  });

                checkAPI('hotswapDevice',
                  'should add hotswap device',
                  {
                    "deviceId": deviceId,
                    "newSerialId": newRandomSerialId
                  },
                  function (done, err, res) {
                    should.not.exist(err);
                    var data = res.body;

                    should.not.exist(data.error);

                    should.exist(data.status);
                    data.status.should.equal('ok');

                    done();
                  });

                checkAPI('setDeviceInfo',
                  'should set device info',
                  {
                    "deviceId": deviceId,
                    "name": "test device - " + (new Date()).toString(),
                    "location": {
                      "la": "37.785168",
                      "lo": "-122.398065",
                      "address": "Ulica Sv.Marije 6, HR-20109 Brnaze, Croatia"
                    }
                  },
                  function (done, err, res) {
                    should.not.exist(err);
                    var data = res.body;

                    should.not.exist(data.error);

                    done();
                  });

                checkAPI('deleteDevice',
                  'should delete a device',
                  {
                    "deviceId": deviceId
                  },
                  function (done, err, res) {
                    should.not.exist(err);
                    var data = res.body;

                    should.not.exist(data.error);

                    should.exist(data.status);
                    data.status.should.equal('ok');

                    done();
                  });
              });
            }

            done();
          });
        */

      });

      done();
    });

});
