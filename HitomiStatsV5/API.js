const API_URL = 'https://osu.ppy.sh/api/v2';
const TOKEN_URL = 'https://osu.ppy.sh/oauth/token';

const modNorm = {
  'RX':1,
  'AP':1,
  'SO':0.9,
  'EZ':0.5,
  'HD':1.06,
  'HT':0.3,
  'DT':1.2,
  'NC':1.2,
  'HR':1.1,
  'SD':1,
  'FL':1.12,
  'NF':1
  };

function toNum(input){
  let txt = input;
  // Logger.log(input)
  if(typeof input == "number"){
    return input;
  }
  let num = txt.match(/\d/g);
  num = num.join("");
  return num;
}

function getToken(){

  let seconds = new Date().getTime() / 1000;

  if (seconds >= PROPERTIES.getProperty("expires_in")){

    data = {
          'client_id': PROPERTIES.getProperty("client_id"),
          'client_secret': PROPERTIES.getProperty("secret"),
          'grant_type': 'client_credentials',
          'scope': 'public'
    };

    var params = {
      'method': 'post',
      'contentType': 'application/json',
      // Convert the JavaScript object to a JSON string.
      'payload': JSON.stringify(data)
    };

    let response = UrlFetchApp.fetch(TOKEN_URL, params);

    PROPERTIES.setProperty("expires_in", Math.round((new Date().getTime() / 1000) + JSON.parse(response).expires_in));
    PROPERTIES.setProperty("access_token", JSON.parse(response).access_token);
  }

  return PROPERTIES.getProperty("access_token")

}

function getMatch(id){

  Utilities.sleep(500);

  let token = getToken();

  let headers = {
    'Authorization': 'Bearer ' + token
  };

  let params = {
    'contentType': 'application/json',
    'key': 'id',
    'headers': headers
  };

  try{
    let response = UrlFetchApp.fetch(API_URL+'/matches/'+id, params);
    response = JSON.parse(response);
    let final = response;

    while (final.events[0].detail.type != "match-created"){
      let eventId = response.events[0].id;
      response = UrlFetchApp.fetch(API_URL+'/matches/'+id+"?before="+eventId, params);
      response = JSON.parse(response);
      final.events = [...response.events, ...final.events]
    }

    return final;
  }
  catch(e){};

}

function parseMatch(id){

  let match = getMatch(toNum(id));

  let games = [];
  
  if(match == null) return;

  for (event in match.events){

    if (match.events[event].game != null){
      games.push(match.events[event].game)
    }

  };

  let scores = [];

  let users = [];
  let userData = match.users;
  for (const user in userData){
    users.push([userData[user].id,userData[user].username])
  }

  // Logger.log(users)

  for (const game in games){

    if(games[game].scores.length === 0) continue;

    // Logger.log(game);
    // Logger.log(games[game])

    for (const score in games[game].scores){
      try{
        let user_id = games[game].scores[score].user_id;
        let username = "";
        for (const i in users){
          if (users[i][0] == user_id){
            username = users[i][1];
            break;
          }
        }
        let tempScore = games[game].scores[score].score;
        let normScore = tempScore;

        let mods = games[game].scores[score].mods;
        for(const mod in mods){
          normScore = normScore/modNorm[mods[mod]];
        }

        let miss = games[game].scores[score].statistics.count_miss;
        let fifty = games[game].scores[score].statistics.count_50;
        let hundred = games[game].scores[score].statistics.count_100;
        let three = games[game].scores[score].statistics.count_300;
        let hits = miss + fifty + hundred + three;
        let acc = games[game].scores[score].accuracy;
        let pass = games[game].scores[score].match.pass;

        let rank = "D";

        //X	100% accuracy
        //S	Over 90% 300s, less than 1% 50s and no misses
        //A	Over 80% 300s and no misses OR over 90% 300s
        //B	Over 70% 300s and no misses OR over 80% 300s
        //C	Over 60% 300s
        //D	Anything else

        if (acc==1) {
          if (games[game].scores[score].mods.indexOf("HD")>=0 || games[game].scores[score].mods.indexOf("FL")>=0) rank = "XH"
          else rank = "X"
        }
        else if (three/hits>.9 && fifty/hits<=.01 && miss==0){
          if (games[game].scores[score].mods.indexOf("HD")>=0 || games[game].scores[score].mods.indexOf("FL")>=0) rank = "SH"
          else rank = "S"
        }
        else if ((three/hits>.8 && miss==0) || three/hits>.9) rank = "A"
        else if ((three/hits>.7 && miss==0) || three/hits>.8) rank = "B"
        else if (three/hits>.6) rank = "C"

        let data = {
          'match_id': match.match.id,
          'match_name': match.match.name,
          'beatmap_id':games[game].beatmap.id,
          'beatmapset_id':games[game].beatmap.beatmapset_id,
          'artist':games[game].beatmap.beatmapset.artist,
          'creator':games[game].beatmap.beatmapset.creator,
          'title':games[game].beatmap.beatmapset.title,
          'version':games[game].beatmap.version,
          'user_id':user_id,
          'username':username,
          'score':tempScore,
          'score_normalized':normScore,
          'accuracy':acc,
          'max_combo':games[game].scores[score].max_combo,
          'count_300':three,
          'count_100':hundred,
          'count_50':fifty,
          'count_miss':miss,
          'count_geki':games[game].scores[score].statistics.count_geki,
          'count_katu':games[game].scores[score].statistics.count_katu,
          'mods':games[game].scores[score].mods.join(''),
          'rank':rank,
          'passed':pass
        };
        // Logger.log(data);
        scores.push(data);
      }
      catch(e){
        Logger.log(e);
      }
      
    }
  }

  // return data;

  // return games;
  return scores;

}

function main(){

  Logger.log(parseMatch(92800087))
  // for (const score in scores){
    // Logger.log(scores[score])
  // }

}

























