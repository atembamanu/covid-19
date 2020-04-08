const covid19ImpactEstimator = (data) => {
  const input = data;
  function timePeriods(time) {
    let period = 0;
    if (data.periodType === 'days') {
      period = Math.trunc(time / 3);
    } else if (data.periodType === 'weeks') {
      period = Math.trunc((time * 7) / 3);
    } else {
      period = Math.trunc((time * 30) / 3);
    }
    return period;
  }
  function dolarsInFlightFunc() {
    let timePeriod = 0;
    const time = data.timeToElapse;
    if (data.periodType === 'days') {
      timePeriod = time;
    } else if (data.periodType === 'weeks') {
      timePeriod = time * 7;
    } else {
      timePeriod = time * 30;
    }
    return data.region.avgDailyIncomeInUSD * timePeriod;
  }
  const period = timePeriods(data.timeToElapse);
  const dailyIncomePeriod = dolarsInFlightFunc();
  const iCurrentlyInfected = data.reportedCases * 10;
  const sCurrentlyInfected = data.reportedCases * 50;
  const dailyC = data.region.avgDailyIncomePopulation;
  const iInfectionsByRequestedTime = iCurrentlyInfected * (2 ** period);
  const sInfectionsByRequestedTime = sCurrentlyInfected * (2 ** period);
  const iCasesForICUByRequestedTime = iInfectionsByRequestedTime * 0.05;
  const sCasesForICUByRequestedTime = sInfectionsByRequestedTime * 0.05;
  const iCasesForVentilatorsByRequestedTime = iInfectionsByRequestedTime * 0.02;
  const sCasesForVentilatorsByRequestedTime = sInfectionsByRequestedTime * 0.02;
  const iSevereCasesByRequestedTime = iInfectionsByRequestedTime * 0.15;
  const sSevereCasesByRequestedTime = sInfectionsByRequestedTime * 0.15;
  const availableCovid19Beds = data.totalHospitalBeds * 0.35;
  const iHospitalBedsByRequestedTime = availableCovid19Beds - iSevereCasesByRequestedTime;
  const sHospitalBedsByRequestedTime = availableCovid19Beds - sSevereCasesByRequestedTime;
  const iDollarsInFlight = (iInfectionsByRequestedTime * dailyC) * dailyIncomePeriod;
  const sDollarsInFlight = (sInfectionsByRequestedTime * dailyC) * dailyIncomePeriod;
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

export default covid19ImpactEstimator;
