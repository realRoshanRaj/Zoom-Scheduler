/* eslint-disable no-unused-vars */
import store from "./store";

browser.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  // console.log("hello again", store.state.notificationTime);
  // browser.tabs.executeScript({
  //   file: "content-script.js",
  // });
  const alarms = await browser.alarms.getAll();
  // console.log("arl", alarms);
  // alarms.forEach((value) => console.log(new Date(value.scheduledTime)));
  if (store.state.notificationTime > 0) {
    store.state.data.forEach((value, index) => {
      const exists = alarms.filter((alarm) => alarm.name === value.uuid);
      if (value.notification && exists.length === 0) {
        // console.log(value.schedule.startTime);
        const when =
          store.getters.getNextDate(index) -
          store.state.notificationTime * 60000;
        // console.log(index, new Date(when));
        if (when > Date.now()) {
          browser.alarms.create(value.uuid, {
            when,
          });
        }
      }
    });
  }
});

browser.notifications.onClicked.addListener((info) => {
  const item = store.getters.getElementFromUUID(info)[0];

  const os = store.state.os;
  let url;
  if (os.toLowerCase() == "windows" || os.toLowerCase() == "macos") {
    url = `zoommtg://zoom.us/join?confno=${
      item.id +
      (item.pwd ? "&pwd=" + item.pwd : "") +
      (item.uname ? "&uname=" + item.uname : "")
    }`;
  } else {
    url = `https://zoom.us/j/${item.id + (item.pwd ? "?pwd=" + item.pwd : "")}`;
  }

  browser.tabs.create({ url });
});

browser.alarms.onAlarm.addListener((info) => {
  // console.log("the alarm", store.getters.getElementFromUUID(info.name));
  browser.notifications.create(info.name, {
    type: "basic",
    iconUrl: browser.extension.getURL("icons/48.png"),
    title: "Zoom Scheduler",
    message: store.getters.getElementFromUUID(info.name)[0].name,
  });
  console.log(info);
});
