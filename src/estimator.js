const covid19ImpactEstimator = (data) => {
  const input = data;
  const period = (data.timeToElapse) / 3;
  return {
      data: input,

      impact:{
        currentlyInfected: data.reportedCases * 10,
        infectionsByRequestedTime: impact.currentlyInfected * (2 ** period)
      },

      severeImpact:{
        currentlyInfected: data.reportedCases * 50,
        infectionsByRequestedTime: severeImpact.currentlyInfected * (2 ** period)
      }
  };
};

export default covid19ImpactEstimator;
