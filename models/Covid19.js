const mongoose = require('mongoose');

const CovidRegionSchema = new mongoose.Schema({
    _id: 0,
    name:{
        type: String,
        required: true,
        trim: true
    },
    avgAge:{
        type: Number,
        required: true,
        trim: true
    },
    avgDailyIncomeInUSD:{
        type: Number,
        required: true,
        trim: true
    },
    avgDailyIncomePopulation:{
        type: Number,
        required: true,
        trim: true
    }
});
const CovidDataSchema = new mongoose.Schema({
    _id: 0,
    region:{
        type: CovidRegionSchema,
    },
    periodType:{
        type: String,
        required: true,
        trim: true
    },
    timeToElapse:{
        type: Number,
        required: true,
        trim: true
    },
    reportedCases:{
        type: Number,
        required: true,
        trim: true
    },
    population:{
        type: Number,
        required: true,
        trim: true
    },
    totalHospitalBeds:{
        type: Number,
        required: true,
        trim: true
    }
});






const Covid19 = mongoose.model('Covid19', CovidDataSchema);
module.exports = Covid19;