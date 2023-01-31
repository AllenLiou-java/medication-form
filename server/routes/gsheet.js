const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const process = require('process');
const router = express.Router();
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


async function authSheets() {
  //Function for authentication object
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // Create client instance for auth
  const authClient = await auth.getClient();

  // Instance of the Sheets API
  const sheets = google.sheets({
    version: 'v4',
    auth: authClient,
  });

  // spreadsheetId
  const spreadsheetId = '17sr4EnfegjWX0hoLYi6WBEIzwL7qtEqkaGBdvAcfAL0';

  return {
    auth,
    authClient,
    sheets,
    spreadsheetId,
  };
}

// 轉換requestBody資料
function requestBodyFormat(orignData) {
  const dataObj = orignData;

  // 轉換日期格式
  const d = new Date(dataObj.selectedDate);
  const dateFormate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  // 星期日期列表
  const dayList = ['一', '二', '三', '四', '五', '六', '日'];

  dataObj.selectedDate = dateFormate;
  dataObj.selectedDay = dayList[d.getDay()];

  const {
    selectedDate,
    selectedDay,
    dosage,
    bloodPressure,
    skinInfo,
    digestiveSysInfo,
    othersInfo,
    notesContent,
  } = dataObj;

  // 轉換皮膚症狀 - 已選取清單
  skinInfo.checkedLesions = skinInfo.lesions.map((item) => {
    return skinInfo.checkedLesions.includes(item);
  });

  // 轉換消化系統症狀 - 已選取清單
  digestiveSysInfo.checkedLesions = digestiveSysInfo.lesions.map((item) => {
    return digestiveSysInfo.checkedLesions.includes(item);
  });

  // 轉換其他症狀 - 已選取清單
  othersInfo.checkedLesions = othersInfo.lesions.map((item) => {
    return othersInfo.checkedLesions.includes(item);
  });

  return {
    selectedDate,
    selectedDay,
    dosage,
    bloodPressure,
    skinInfo,
    digestiveSysInfo,
    othersInfo,
    notesContent,
  };
}

// 初始化response data
function initResponseData() {
  return {
    dosage: { onAm: null, onPm: null },
    bloodPressure: {
      am: [
        { name: '收縮壓', value: null },
        { name: '舒張壓', value: null },
        { name: '心跳', value: null },
      ],
      pm: [
        { name: '收縮壓', value: null },
        { name: '舒張壓', value: null },
        { name: '心跳', value: null },
      ],
    },
    skinInfo: {
      checkedLesions: [],
      lesions: ['麻', '痛', '腫脹', '皮疹', '搔癢', '掉毛'],
      others: null,
    },
    digestiveSysInfo: {
      checkedLesions: [],
      lesions: ['腹瀉', '食慾不振', '噁心', '嘔吐'],
      others: null,
    },
    othersInfo: { checkedLesions: [], lesions: ['疲勞', '出血', '發燒'] },
    notesContent: null,
  };
}

// 轉換response資料
function responseFormat(targetValue) {
  const initData = initResponseData();

  initData.dosage.onAm = targetValue[2];
  initData.dosage.onPm = targetValue[3];
  initData.bloodPressure.am[0].value = targetValue[4];
  initData.bloodPressure.am[1].value = targetValue[5];
  initData.bloodPressure.am[2].value = targetValue[6];
  initData.bloodPressure.pm[0].value = targetValue[7];
  initData.bloodPressure.pm[1].value = targetValue[8];
  initData.bloodPressure.pm[2].value = targetValue[9];

  // 轉換皮膚症狀 資料
  const skinCheckedLesionsBool = [
    targetValue[10],
    targetValue[11],
    targetValue[12],
    targetValue[13],
    targetValue[14],
    targetValue[15],
  ];

  const skinLesions = ['麻', '痛', '腫脹', '皮疹', '搔癢', '掉毛'];
  const skinCheckedLesions = [];
  skinCheckedLesionsBool.forEach((item, idx) => {
    item = item == 'TRUE';
    if (item) {
      skinCheckedLesions.push(skinLesions[idx]);
    }
  });

  initData.skinInfo.checkedLesions = skinCheckedLesions;
  initData.skinInfo.others = targetValue[16];

  // 轉換消化系統症狀 資料
  const digestiveSysCheckedLesionsBool = [
    targetValue[17],
    targetValue[18],
    targetValue[19],
    targetValue[20],
  ];

  const digestiveSysLesions = ['腹瀉', '食慾不振', '噁心', '嘔吐'];
  const digestiveSysCheckedLesions = [];
  digestiveSysCheckedLesionsBool.forEach((item, idx) => {
    item = item == 'TRUE';
    if (item) {
      digestiveSysCheckedLesions.push(digestiveSysLesions[idx]);
    }
  });

  initData.digestiveSysInfo.checkedLesions = digestiveSysCheckedLesions;
  initData.digestiveSysInfo.others = targetValue[21];

  // 轉換其他症狀 資料
  const othersCheckedLesionsBool = [
    targetValue[22],
    targetValue[23],
    targetValue[24],
  ];

  const othersLesions = ['疲勞', '出血', '發燒'];
  const othersCheckedLesions = [];
  othersCheckedLesionsBool.forEach((item, idx) => {
    item = item == 'TRUE';
    if (item) {
      othersCheckedLesions.push(othersLesions[idx]);
    }
  });

  initData.othersInfo.checkedLesions = othersCheckedLesions;

  initData.notesContent = targetValue[25];

  return initData;
}

// 取得所有資料
async function getDataList() {
  const { sheets, spreadsheetId } = await authSheets();
  const getRows = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Data!A:Z',
  });

  // 將資料轉換為前端的格式
  return getRows.data.values.slice(3);
}

// 取得目標row的index
async function getTargetRowInfo(selectedDate) {
  // 轉換日期格式
  const d = new Date(selectedDate);
  const dateFormate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  const dataList = await getDataList();
  const dateList = dataList.map((item) => {
    return item[0];
  });

  const targetIndex = dateList.indexOf(dateFormate);
  const targetRowValue = dataList[targetIndex];
  const resValue = {};

  if (targetIndex > 0) {
    resValue.index = targetIndex;
    resValue.targetValue = targetRowValue;
  } else {
    resValue.index = targetIndex;
    resValue.targetValue = null;
  }

  return resValue;
}

router.get('/getData', async (req, res) => {
  const querySelectedDate = req.query.selectedDate;
  const target = await getTargetRowInfo(querySelectedDate);

  let resValue = null;
  if (target.index > 0) {
    const targetValue = target.targetValue;
    resValue = responseFormat(targetValue);
  } else {
    resValue = initResponseData();
  }

  res.send(resValue);
});

router.post('/addData', async (req, res) => {
  const { sheets, spreadsheetId } = await authSheets();
  const sheetId = 221934414;

  // reqBody = JSON.parse(JSON.stringify(req.body))

  // 轉換request.body的資料
  const formValue = requestBodyFormat(req.body);
  const {
    selectedDate,
    selectedDay,
    dosage,
    bloodPressure,
    skinInfo,
    digestiveSysInfo,
    othersInfo,
    notesContent,
  } = formValue;

  const requests = [];

  const target = await getTargetRowInfo(req.body.selectedDate);

  const targerIndex = target.index;

  // 儲存格格線樣式設定
  const borderStyle = {
    style: 'SOLID',
    colorStyle: {
      rgbColor: {
        red: 0,
        green: 0,
        blue: 0,
      },
    },
  };

  // 儲存格樣式格式化
  const cellsFormater = (
    inputValue,
    isRangeLimit = false,
    lower = 0,
    upper = 0
  ) => {
    const borderStyle = {
      style: 'SOLID',
      colorStyle: {
        rgbColor: {
          red: 0,
          green: 0,
          blue: 0,
        },
      },
    };

    const setBorder = () => {
      return {
        top: borderStyle,
        bottom: borderStyle,
        left: borderStyle,
        right: borderStyle,
      };
    };

    setTextStyle = () => {
      if (inputValue > upper || inputValue < lower) {
        return {
          foregroundColorStyle: {
            rgbColor: {
              red: 1,
            },
          },
          bold: true,
        };
      }
    };

    // 最後要執行的style內容
    const resultStyle = {};
    resultStyle.borders = setBorder();
    resultStyle.horizontalAlignment = 'CENTER';
    resultStyle.verticalAlignment = 'MIDDLE';

    if (isRangeLimit) {
      resultStyle.textFormat = setTextStyle();
    }

    return resultStyle;
  };

  const rowsContent = [
    {
      values: [
        {
          userEnteredValue: {
            stringValue: selectedDate,
          },
          userEnteredFormat: cellsFormater(),
        },
        {
          userEnteredValue: {
            stringValue: selectedDay,
          },
          userEnteredFormat: cellsFormater(),
        },
        {
          userEnteredValue: {
            stringValue: dosage.onAm.toString(),
          },
          userEnteredFormat: cellsFormater(),
        },
        {
          userEnteredValue: {
            stringValue: dosage.onPm.toString(),
          },
          userEnteredFormat: cellsFormater(),
        },
        {
          userEnteredValue: {
            stringValue: bloodPressure.am[0].value,
          },
          userEnteredFormat: cellsFormater(
            bloodPressure.am[0].value,
            true,
            120,
            140
          ),
        },
        {
          userEnteredValue: {
            stringValue: bloodPressure.am[1].value,
          },
          userEnteredFormat: cellsFormater(
            bloodPressure.am[1].value,
            true,
            80,
            90
          ),
        },
        {
          userEnteredValue: {
            stringValue: bloodPressure.am[2].value,
          },
          userEnteredFormat: cellsFormater(
            bloodPressure.am[2].value,
            true,
            60,
            100
          ),
        },
        {
          userEnteredValue: {
            stringValue: bloodPressure.pm[0].value,
          },
          userEnteredFormat: cellsFormater(
            bloodPressure.pm[0].value,
            true,
            120,
            140
          ),
        },
        {
          userEnteredValue: {
            stringValue: bloodPressure.pm[1].value,
          },
          userEnteredFormat: cellsFormater(
            bloodPressure.pm[1].value,
            true,
            80,
            90
          ),
        },
        {
          userEnteredValue: {
            stringValue: bloodPressure.pm[2].value,
          },
          userEnteredFormat: cellsFormater(
            bloodPressure.pm[2].value,
            true,
            60,
            100
          ),
        },
        {
          userEnteredValue: {
            boolValue: skinInfo.checkedLesions[0],
          },
          userEnteredFormat: cellsFormater(),
          dataValidation: {
            condition: {
              type: 'BOOLEAN',
            },
          },
        },
        {
          userEnteredValue: {
            boolValue: skinInfo.checkedLesions[1],
          },
          userEnteredFormat: cellsFormater(),
          dataValidation: {
            condition: {
              type: 'BOOLEAN',
            },
          },
        },
        {
          userEnteredValue: {
            boolValue: skinInfo.checkedLesions[2],
          },
          userEnteredFormat: cellsFormater(),
          dataValidation: {
            condition: {
              type: 'BOOLEAN',
            },
          },
        },
        {
          userEnteredValue: {
            boolValue: skinInfo.checkedLesions[3],
          },
          userEnteredFormat: cellsFormater(),
          dataValidation: {
            condition: {
              type: 'BOOLEAN',
            },
          },
        },
        {
          userEnteredValue: {
            boolValue: skinInfo.checkedLesions[4],
          },
          userEnteredFormat: cellsFormater(),
          dataValidation: {
            condition: {
              type: 'BOOLEAN',
            },
          },
        },
        {
          userEnteredValue: {
            boolValue: skinInfo.checkedLesions[5],
          },
          userEnteredFormat: cellsFormater(),
          dataValidation: {
            condition: {
              type: 'BOOLEAN',
            },
          },
        },
        {
          userEnteredValue: {
            stringValue: skinInfo.others,
          },
          userEnteredFormat: cellsFormater(),
        },
        {
          userEnteredValue: {
            boolValue: digestiveSysInfo.checkedLesions[0],
          },
          userEnteredFormat: cellsFormater(),
          dataValidation: {
            condition: {
              type: 'BOOLEAN',
            },
          },
        },
        {
          userEnteredValue: {
            boolValue: digestiveSysInfo.checkedLesions[1],
          },
          userEnteredFormat: cellsFormater(),
          dataValidation: {
            condition: {
              type: 'BOOLEAN',
            },
          },
        },
        {
          userEnteredValue: {
            boolValue: digestiveSysInfo.checkedLesions[2],
          },
          userEnteredFormat: cellsFormater(),
          dataValidation: {
            condition: {
              type: 'BOOLEAN',
            },
          },
        },
        {
          userEnteredValue: {
            boolValue: digestiveSysInfo.checkedLesions[3],
          },
          userEnteredFormat: cellsFormater(),
          dataValidation: {
            condition: {
              type: 'BOOLEAN',
            },
          },
        },
        {
          userEnteredValue: {
            stringValue: digestiveSysInfo.others,
          },
          userEnteredFormat: cellsFormater(),
        },
        {
          userEnteredValue: {
            boolValue: othersInfo.checkedLesions[0],
          },
          userEnteredFormat: cellsFormater(),
          dataValidation: {
            condition: {
              type: 'BOOLEAN',
            },
          },
        },
        {
          userEnteredValue: {
            boolValue: othersInfo.checkedLesions[1],
          },
          userEnteredFormat: cellsFormater(),
          dataValidation: {
            condition: {
              type: 'BOOLEAN',
            },
          },
        },
        {
          userEnteredValue: {
            boolValue: othersInfo.checkedLesions[2],
          },
          userEnteredFormat: cellsFormater(),
          dataValidation: {
            condition: {
              type: 'BOOLEAN',
            },
          },
        },
        {
          userEnteredValue: {
            stringValue: notesContent,
          },
          userEnteredFormat: cellsFormater(),
        },
      ],
    },
  ];

  // 已經存有指定日期的資料
  if (targerIndex < 0) {
    // 在最後一行加入資料
    requests.push({
      appendCells: {
        sheetId,
        rows: rowsContent,
        fields: '*',
      },
    });
  } else {
    requests.push({
      updateCells: {
        rows: rowsContent,
        fields: '*',
        start: {
          sheetId,
          rowIndex: parseInt(targerIndex) + 3,
        },
      },
    });
  }

  // Add additional requests (operations) ...
  const batchUpdateRequest = { requests };

  sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    resource: batchUpdateRequest,
  });

  res.status(200).send();
});

module.exports = router;
