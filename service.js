'use strict';

angular.module('cv.server.services',['cv.server.core'])
  .factory('serverServices', ['serverCore', 'serverDevices', '$http', 'CONST', '$q', '$queueFactory', function (serverCore, serverDevices, $http, CONST, $q, $queueFactory) {

    function getService(serviceId) {
      return serverCore.post("getServiceById", {"id":serviceId})
        .then(function(response) {
          return response;
        })
    }

    function getServiceOptions(serviceId) {
        return serverCore.post("getServiceOptions", {"id":serviceId})
        .then(function(response) {

            _.forEach(response, function(item){
              if(_.isObject(item)) {
                if(item.type == 'bucket') {
                  item._hasQoSFlag = false;

                  // if the server doesn't pass QoS enabled then set enabled by default
                  if(item.hasOwnProperty('enabled')) {
                    item._hasQoSFlag = true;
                  } else {
                    item.enabled = true;
                  }
                }
              }
            });

            return response;
        })
    }

    function getOpenMapLocation(address) {
      var url = "//nominatim.openstreetmap.org/search/"+encodeURIComponent(address)+"?format=json&addressdetails=1&limit=20";

      return $http.get(url)
        .then(function(res) {
          var tempLocations = res.data;
          var locations = [];
          //console.log('getOpenMapLocation tempLocations:', tempLocations);

          tempLocations = _.filter(tempLocations, function(tmpLoc){
            if( tmpLoc &&
                tmpLoc.osm_type &&
               (tmpLoc.osm_type.toLowerCase() === 'node' ||
                tmpLoc.osm_type.toLowerCase() === 'way')) {
              return (tmpLoc.class.toLowerCase() != "boundry" &&
                      tmpLoc.class.toLowerCase() != "place");
            }
            return false;
          });

          _.forEach(tempLocations, function(tmpLoc) {
            var loc = {
              suggestion: true,
              geo: {
                "la": tmpLoc.lat,
                "lo": tmpLoc.lon
              },
              address: tmpLoc.display_name
            };

            locations.push(loc);
          });
          //console.log("getLocation locations:", locations);

          return locations;
        })
        .catch(function(err){
        });
    }

    function getMapBoxLocation(address) {
      //var url = "//open.mapquestapi.com/geocoding/v1/address?key="+CONST.MAPQUEST_ID+"&location=" + address;
      var url = "//api.tiles.mapbox.com/v4/geocode/mapbox.places/"+address+".json?access_token="+CONST.ACCESS_TOKEN;

      function isSuggestion(type) {
        type = type.toLowerCase();
        return (type == "point" || type == "address" || type == "intersection" || type == "street");
      }

      return $http.get(url)
        .then(function(res) {

          var tempLocations = res.data.features;
          var locations = [];

          _.forEach(tempLocations, function(tmpLoc) {
            var loc = {
              suggestion: isSuggestion(tmpLoc.geometry.type),
              geo: {
                "la": tmpLoc.geometry.coordinates[1],
                "lo": tmpLoc.geometry.coordinates[0]
              },
              address: tmpLoc.place_name
            };

            locations.push(loc);
          });
          //console.log("getLocation locations:", locations);

          //var locations = data.data.results[0].locations;
          //console.log(JSON.stringify(locations[0], null, 2));
          // locations[i].geocodeQuality == "POINT" || locations[i].geocodeQuality == "ADDRESS" || locations[i].geocodeQuality == "INTERSECTION" || locations[i].geocodeQuality == "STREET"
          /*
           var loc = {
           geocodeQuality: '',
           location: {
           "la": latlng.lat,
           "lo": latlng.lng
           },
           "address": locationObj.adminArea1 + ', ' + locationObj.adminArea3 + ', ' + locationObj.adminArea4 + ', ' + locationObj.adminArea5 + ', ' + locationObj.adminArea6 + ', ' + locationObj.postalCode + ', ' + locationObj.street
           };
           */
          /*
           var locations = [
           {
           "latLng": {
           "lng": -1.253796,
           "lat": 49.424136
           },
           "adminArea4": "Cherbourg",
           "adminArea5Type": "City",
           "adminArea4Type": "County",
           "adminArea5": "Village des Mézières",
           "street": "",
           "adminArea1": "FR",
           "adminArea3": "Lower Normandy",
           "type": "s",
           "displayLatLng": {
           "lng": -1.253796,
           "lat": 49.424136
           },
           "linkId": 0,
           "postalCode": "",
           "sideOfStreet": "N",
           "dragPoint": false,
           "adminArea1Type": "Country",
           "geocodeQuality": "CITY",
           "geocodeQualityCode": "A5XXX",
           "mapUrl": "https://open.mapquestapi.com/staticmap/v4/getmap?key=Fmjtd|luurn16yl9,bg=o5…4241365,-1.2537959,0,0|&center=49.4241365,-1.2537959&zoom=12&rand=59022403",
           "adminArea3Type": "State"
           }
           ];
           */

          return locations;
        })
        .catch(function(err){
        });
    }

    function getCountryCodes() {
      return $http.get('customization/countryCodes.json')
        .then(function(response) {
          return response.data;
        } )
        .catch(function(err) {
          //console.log(err);
        });
    }

    /**
     * NOTE - currently uses an open source project to ge the country code by IP address.
     * Another option would be to use an open source project that returns the latitude and longitude of a user
     * by their IP address, then we could calculate the distance of each address to the user and sort the address
     * suggestions based on distance. Estimate about 1 hour's worth of work.
     * @returns {*}
     */
    function getCountryByIPAddress() {
      var deferred = $q.defer();
      deferred.resolve(CONST.PREFERED_COUNTRY_CODE);
      return deferred.promise;
    }

    // set new value for the service option of given type: 'buckets' ot 'choice'
    // provide {selectedId: newId } for choice option type as newValue,
    // or {buckets: {new_bucket} for bucket option type
    function setServiceOption(optionId, type, newValue, enabled) {

      return $queueFactory.clearStatus().then(function() {

        return serverCore.post("setServiceOption", {type: type, optionId: optionId, data: newValue, enabled: enabled})
        .then(function(res) {
            return $queueFactory.start(res);
        });

      }, function(error) {
        //console.log(error);
        return error;
      });

    }

    return {
      getAllServices: function () {
        return serverCore.post("getServices")
          .then(function(servicesData) {

            var service = servicesData[0];

            // if service status does not exist then default to up
            if(service && !service.hasOwnProperty('status')) {
              service.status = 'up';
            }

            if(!service.optionList) {
              service._version = "MVP3";
              service.downloadClient = true;

              // need to getServiceById
              return getService(service.id)
                .then(function(serviceById) {
                  serviceById = serviceById[0];
                  //console.log("getAllServices serviceById:", serviceById);
                  service = _.merge(service, serviceById);

                  if(!service.options) {
                    service.options = {};

                    // fix invalid API format from backend
                    if(service.hasOwnProperty('users')) {
                      service.options.users = service.users;
                    }
                    if(service.hasOwnProperty('speed')) {
                      service.options.speed = service.speed;
                    }
                  }

                  if(!service.vpnUrl && service.url) {
                    service.vpnUrl = service.url;
                  }

                  if(!service.devices && service.device) {
                    service.devices = service.device;
                    delete service.device;
                  }

                  _.forEach(service.devices, function(device){
                    if(device.address && device.location) {
                      device.location.address = device.address;
                      delete device.address;
                    }
                  });

                  //console.log("getAllServices service:", service);
                  return service;
                });
            } else {
              // need to add devices
              service._version = "MVP4";

              var len = 0;
              for(var e in service.optionList) {
                var obj = service.optionList[e];
                if(obj.choice.name || obj.choice.desc) {
                    len++;
                }
              }
              service.optionLen = len;

              return serverDevices.getDevices({getConfigs: false}).then(function(devices){
                // convert object map into array
                service.devices = _.values(devices);

                return service;
              });
            }
          });
      },

      getService: getService,
      getServiceOptions: getServiceOptions,
      setServiceOption: setServiceOption,

      getServicePerformanceHistory: function (serviceId) {
        return serverCore.post("getPerformanceHistory", {"id":serviceId})
          .then(function(response) {
            return response;
          })
      },

      getServicePerformanceGraphData: function (serviceId, range) {
        return serverCore.post("getServicePerformanceGraphData", {"serviceId":serviceId, "range": range || 1})
          .then(function(response) {
            return response;
          })
      },

      getServiceSiteDetails: function () {
        return serverCore.post("getSiteDetails")
          .then(function(response) {
            return response;
          });
      },

      getServiceUsageHistory: function () {
        return serverCore.post("getServiceUsageHistory")
          .then(function(response) {
            //console.log('getServiceUsageHistory data:', response);
            return response;
          });
      },

      getGraphData: function (range) {
        return serverCore.postData("getChartData", {"range":range});
      },

      getMonthlyServiceUsage: function(serviceId) {
        return serverCore.post('getMonthlyServiceUsage', {'id': serviceId});
      },

      getMonthlyDeviceUsage: function(deviceIds) {
        return serverCore.post('getMonthlyDeviceUsage', {'deviceIds': deviceIds});
      },

      getAddress: function(geo) {
        var url = "//api.tiles.mapbox.com/v4/geocode/mapbox.places/"+geo.lo+","+geo.la+".json?access_token="+CONST.ACCESS_TOKEN;

        return $http.get(url)
          .then(function(res) {
            var tempLocations = res.data.features[0];
            var loc = {
              geo: {
                "la": tempLocations.geometry.coordinates[1],
                "lo": tempLocations.geometry.coordinates[0]
              },
              address: tempLocations.place_name
            };

            return loc;
          });
      },

      getLocation: function(address) {
          var loc = [];

          // shortcut response
          if(!address) {
            var deferred = $q.defer();
            deferred.resolve(loc);
            return deferred.promise;
          }

        return getCountryCodes().then(function(countryCodes) {

          var idx = _.findIndex(countryCodes, function(code){
            return _.has(code, 'default');
          });
          var prefCountryCode = "";
          if( countryCodes && countryCodes[idx] && countryCodes[idx].default ) {
            prefCountryCode = countryCodes[idx].default;
          }

          return getOpenMapLocation(address)
            .then(function(l){
              loc = loc.concat(l);
              return getMapBoxLocation(address);
            })
            .then(function(l) {

              // Filter out only the preferred country codes
              countryCodes = countryCodes.filter(function(item) {
                if (item.code &&
                    item.code.toLowerCase() === prefCountryCode.toLowerCase()) {
                  return true;
                }
              });

              // Combine both address results into one result.
              var results = loc.concat(l);

              // Remove any duplicate results based on latitude and longitude.
              results = _.uniq(results, function(item) {
                if (item && item.la && item.lo) {
                  return item.geo.la + "," + item.geo.lo;
                } else {
                  return item;
                }
              });


              var priorityAddresses = [], standardAddresses = [];
              results.forEach(function(item) {
                var matchFound = false;
                countryCodes.some(function(countryCode) {
                  var addressPieces = item.address.split(",");
                  addressPieces.some(function(piece) {
                    piece = piece.trim();
                    if (piece === countryCode.name) {
                      matchFound = true;
                      return true;
                    }
                    return false;
                  });
                });

                if (matchFound) {
                  priorityAddresses.push(item);
                } else {
                  standardAddresses.push(item);
                }
              });

              return priorityAddresses.concat(standardAddresses);
            });

        });

      }
    }
  }]);
