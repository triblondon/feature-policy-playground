
window.DemoUtils = {
  reportDemoResult: (isWorking, { failReason, resultDetail } = {}) => {
    const thisURL = new URL(window.location.href);
    window.top.postMessage({
      type: "feature-test-result",
      demoID: thisURL.searchParams.get('demoID'),
      isWorking: isWorking,
      failReason: failReason,
      resultDetail: resultDetail
    }, "*");
  }
};
