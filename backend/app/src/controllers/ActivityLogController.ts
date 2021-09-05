import * as express from "express";
import { _ } from "lodash-node";
import IActivityLogModel = require("./../model/interfaces/IActivityLogModel");
import { ActivityLogModel } from "./../model/barrel/";
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import Constants = require('../config/constants/Constants');
import http = require('http');


/**
 * Activity Log Controller
 * 
 * @class ActivityLogController
 */
class ActivityLogController extends BaseController {


    /**
     *  List all records.
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req, res: express.Response, next: express.NextFunction): void {

        console.log("Wooooooooooooooohhooooooooooooooo");
        try {
            // var options = {
            //     host: 'www.random.org',
            //     path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new',
            //     method: 'GET'
            // };

            // let callback = function (response) {
            //     var str = '';

            //     //another chunk of data has been recieved, so append it to `str`
            //     response.on('data', function (chunk) {
            //         str += chunk;
            //     });

            //     //the whole response has been recieved, so we just print it out here
            //     response.on('end', function () {
            //         console.log(str);
            //     });
            // }
            // http.request(options, callback).end();

            // const url =
            //     "https://maps.googleapis.com/maps/api/geocode/json?address=Florence";

            // http.get(url, res => {
            //     res.setEncoding("utf8");
            //     let body = "";
            //     res.on("data", data => {
            //         body += data;
            //     });
            //     res.on("end", () => {
            //         body = JSON.parse(body);
            //         console.log(
            //             `City: ${body.results[0].formatted_address} -`,
            //             `Latitude: ${body.results[0].geometry.location.lat} -`,
            //             `Longitude: ${body.results[0].geometry.location.lng}`
            //         );
            //     });
            // });


            // http.get({
            //     hostname: 'https://maps.googleapis.com/maps/api/geocode/json?address=Florence',
            //     port: 80,
            //     path: '/',
            //     agent: false  // create a new agent just for this one request
            // }, (res) => {
            //     // Do stuff with response
            //     console.log("my response is=================",res);
            // });

            // var options = {
            //     host: 'www.google.com',
            //     path: '/index.html',
            //     method:"GET"
            // };

            // var req1 = http.request(options, function (res) {
            //     console.log('STATUS: ' + res.statusCode);
            //     console.log('HEADERS: ' + JSON.stringify(res.headers));

            //     // Buffer the body entirely for processing as a whole.
            //     var bodyChunks = [];
            //     res.on('data', function (chunk) {
            //         // You can process streamed parts here...
            //         bodyChunks.push(chunk);
            //     }).on('end', function () {
            //         var body = Buffer.concat(bodyChunks);
            //         console.log('BODY: ' + body);
            //         // ...and/or process the entire body here.
            //     })
            // });

            // req1.on('error', function (e) {
            //     console.log('ERROR: ' + e.message);
            // });


            // var options = {
            //     url: 'https://github.com/login/oauth/access_token',
            //     headers: {
            //         'User-Agent': 'request',
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json'
            //     },
            //     // body: {
            //     //     "client_id": "461e2b6455eaaa0ff0a1",
            //     //     "client_secret": "71099acca9128d91748670b24e18a40897c71428",
            //     //     "code": "a03c6a24e5106f553dcb"
            //     // },
            //     method:'GET'
            // };

            // function callback(error, response, body) {
            //     if (!error && response.statusCode == 200) {
            //         // var info = JSON.parse(body);
            //         console.log("this is body", body);
            //         // console.log(info.stargazers_count + " Stars");
            //         // console.log(info.forks_count + " Forks");

            //         if(error)
            //             {
            //                 console.log("this is error",error);
            //             }
            //     }
            // }
            // 
            //             request(options, callback);


     


            let current_user = req.session.current_user;

            var model = new ActivityLogModel();

            model.search({}, req.query).then((result) => {

                // Get total count
                model.count({}, req.query).then(totalCount => {
                    let returnResult = {
                        log: result,
                        totalCount: totalCount
                    }

                    return res.json(returnResult);
                });

            }).catch(next);
        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }
    /**
     * Get Those workspaces whom are not personal
     * @param req 
     * @param res 
     * @param next 
     */
    public getLog(req, res: express.Response, next: express.NextFunction): void {
        try {
            let current_user = req.session.current_user;
            let t_id: string = req.params._id;
            let model_name: string = req.params._model;

            var model = new ActivityLogModel();

            let cond = {
                $and: [
                    { '_id': { $exists: true } },
                    { '_id': { $ne: null } },
                    { model_changed: model_name },
                    { document_id: t_id }
                ]
            }

            model.findAllByAttributes(cond).then((result) => {
                if (result) {
                    //PCM: low (right now above sorting method is not working thats why doing manual sorting)
                    result = _.sortBy(result, "action_at").reverse();
                }
                return res.json(result);

            }).catch(next);
        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }
}

export = ActivityLogController;


