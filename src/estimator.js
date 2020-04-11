const covid19ImpactEstimator = (data) => {
  const input = data;
  const {
    region, periodType, timeToElapse, reportedCases, totalHospitalBeds
  } = data;
  function timePeriods(time) {
    let period = 0;
    if (periodType === 'days') {
      period = Math.trunc(time / 3);
    } else if (periodType === 'weeks') {
      period = Math.trunc((time * 7) / 3);
    } else {
      period = Math.trunc((time * 30) / 3);
    }
    return period;
  }
  function dollarsInFlightFunc(time) {
    const {
      timePeriod
    } = data;
    switch (timePeriod) {
      case 'months':
        return time * 30;
      case 'weeks':
        return time * 7;
      default:
        return time;
    }
  }
  const period = timePeriods(timeToElapse);
  const iCurrentlyInfected = reportedCases * 10;
  const sCurrentlyInfected = reportedCases * 50;
  const cost = region.avgDailyIncomeInUSD * dollarsInFlightFunc(timeToElapse);
  const dailyC = region.avgDailyIncomePopulation;
  const iInfectionsByRequestedTime = iCurrentlyInfected * (2 ** period);
  const sInfectionsByRequestedTime = sCurrentlyInfected * (2 ** period);
  const iCasesForICUByRequestedTime = iInfectionsByRequestedTime * 0.05;
  const sCasesForICUByRequestedTime = sInfectionsByRequestedTime * 0.05;
  const iCasesForVentilatorsByRequestedTime = iInfectionsByRequestedTime * 0.02;
  const sCasesForVentilatorsByRequestedTime = sInfectionsByRequestedTime * 0.02;
  const iSevereCasesByRequestedTime = iInfectionsByRequestedTime * (15 / 100);
  const sSevereCasesByRequestedTime = sInfectionsByRequestedTime * (15 / 100);
  const availableCovid19Beds = totalHospitalBeds * 0.35;
  const iHospitalBedsByRequestedTime = availableCovid19Beds - iSevereCasesByRequestedTime;
  const sHospitalBedsByRequestedTime = availableCovid19Beds - sSevereCasesByRequestedTime;
  const iDollarsInFlight = (iInfectionsByRequestedTime * dailyC) * cost;
  const sDollarsInFlight = (sInfectionsByRequestedTime * dailyC) * cost;
  return {
    data: input,

    impact: {
      currentlyInfected: iCurrentlyInfected,
      infectionsByRequestedTime: iInfectionsByRequestedTime,
      severeCasesByRequestedTime: iSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: iHospitalBedsByRequestedTime,
      casesForICUByRequestedTime: iCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: iCasesForVentilatorsByRequestedTime,
      dollarsInFlight: iDollarsInFlight
    },

    severeImpact: {
      currentlyInfected: sCurrentlyInfected,
      infectionsByRequestedTime: sInfectionsByRequestedTime,
      severeCasesByRequestedTime: sSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: sHospitalBedsByRequestedTime,
      casesForICUByRequestedTime: sCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: sCasesForVentilatorsByRequestedTime,
      dollarsInFlight: sDollarsInFlight
    }
  };
};

//  export default covid19ImpactEstimator;
module.exports = covid19ImpactEstimator;
