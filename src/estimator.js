const covid19ImpactEstimator = (data) => {
  const input = data;
  function timePeriods(time) {
    let period = 0;
    if (time === 'days') {
      period = Math.trunc(time / 3);
    } else if (time === 'weeks') {
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
  return {
    data: input,

    impact: {
      currentlyInfected: iCurrentlyInfected,
      infectionsByRequestedTime: iInfectionsByRequestedTime
    },

    severeImpact: {
      currentlyInfected: sCurrentlyInfected,
      infectionsByRequestedTime: sInfectionsByRequestedTime
    }
  };
};

export default covid19ImpactEstimator;
