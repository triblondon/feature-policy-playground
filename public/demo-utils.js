
window.DemoUtils = (() => {
  let timeout;
  return {
    setupTimeout: (msg, dur) => {
      timeout = setTimeout(() => {
        window.DemoUtils.reportDemoResult(false, {resultDetail: msg});
      }, dur || 500);
    },
    reportDemoResult: (isWorking, { failReason, resultDetail } = {}) => {
      if (timeout) {
        clearTimeout(timeout);
      }
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
})();
