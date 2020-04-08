const covid19ImpactEstimator = (data) => {
  const input = data;
  const period = (data.timeToElapse) / 3;
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
