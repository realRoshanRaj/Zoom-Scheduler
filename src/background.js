/* eslint-disable no-unused-vars */
import SecureLS from "secure-ls";
const ls = new SecureLS();
let state = JSON.parse(ls.get("vuex"));
browser.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  // browser.tabs.executeScript({
  //   file: "content-script.js",
  // });
  const alarms = await browser.alarms.getAll();
  state = JSON.parse(ls.get("vuex"));
  if (state.notificationTime > 0) {
    state.data.forEach((value, index) => {
      const exists = alarms.filter((alarm) => alarm.name === value.uuid);
      if (value.notification && exists.length === 0) {
        const when =
          getNearestDate(state.data[index]) - state.notificationTime * 60000;
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
  const item = getElementFromUUID(info)[0];

  const os = state.os;
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
  browser.notifications.create(info.name, {
    type: "basic",
    iconUrl: browser.extension.getURL("icons/48.png"),
    title: "Zoom Scheduler",
    message: getElementFromUUID(info.name)[0].name + ": Click to Join Meeting",
  });
});

//Functions
function getElementFromUUID(uuid) {
  state = JSON.parse(ls.get("vuex"));
  const data = state.data;
  return data.filter((value) => value.uuid == uuid);
}

function getNearestDate(item) {
  const end = false;
  let date = new Date();
  if (item.schedule.mode == "once") {
    const year = item.schedule.date.split("-")[0],
      month = item.schedule.date.split("-")[1],
      day = item.schedule.date.split("-")[2];
    date.setFullYear(year, parseInt(month) - 1, day);
    date.setHours(item.schedule.startTime.split(":")[0]);
    date.setMinutes(item.schedule.startTime.split(":")[1]);
    date.setSeconds(0);
  } else {
    const today = new Date();

    let leastDiff = 8,
      nextDay;
    for (const i of item.schedule.days) {
      let diff = days[i.toLowerCase()] - today.getDay();
      if (diff < 0) diff += 7;

      if (diff == 0) {
        const et = end ? item.schedule.endTime : item.schedule.startTime;
        //Check Times
        const current = today.toString().substr(16, 5);
        if (et < current) {
          diff += 7;
        }
      }

      if (diff < leastDiff) {
        leastDiff = diff;
        nextDay = i;
      }
    }
    date.setDate(date.getDate() + leastDiff);
    date.setHours(item.schedule.startTime.split(":")[0]);
    date.setMinutes(item.schedule.startTime.split(":")[1]);
    date.setSeconds(0);
  }
  return date;
}

const days = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};
