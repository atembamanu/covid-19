const errors = require('restify-errors');
const Covid19 = require('../models/Covid19');
const estimate = require('../src/estimator');
const xmlFormat = require('object-to-xml');



module.exports = server => {
    //get data
    // server.get('/api/v1/on-covid-19', async (req, res, next) => {
    //     try {
    //         const covid19Data = await Covid19.find({}, { _id: 0, __v: 0 });
    //         const estimated = estimate(covid19Data);
    //         res.send(estimated);
    //         next();
    //     } catch (err) {
    //         return next(new errors.InvalidContentError(`Errors ${err}`));
    //     }

    // });


    //add data

    server.post('/api/v1/on-covid-19', async (req, res, next) => {
        getJsonResponce(req, res, next);
    });

    server.post('/api/v1/on-covid-19/json', async (req, res, next) => {
        getJsonResponce(req, res, next);
    });


    server.post('/api/v1/on-covid-19/xml', async (req, res, next) => {
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects Json"));
        }
        const { name, avgAge, avgDailyIncomeInUSD, avgDailyIncomePopulation } = req.body.region;

        const { periodType, timeToElapse, reportedCases, population, totalHospitalBeds } = req.body;
        const covid19 = new Covid19({
            region: {
                name,
                avgAge,
                avgDailyIncomeInUSD,
                avgDailyIncomePopulation
            },
            periodType,
            timeToElapse,
            reportedCases,
            population,
            totalHospitalBeds
        });
        try {
            const estimated = estimate(covid19);
            const data = estimated.data;
            const region = data.region;
            const impact = estimated.impact;
            const severeImpact = estimated.severeImpact;
            var obj = {
                '?xml version="1.0" encoding="UTF-8"?': null,
                data: {
                    '#': {
                        region: {
                            name: region.name,
                            avgAge: region.avgAge,
                            avgDailyIncomeInUSD: region.avgDailyIncomeInUSD,
                            avgDailyIncomePopulation: region.avgDailyIncomePopulation
                        },
                        periodType: data.periodType,
                        timeToElapse: data.timeToElapse,
                        reportedCases: data.reportedCases,
                        population: data.population,
                        totalHospitalBeds: data.totalHospitalBeds
                    }
                },
                impact: {
                    currentlyInfected: impact.currentlyInfected,
                    infectionsByRequestedTime: impact.infectionsByRequestedTime,
                    severeCasesByRequestedTime: impact.severeCasesByRequestedTime,
                    hospitalBedsByRequestedTime: impact.hospitalBedsByRequestedTime,
                    casesForICUByRequestedTime: impact.casesForICUByRequestedTime,
                    casesForVentilatorsByRequestedTime: impact.casesForVentilatorsByRequestedTime,
                    dollarsInFlight: impact.dollarsInFlight
                },
                severeImpact: {
                    currentlyInfected: severeImpact.currentlyInfected,
                    infectionsByRequestedTime: severeImpact.infectionsByRequestedTime,
                    severeCasesByRequestedTime: severeImpact.severeCasesByRequestedTime,
                    hospitalBedsByRequestedTime: severeImpact.hospitalBedsByRequestedTime,
                    casesForICUByRequestedTime: severeImpact.casesForICUByRequestedTime,
                    casesForVentilatorsByRequestedTime: severeImpact.casesForVentilatorsByRequestedTime,
                    dollarsInFlight: severeImpact.dollarsInFlight
                }
            };

            res.send(xmlFormat(obj));
            console.log(xmlFormat(obj));
            next();

        } catch (err) {
            return next(new errors.InternalError(err.message));
        }
    });


    function getJsonResponce(req, res, next) {
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects Json"));
        }

        const { name, avgAge, avgDailyIncomeInUSD, avgDailyIncomePopulation } = req.body.region;

        const { periodType, timeToElapse, reportedCases, population, totalHospitalBeds } = req.body;
        const covid19 = new Covid19({
            region: {
                name,
                avgAge,
                avgDailyIncomeInUSD,
                avgDailyIncomePopulation
            },
            periodType,
            timeToElapse,
            reportedCases,
            population,
            totalHospitalBeds
        });
        try {
            const estimated = estimate(covid19);
            res.send(estimated);
            next();

        } catch (err) {
            return next(new errors.InternalError(err.message));
        }
    }

    function getXmlResponse(estimated, res) {

    }




};