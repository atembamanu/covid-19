const errors = require('restify-errors');
const Covid19 = require('../models/Covid19');
const estimate = require('../src/estimator');
const xmlFormat = require('object-to-xml');
const fs = require('fs');



module.exports = server => {

    server.get('/api/v1/on-covid-19/logs', (req, res, next) => {
        res.setHeader('content-type', 'text/plain');
        const path = process.cwd();
        try {
            const data = fs.readFileSync(path + '/logs.json', 'utf8')
            const lines = data.split('\n');
            // remove one line, starting at the first position
            lines.splice(-1, 1);
            // join the array back into a single string
            const finalData = lines.join('\n');
            res.end(finalData);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(err.message));
        }
    });


    //add data

    server.post('/api/v1/on-covid-19', async (req, res, next) => {
        res.setHeader('content-type', 'application/json');
        getJsonResponce(req, res, next);

    });

    server.post('/api/v1/on-covid-19/json', async (req, res, next) => {
        res.setHeader('content-type', 'application/json');
        getJsonResponce(req, res, next);
    });

    server.post('/api/v1/on-covid-19/xml', async (req, res, next) => {
        res.setHeader('content-type', 'application/xml');
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
                    '@': {
                        type: "dict"
                    },
                    '#': {
                        region: {
                            '@': {
                                type: "dict"
                            },
                            '#': {
                                name: region.name,
                                avgAge: region.avgAge,
                                avgDailyIncomeInUSD: region.avgDailyIncomeInUSD,
                                avgDailyIncomePopulation: region.avgDailyIncomePopulation
                            }

                        },
                        periodType: data.periodType,
                        timeToElapse: data.timeToElapse,
                        reportedCases: data.reportedCases,
                        population: data.population,
                        totalHospitalBeds: data.totalHospitalBeds
                    }
                },
                impact: {
                    '@': {
                        type: "dict"
                    },
                    '#': {
                        currentlyInfected: impact.currentlyInfected,
                        infectionsByRequestedTime: impact.infectionsByRequestedTime,
                        severeCasesByRequestedTime: impact.severeCasesByRequestedTime,
                        hospitalBedsByRequestedTime: impact.hospitalBedsByRequestedTime,
                        casesForICUByRequestedTime: impact.casesForICUByRequestedTime,
                        casesForVentilatorsByRequestedTime: impact.casesForVentilatorsByRequestedTime,
                        dollarsInFlight: impact.dollarsInFlight
                    }

                },
                severeImpact: {
                    '@': {
                        type: "dict",
                    },
                    '#': {
                        currentlyInfected: severeImpact.currentlyInfected,
                        infectionsByRequestedTime: severeImpact.infectionsByRequestedTime,
                        severeCasesByRequestedTime: severeImpact.severeCasesByRequestedTime,
                        hospitalBedsByRequestedTime: severeImpact.hospitalBedsByRequestedTime,
                        casesForICUByRequestedTime: severeImpact.casesForICUByRequestedTime,
                        casesForVentilatorsByRequestedTime: severeImpact.casesForVentilatorsByRequestedTime,
                        dollarsInFlight: severeImpact.dollarsInFlight
                    }

                }
            };


            res.end(xmlFormat(obj));
            next();

        } catch (err) {
            return next(new errors.InternalError(err.message));
        }
    });


    function getJsonResponce(req, res, next) {
        //console.log(req.path());
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
};