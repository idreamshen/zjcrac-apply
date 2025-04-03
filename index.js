const config = require('./conf/config.json');
var url = null;

async function run_task() {
  try {
    const response = await fetch(url, config.reqData);
    const responseJson = await response.json();
    const responseData = JSON.stringify(responseJson);
    console.log(`请求结果: ${responseData}`);
  } catch (e) {
    console.error(`请求出错: ${e.message}`);
  }
}

function batch_run(delayMs, repeatNum) {
  console.log(`计划延迟 ${delayMs} 毫秒后，重复执行任务 ${repeatNum} 次`);
  setTimeout(() => {
    for (let i=0; i<repeatNum; i++) {
      run_task();
    }
  }, delayMs);
}

(async function app() {
  if (!config.reqData) {
    console.error("请先设置 config.json 中的 reqData 参数");
    return;
  }

  if (!config.urlAid) {
    console.error("请先设置 config.json 中的 urlAid 参数");
    return;
  }

  console.log(`Aid: ${config.urlAid}`);

  const domain = config.reqDomain || 'wx.unoc.cn';
  url = `https://${domain}/app/index.php?i=5&c=entry&aid=${config.urlAid}&do=post&m=dayu_workorder`;
  console.log(`请求地址为: ${url}`);

  console.log("尝试请求");
  await run_task();

  console.log("目标时间: %s", config.targetTime);

  const targetTimeUnix = new Date(config.targetTime).getTime();
  const now = Date.now();
  const diffMs = targetTimeUnix - now;
  if (diffMs < 0) {
    console.log("目标时间已过期");
    return;
  }
  console.log("剩余秒数: %d", Math.round(diffMs / 1000));

  batch_run(diffMs - 2 * 1000, 5)
  batch_run(diffMs - 1 * 1000, 10)
  batch_run(diffMs - 100, 30)
  batch_run(diffMs - 0, 50)
  batch_run(diffMs + 50, 50)
  batch_run(diffMs + 100, 20)
  batch_run(diffMs + 200, 10)
  batch_run(diffMs + 1000, 5)
  batch_run(diffMs + 2000, 5)
})();
