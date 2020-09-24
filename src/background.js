/* eslint-disable no-unused-vars */
import store from "./store";

browser.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  store.dispatch("onStartup");
  console.log("hello again", store.state.lastOpened);
  // browser.tabs.executeScript({
  //   file: "content-script.js",
  // });
  const alarms = await browser.notifications.getAll();
  console.log(alarms);
  browser.alarms.create(
    "The Name of the Meeting",
    {
      when: Date.now() + 1000,
    } // optional object
  );
});

browser.notifications.onClicked.addListener((info) => {
  console.log("they has been pressed", info);
  browser.tabs.create({ url: "https://google.com" });
});

browser.alarms.onAlarm.addListener((info) => {
  console.log("the alarm");
  browser.notifications.create(store.state.data[0].uuid, {
    type: "basic",
    iconUrl: browser.extension.getURL("icons/48.png"),
    title: "Zoom Scheduler",
    message: info.name,
  });
  console.log(info);
});
