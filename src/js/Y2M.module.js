// build fetch parameters
export function buildParameters(currentStatus,fieldArray,mp3File) {
     switch(currentStatus) {
          case 1:
     	       return '?step=1&URL=' + fieldArray["URL"][2];
          case 2:
               return '?step=2&Filename=' + mp3File + '&Artist=' + fieldArray["Artist"][2] + '&Album=' + fieldArray["Album"][2] + '&TrackName=' + fieldArray["Name"][2] + '&TrackNum=' + fieldArray["Track #"][2] + '&Genre=' + fieldArray["Genre"][2]  + '&Year=' + fieldArray["Year"][2];
          case 3:
               return '?step=3&Filename=' + mp3File + '&Artist=' + fieldArray["Artist"][2] + '&Album=' + fieldArray["Album"][2] + '&TrackName=' + fieldArray["Name"][2] + '&TrackNum=' + fieldArray["Track #"][2] + '&Genre=' + fieldArray["Genre"][2]  + '&Year=' + fieldArray["Year"][2];
          case 4:
	       return '?step=4&Filename=' + encodeURI(mp3File) + '&Artist=' + fieldArray["Artist"][2] + '&Album=' + fieldArray["Album"][2];
          case 5:
	       return '?step=5';
          default:
               return null;
     }
}

// Get URL parameter if provided
export function getParam(name) {
     let query = window.location.search.substr(1);
         
     if (query==="") {
          return;
     }

     var res=query.split("&");

     if (name==='URL' && res[0]) {
          let result=decodeURI(res[0].replace('URL=',''));
          
          if (typeof result !== 'undefined' && result !== "")
               return result;
         else 
               return "";
     } else if (name==='Title' && res[1]) {
           let title=res[1];
           title=title.replace('Title=','');
           title=title.replace(' (HQ)','');

           return decodeURI(title); 
     } else {
          return "";
     }
}


// Parses URL parameter 
export function parseTitle(section) {
     // section can be artist name or song name
     let titleParam=getParam("Title");
         
     if (!titleParam) {
          return null;
     }

     // Remove these strings from the URL 
     titleParam=titleParam.toString().replace(' - [HQ] - YouTube','');
     titleParam=titleParam.replace(' - YouTube','');

     // If no dash is in the title, I'm going to assume that the title is the song name 
     if (titleParam.indexOf('-')===null && section==='title') {
          return titleParam;
     }

     let res=titleParam.split('-');

     if (section==='artist' && res[0]) {
          return res[0].trim();
     } else if (section==='title' && res[1]) {
          return res[1].trim();
     }
}

export function validateFields(fieldArray) {
     if (fieldArray["URL"][2]==="") {
          return ["Error","Please enter the URL"];
     }

     if (fieldArray["URL"][2].indexOf("youtube.com")===-1 && fieldArray["URL"][2].indexOf("youtu.be")===-1) {
          return ["Error","Only YouTube URLs are allowed"];
     }

     if (fieldArray["Artist"][2]==="") {
          return ["Error","Please enter the artist"];
     }

     if (fieldArray["Album"][1]===true && fieldArray["Album"][2]==="") {
          return ["Error","Please enter the album"];
     }

     if (fieldArray["Name"][2]==="") {
          return ["Error","Please enter the track name"];
     }

     if (fieldArray["Track #"][1]===true && fieldArray["Track #"][2]==="") {
          return ["Error","Please enter the track #"];
     }

     if (fieldArray["Genre"][2]==="") {
          return ["Error","Please enter the genre"];
     }

     if (fieldArray["Year"][1]===true && fieldArray["Year"][2]==="") {
          return ["Error","Please enter the year"];
     }

     return ["OK",""];
}

// Unused code
    /*getValues(valName) {
         // Run the AJAX request
	 fetch('./php/getDBValues.php', {method: 'GET',}).then(response => response.json()).then((response) => {
	      if (response[0].indexOf("ERROR") !== -1) {
	           // write error status
		   this.updateStatus("A fatal error occurred: " + response[0]);
              }

	 }).catch(error => { 
              console.log('request failed', error); 
         });
    }*/
 
    // force Plex Rescan checkbox change event
    /*plexScanFilesChange() {
         this.setState({plexScanNewFiles : !this.state.plexScanNewFiles});
    }*/


 // Plex Rescan is disabled for now
         // if the user has unchecked Force Plex Rescan, remove the corresponding status task from the hash array
         /*if (this.state.plexScanNewFiles===false) {
              const currentStatus={ ...this.state.statusTasks};

             try {
                  delete currentStatus["Forcing Plex Rescan"];

                  this.setState({statusTasks : currentStatus });
              } catch (e) {}
         }*/

