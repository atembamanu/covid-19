const covid19ImpactEstimator = (data) => {
  const input = data;
  const iCurrentlyInfected = data.reportedCases * 10;
  const sCurrentlyInfected = data.reportedCases * 50;
  return {
    data: input,

    impact: {
      currentlyInfected: iCurrentlyInfected,
      infectionsByRequestedTime: {
        inDays: 20,
        inWeeks: 120,
        inMonths: 130
      }
    },

    severeImpact: {
      currentlyInfected: sCurrentlyInfected,
      infectionsByRequestedTime: {
        inDays: 20,
        inWeeks: 1120,
        inMonths: 11130
      }
    }
  };
};

export default covid19ImpactEstimator;
