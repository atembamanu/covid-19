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
      infectionsByRequestedTime: {
        inDays: 20,
        inWeeks: 120,
        inMonths:130
      }
    },

    severeImpact: {
      currentlyInfected: sCurrentlyInfected,
      infectionsByRequestedTime: {
        inDays: 20,
        inWeeks: 1120,
        inMonths:11130
      }
    }
  };
};

export default covid19ImpactEstimator;
