const SS = SpreadsheetApp.getActiveSpreadsheet();
const SPREADSHEET = SpreadsheetApp.getActive();
const PROPERTIES = PropertiesService.getScriptProperties();
const MODE = SS.getSheetByName('Settings').getRange('G8').getValue();
const MATCH_ATTRIBUTES = ['match_id','match_name','beatmap_id','beatmapset_id','artist','creator','title','version','user_id','username','score','score_normalized','accuracy','max_combo','count_300','count_100','count_50','count_geki','count_katu','count_miss','mods','rank','passed'];

const API_SHEET = SS.getSheetByName("_score_dump");
const MATCH_ID_RANGE = SS.getSheetByName("Match Links/IDs").getRange("B2:B");
// const QUALS_ID_RANGE = SS.getSheetByName("Match Links/IDs").getRange("B2:B");


function onOpen(event){
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('Stats Menu')
  .addItem("Authorize Scripts", "authorize")
  .addSubMenu(ui.createMenu("API Management")
              .addItem("Add Client", "showClientStoringPrompt")
              .addItem("Remove Client", "removeClientStoringPrompt")
              .addSeparator()
              .addItem("NUKE", "nukePrompt")
              )
  .addSeparator()
  .addSubMenu(ui.createMenu('Data')
              // .addItem("Parse Quals", "askQuals")
              .addItem("Parse Matches", "askMatches")
              .addItem("Clear Data", "askClear")
              )
  .addToUi();
}

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

function clearMatchData() {
  API_SHEET.getRange("A3:W").clearContent();
}

function nukePrompt(){
  let ui = SpreadsheetApp.getUi();

  const result = ui.alert(
      "ARE YOU SURE?\nRead the 'Welcome!' tab if you don't know what this is",
      ui.ButtonSet.YES_NO);

  if (result != ui.Button.YES) return;

  let mc  = SS.getSheetByName("Match Cost Calc").getRange("I2:P");
  let mc2 = SS.getSheetByName("Match Cost Calc").getRange("S2:W");
  let ts  = SS.getSheetByName("Team Score Calc").getRange("E3:DB");
  let fs  = SS.getSheetByName("_fixed_scores").getRange("AG3:AH");
  let md  = SS.getSheetByName("_match_data").getRange("A2:E");
  let tt  = SS.getSheetByName("Teams").getRange("D2:F");
  let mt  = SS.getSheetByName("Mappools").getRange("F2:J");
  let ss  = SS.getSheetByName("Solo Score Calc").getRange("E3:DC");

  let data1 = mc.getValues();
  let data2 = mc2.getValues();
  let data3 = ts.getValues();
  let data4 = fs.getValues();
  let data5 = md.getValues();
  let data6 = tt.getValues();
  let data7 = mt.getValues();
  let data8 = ss.getValues();

  mc.setValues(data1);
  mc2.setValues(data2)
  ts.setValues(data3);
  fs.setValues(data4);
  md.setValues(data5);
  tt.setValues(data6);
  mt.setValues(data7);
  ss.setValues(data8);

  SS.getSheetByName("Settings").getRange("B11:B13").clearContent();

  unlinkAPI();

}

function askClear(){
  let ui = SpreadsheetApp.getUi();

  const result = ui.alert(
      "Would you like to remove all match data?",
      ui.ButtonSet.YES_NO);

  if (result == ui.Button.YES) clearMatchData();
}

// function askQuals(){
//   let ui = SpreadsheetApp.getUi();

//   const result = ui.alert(
//       "Would you like to parse all quals matches?\nOnly IDs in the 'Quals Lobbies' tab will be parsed",
//       ui.ButtonSet.YES_NO);

//   if (result == ui.Button.YES) refreshQualsData();
// }

// function refreshQualsData(){

//   const idsToRequest = QUALS_ID_RANGE.getValues()
//     .map(x => x[0])
//     .filter(x => x);

//   if (idsToRequest.length === 0) return;

//   let mergedData = [];

//   for (const id in idsToRequest){
//     let data = parseMatch(idsToRequest[id]);
//     for (const score in data){
//       let scoreData = [];
//       for (const attribute in MATCH_ATTRIBUTES){
//         let thing = MATCH_ATTRIBUTES[attribute];
//         // Logger.log(thing);
//         // Logger.log(data[score][0][thing]);
//         if (data[score][thing] == null) scoreData.push("");
//         else scoreData.push(data[score][thing]);
//       }
//       mergedData.push(scoreData);
//     }
//   }

//   API_SHEET.getRange(3, 1, mergedData.length, MATCH_ATTRIBUTES.length).setValues(mergedData);

// }

function askMatches(){
  let ui = SpreadsheetApp.getUi();

  const result = ui.alert(
      "Would you like to parse all bracket matches?\nOnly IDs in the 'Match Links/IDs' tab will be parsed",
      ui.ButtonSet.YES_NO);

  if (result == ui.Button.YES) refreshMatchData();
}

function refreshMatchData(){

  const idsToRequest = MATCH_ID_RANGE.getValues()
    .map(x => x[0])
    .filter(x => x);

  if (idsToRequest.length === 0) return;

  let mergedData = [];

  for (const id in idsToRequest){
    let data = parseMatch(idsToRequest[id]);
    for (const score in data){
      let scoreData = [];
      for (const attribute in MATCH_ATTRIBUTES){
        let thing = MATCH_ATTRIBUTES[attribute];
        // Logger.log(thing);
        // Logger.log(data[score][0][thing]);
        if (data[score][thing] == null) scoreData.push("");
        else scoreData.push(data[score][thing]);
      }
      mergedData.push(scoreData);
    }
  }

  // let last = API_SHEET.getLastRow();
  // API_SHEET.getRange(last+1, 1, mergedData.length, MATCH_ATTRIBUTES.length).setValues(mergedData);
  API_SHEET.getRange(3, 1, mergedData.length, MATCH_ATTRIBUTES.length).setValues(mergedData);

}







