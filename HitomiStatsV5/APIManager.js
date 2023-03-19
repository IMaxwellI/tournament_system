// Code provided by LeoFLT and modified by HitomiChan_ to work with osu! API v2
function showClientStoringPrompt() {
    let ui = SpreadsheetApp.getUi();
    function secretFlow() {
      const result = ui.prompt(
        "Please enter your osu! API client ID",
        "(should be a short number i.e. 12345)\nCreate a client by going to https://osu.ppy.sh/home/account/edit if you don't have one",
        ui.ButtonSet.OK_CANCEL
      );
      const client_id = result.getResponseText();
  
      // user pressed OK
      if (result.getSelectedButton() === ui.Button.OK) {
        
        const result = ui.prompt(
        "Please enter your osu! API client secret",
        "Create a client by going to https://osu.ppy.sh/home/account/edit if you don't have one",
        ui.ButtonSet.OK_CANCEL
        );
        const secret = result.getResponseText();
  
        if (result.getSelectedButton() === ui.Button.OK) {
        
          try {
            PROPERTIES.setProperty("client_id", client_id);
            PROPERTIES.setProperty("secret", secret);
            getToken();
            ui.alert('Your API client is working correctly and has been stored for use in this spreadsheet.');
            // PROPERTIES.setProperty("async_on", "false");
            // ScriptApp.newTrigger('onEditAndForm').forSpreadsheet(SS).onFormSubmit().create();
            // ScriptApp.newTrigger('onEditAndForm').forSpreadsheet(SS).onEdit().create();
            // ScriptApp.newTrigger('updateUsernames').timeBased().everyHours(12).create();
  
          } catch (e) {
            PROPERTIES.deleteProperty("client_id");
            PROPERTIES.deleteProperty("secret");
            Logger.log(e);
            ui.alert('Your API client did not work, please check that it is correct and try again.');
          }
        }  
      }
    }
  
    // check to see if an API key already exists
    if (PROPERTIES.getProperty("secret")) {
      let response = ui.alert("An API client already exists, do you want to overwrite it?", ui.ButtonSet.YES_NO);
      if (response === ui.Button.YES)
        secretFlow();
    } else
      secretFlow();
  }
  
  function removeClientStoringPrompt() {
    let ui = SpreadsheetApp.getUi();
    let response = ui.alert("Are you sure you want to remove the stored client?", ui.ButtonSet.YES_NO);
    if (response === ui.Button.YES) {
      unlinkAPI();
      ui.alert("The API client has been removed successfully.");
    }
  }
  
  function unlinkAPI(){
    PROPERTIES.deleteProperty("client_id");
    PROPERTIES.deleteProperty("secret");
    PROPERTIES.deleteProperty("expires_in");
    PROPERTIES.deleteProperty("access_token");
    ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  