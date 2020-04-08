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
  const period = timePeriods(data.timeToElapse);
  const iCurrentlyInfected = data.reportedCases * 10;
  const sCurrentlyInfected = data.reportedCases * 50;
  const iInfectionsByRequestedTime = iCurrentlyInfected * (2 ** period);
  const sInfectionsByRequestedTime = sCurrentlyInfected * (2 ** period);
  const iSevereCasesByRequestedTime = iInfectionsByRequestedTime * 0.15;
  const sSevereCasesByRequestedTime = sInfectionsByRequestedTime * 0.15;
  const availableCovid19Beds = data.totalHospitalBeds * 0.35;
  const iHospitalBedsByRequestedTime = availableCovid19Beds - iSevereCasesByRequestedTime;
  const sHospitalBedsByRequestedTime = availableCovid19Beds - sSevereCasesByRequestedTime;
  return {
    data: input,

    impact: {
      currentlyInfected: iCurrentlyInfected,
      infectionsByRequestedTime: iInfectionsByRequestedTime,
      severeCasesByRequestedTime: iSevereCasesByRequestedTime,
      HospitalBedsByRequestedTime: iHospitalBedsByRequestedTime
    },

    severeImpact: {
      currentlyInfected: sCurrentlyInfected,
      infectionsByRequestedTime: sInfectionsByRequestedTime,
      severeCasesByRequestedTime: sSevereCasesByRequestedTime,
      HospitalBedsByRequestedTime: sHospitalBedsByRequestedTime
    }
  };
};

export default covid19ImpactEstimator;
