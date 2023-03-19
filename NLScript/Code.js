function myFunction() {
  console.log('Activated myFunction()');

  /*
  const teamTest = {
        "name": "ERN ROAR",
        "image": "https://cdn.nitroleague.de/img/ERNROAR.png",
        "identifier": "27b7kn",
        "tag": "ERN",
        "wonRounds": 41,
        "lostRounds": 17,
        "wonGames": 10,
        "lostGames": 1,
        "disqualified": false,
        "place": 1
  }
  */
  
  //console.log(teamTest);
  //Browser.msgBox(teamTest, Browser.Buttons.OK_CANCEL);
}

function onOpen(event){
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('Script Menu')
  .addItem('Authorize Scripts','authorize')
  .addItem('Test API Call','testAPICall')
  .addSeparator()
  .addSubMenu(ui.createMenu("API Management")
              .addItem('Add API Key','myFunction')
              .addItem('Remove API Key','myFunction')
              )
  .addSeparator()
  .addSubMenu(ui.createMenu("Match Weeks")
              .addItem('Create Single Matchweek','myFunction')
              .addItem('Create Multiple Matchweeks','myFunction')
              )
  .addToUi();

}

// Scraped from Hitomi's Scripts:
// The first time you run a menu function it doesn't actually execute the body
// after authorizing your Google account, you have to run it again to get the intended effect
// Many people get confused by this so I made this function
function authorize() {
  let ui = SpreadsheetApp.getUi();
  // Assuming this is the very first menu function you ever run on this
  // sheet, you'll have to authorize and the body isn't executed
  // Otherwise, the body *is* going to be run and tell you you're alraedy authorized
  ui.alert("You're already authorized")
}

function testAPICall() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet = ss.getActiveSheet();

  //Sheets
  var settingsSheet = ss.getSheetByName('Settings');
  var scoreBoardDumbSheet = ss.getSheetByName('TestImportSeasonScoreboard');

  //Settings
  var startID = settingsSheet.getRange('B11').getValue();
  var divisionAmount = settingsSheet.getRange('B13').getValue();
  var weekAmount = 20; //mostly 11 actually, but it does not create problems going way higher. It basically is like MAX value

    let headers = {
    'apikey': "3NwgqDjwG64nTP7RAoqHE8vJdco2rG"
  };

  let params = {
    'contentType': 'application/json',
    'key': 'id',
    'headers': headers
  };

  try {

    var startingRow = 3;

    for (j = 0; j < divisionAmount; j++) {
      Utilities.sleep(500);
      let response = UrlFetchApp.fetch("https://api.nitroleague.de/season/division-group/"+(startID+j)+"/standings/"+weekAmount,params);
      response = JSON.parse(response);
      let final = response;

      var valueArray = [];

      for (i = 0; i < final.length; i++) { //länge ist 12 (anzahl teams)
        /**
         * Ziel:
         * - alle values einer json stufe pro zeile ausgeben
         */
          for (key in final[i]) {   

            values = final[i][key]; //i ist der Index im JSON File, auf ein bestimmten value greift man per key, nicht index
            valueArray.push(values);
          }
          valueArray.push(startID+j);

        dataRange = scoreBoardDumbSheet.getRange(startingRow, 1, 1, 11);
        dataRange.setValues([valueArray]);

        valueArray = [];
        startingRow += 1;
      }
      console.log('Division ' + (startID+j) + ' done!');
    }

  } catch(e) {
    console.log(e);
  };

}

/**
 * Logs Google Sheet information.
 * @param {number} rowNumber The spreadsheet row number.
 * @param {string} email The email to send with the row data.
 */
function emailDataRow(rowNumber, email) {
  console.log('Emailing data row ' + rowNumber + ' to ' + email);
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const rowData = data[rowNumber - 1].join(' ');
    console.log('Row ' + rowNumber + ' data: ' + rowData);
  } catch (err) {
    // TODO (developer) - Handle exception
    console.log('Failed with error %s', err.message);
  }
}
