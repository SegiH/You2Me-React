/*
TO DO
    Move to server renders with this if: {( (this.state.allowMoveToServer && this.state.moveToServerButtonVisible && this.state.isSubmitted) See if you ca remove this.state.moveToServerButtonVisible or this.state.isSubmitted
    https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-assets-outside-of-the-module-system

    React Service: https://pusher.com/tutorials/consume-restful-api-react
*/

import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox'
import CloseIcon from '@material-ui/icons/Close';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const MobileDetect = require('mobile-detect');
const md = new MobileDetect(window.navigator.userAgent);
const isMobile=md.mobile();

// Form component 
class You2Me extends React.Component {
     constructor(props) {
          super(props);
          
          this.state = {  
               allowMoveToServer : false,
               currentFormat : "",
               currentStep : 1,
               debugging : false,
               debuggingCheckboxVisible : false,
               downloadLink : "",
               downloadButtonVisible : false, // default false
               downloadStatus : "", // displays youtube-dl output messages
               downloadStatusVisible : true,
               //downloadProgressSubscription,
               fields  : {
                    'URL':  { 
                         'Required':true,
                         'Value': "",
                         'Disabled': false
                    },
                    'Artist': {
                         'Required':true,
                         'Value': "",
                         'Disabled': false
                    },
                    'Album': {
                         'Required':false,
                         'Value': "",
                         'Disabled': false
                    },
                    'Name': {
                         'Required':true,
                         'Value': "",
                         'Disabled': false
                    },
                    'TrackNum': {
                         'Required':false,
                         'Value': "",
                         'Disabled': false
                    },
                    'Genre': {
                         'Required':false,
                         'Value': "",
                         'Disabled': false
                    },
                    'Year': {
                         'Required':false,
                         'Value': "",
                         'Disabled': false
                    }
               },
               fileName : '',
               formats : [
                    {"FormatID":"1","0":"1","FormatDisplayName":"aac","1":"aac","FormatName":"aac","2":"aac","FormatTypeID":"1","3":"1","IsMP3Format":"0","4":"0","FormatTypeName":"Audio","5":"Audio"},
                    {"FormatID":"2","0":"2","FormatDisplayName":"flac","1":"flac","FormatName":"flac","2":"flac","FormatTypeID":"1","3":"1","IsMP3Format":"0","4":"0","FormatTypeName":"Audio","5":"Audio"},
                    {"FormatID":"3","0":"3","FormatDisplayName":"m4a","1":"m4a","FormatName":"m4a","2":"m4a","FormatTypeID":"1","3":"1","IsMP3Format":"0","4":"0","FormatTypeName":"Audio","5":"Audio"},
                    {"FormatID":"4","0":"4","FormatDisplayName":"mp3 128k","1":"mp3 128k","FormatName":"128k","2":"128k","FormatTypeID":"1","3":"1","IsMP3Format":"1","4":"1","FormatTypeName":"Audio","5":"Audio"},
                    {"FormatID":"5","0":"5","FormatDisplayName":"mp3 192k","1":"mp3 192k","FormatName":"192k","2":"192k","FormatTypeID":"1","3":"1","IsMP3Format":"1","4":"1","FormatTypeName":"Audio","5":"Audio"},
                    {"FormatID":"6","0":"6","FormatDisplayName":"mp3 256k","1":"mp3 256k","FormatName":"256k","2":"256k","FormatTypeID":"1","3":"1","IsMP3Format":"1","4":"1","FormatTypeName":"Audio","5":"Audio"},
                    {"FormatID":"7","0":"7","FormatDisplayName":"mp3 320k","1":"mp3 320k","FormatName":"320k","2":"320k","FormatTypeID":"1","3":"1","IsMP3Format":"1","4":"1","FormatTypeName":"Audio","5":"Audio"},
                    {"FormatID":"8","0":"8","FormatDisplayName":"mp3 VBR 0 (Best)","1":"mp3 VBR 0 (Best)","FormatName":"0","2":"0","FormatTypeID":"1","3":"1","IsMP3Format":"1","4":"1","FormatTypeName":"Audio","5":"Audio"},
                    {"FormatID":"9","0":"9","FormatDisplayName":"mp3 VBR (5) (OK)","1":"mp3 VBR (5) (OK)","FormatName":"5","2":"5","FormatTypeID":"1","3":"1","IsMP3Format":"1","4":"1","FormatTypeName":"Audio","5":"Audio"},
                    {"FormatID":"10","0":"10","FormatDisplayName":"mp3 VBR (9) (Worst)","1":"mp3 VBR (9) (Worst)","FormatName":"9","2":"9","FormatTypeID":"1","3":"1","IsMP3Format":"1","4":"1","FormatTypeName":"Audio","5":"Audio"},
                    {"FormatID":"11","0":"11","FormatDisplayName":"opus","1":"opus","FormatName":"opus","2":"opus","FormatTypeID":"1","3":"1","IsMP3Format":"0","4":"0","FormatTypeName":"Audio","5":"Audio"},
                    {"FormatID":"12","0":"12","FormatDisplayName":"vorbis","1":"vorbis","FormatName":"vorbis","2":"vorbis","FormatTypeID":"1","3":"1","IsMP3Format":"0","4":"0","FormatTypeName":"Audio","5":"Audio"},
                    {"FormatID":"13","0":"13","FormatDisplayName":"wav","1":"wav","FormatName":"wav","2":"wav","FormatTypeID":"1","3":"1","IsMP3Format":"0","4":"0","FormatTypeName":"Audio","5":"Audio"},
                    {"FormatID":"14","0":"14","FormatDisplayName":"No conversion","1":"No conversion","FormatName":"original","2":"original","FormatTypeID":"2","3":"2","IsMP3Format":"0","4":"0","FormatTypeName":"Video","5":"Video"},
                    {"FormatID":"15","0":"15","FormatDisplayName":"Convert to avi","1":"Convert to avi","FormatName":"avi","2":"avi","FormatTypeID":"2","3":"2","IsMP3Format":"0","4":"0","FormatTypeName":"Video","5":"Video"},
                    {"FormatID":"16","0":"16","FormatDisplayName":"Convert to flv","1":"Convert to flv","FormatName":"flv","2":"flv","FormatTypeID":"2","3":"2","IsMP3Format":"0","4":"0","FormatTypeName":"Video","5":"Video"},
                    {"FormatID":"17","0":"17","FormatDisplayName":"Convert to mkv","1":"Convert to mkv","FormatName":"mkv","2":"mkv","FormatTypeID":"2","3":"2","IsMP3Format":"0","4":"0","FormatTypeName":"Video","5":"Video"},
                    {"FormatID":"18","0":"18","FormatDisplayName":"Convert to mp4","1":"Convert to mp4","FormatName":"mp4","2":"mp4","FormatTypeID":"2","3":"2","IsMP3Format":"0","4":"0","FormatTypeName":"Video","5":"Video"},
                    {"FormatID":"19","0":"19","FormatDisplayName":"Convert to ogg","1":"Convert to ogg","FormatName":"ogg","2":"ogg","FormatTypeID":"2","3":"2","IsMP3Format":"0","4":"0","FormatTypeName":"Video","5":"Video"},
                    {"FormatID":"20","0":"20","FormatDisplayName":"Convert to webm","1":"Convert to webm","FormatName":"webm","2":"webm","FormatTypeID":"2","3":"2","IsMP3Format":"0","4":"0","FormatTypeName":"Video","5":"Video"}],
               formatOverride : false,
               isFinished : false,
               isSubmitted : false, 
               moveToServer : false,
               moveToServerButtonVisible : false, // default false
               saveValues : false,
               supportedURLsVisible : false,
               statusCountClick : 0,
               statusMessage : "",
               statusCountClick : 0,
               statusMessage : "Fields marked with an * are required",
               stepperStepNames : [
                    'Started download',
                    'Finished download',
                    'Writing ID3 Tags',
               ],
               urlParams: {},
               validURLParameters : ['URL','Artist','Album','Format','Genre','Name','TrackNum','MoveToServer','Year','Debugging']
          };

          // Bind custom methods to this
          this.downloadLinkClicked = this.downloadLinkClicked.bind(this);
          this.finished = this.finished.bind(this);
          this.formatChange = this.formatChange.bind(this);
          this.formFieldChange = this.formFieldChange.bind(this);
          this.showSnackBarMessage=this.showSnackBarMessage.bind(this);
          this.submitClick = this.submitClick.bind(this);
          this.updateStatus = this.updateStatus.bind(this);

          // Load url parameters
          const query = window.location.search.substr(1);

          if (query === '')
               return;

          const res = query.split('&');

          // Create object which contains split key value pairs so "URL=https://www.youtube.com/watch?v=Wch3gJG2GJ4" turns into ['URL','https://www.youtube.com/watch?v=Wch3gJG2GJ4']
          const map1 = res.map(x => x.split('='));
          
          this.state.urlParams = {};

          // Add key/pair to object so it can be accessed by doing params[keyname] to get the value
          //map1.map(x => params[x[0]] = x[1] + (x[2] !== null ? '=' + x[2] : ''));

          map1.map(x => 
               this.state.urlParams[decodeURI(x[0]).toUpperCase()] = decodeURI(x[1]) + (
                     typeof x[2] !== 'undefined' ? '=' + decodeURI(x[2]) : '')
          );

          const format = this.getURLParam('Format');

          // Set the current format without validating it first because formats object may not be populated yet
          if (format !== null) {
               let validFormat=false;

               Object.keys(this.state.formats).forEach(key => {
                    if (this.state.formats[key].FormatName == format)
                         validFormat=true;
               });

               if (!validFormat) 
                    this.showSnackBarMessage(`The format provided is not valid`);
               else
                    this.state.currentFormat = format;
          }
               
          // If URL parameter MoveToServer was provided and is allowed, add Moving the file to new location as a step
          if (this.getURLParam('MoveToServer') === 'true' && this.state.allowMoveToServer) {
               this.moveToServer = true;
               document.title = 'You2Me (Server)';
          } else {
               this.moveToServer = false;
               document.title = 'You2Me';
          }
               
          if (this.state.moveToServer === true)
              this.state.stepperStepNames.push('Moving the file to new location');
          
          // Save current debugging value
          const currDebugging=this.state.debugging;

          // Enable debugging if Debugging was provided as URL parameter. Otherwise default to currDebugging
          const newDebugging = (this.getURLParam("Debugging") != this.state.debugging && this.getURLParam("Debugging") ? this.getURLParam("Debugging") : currDebugging);

          this.debugging = newDebugging;

          // Debugging default field values
          if (this.debugging) {
               let fields=this.state.fields;

               fields.URL.Value = "https://www.youtube.com/watch?v=Wch3gJG2GJ4";
               fields.Artist.Value = "Monkeeys";
               fields.Album.Value = "Greatest Hits";
               fields.Name.Value = "Goin Down";
               fields.TrackNum.Value = "13";
               fields.Genre.Value = "60s";
               fields.Year.Value = "1994";

               this.fields = fields;
               this.currentFormat = "aac";
               this.saveValues = true;
          }

          // Remove Artist name from title if it exists. You can't do this in getURLParam because it ends up getting called recursively
          const artist = this.state.fields.Artist.Value;

          if (artist !== null) {
               // Remove "artistname - " from name
               const newName = this.state.fields.Name.Value.replace(artist + " - ","");
               this.state.fields.Name.Value = newName;
          }

          // Load URL parameters
          Object.keys(this.state.fields).forEach(key => {
               if (this.getURLParam(key) !== null)
                    if ((key === 'TrackNum' || key === 'Year') && isNaN(parseInt(this.getURLParam(key))))
                         this.showSnackBarMessage('The URL parameter ' + key + ' has to be a number');
                    else
                         this.state.fields[key].Value=this.getURLParam(key);
          });

          // Make sure that there aren't any invalid URL parameters
          const queryString = "&" + window.location.search.slice(1); // first URL parameter always begins with a ?. This replaces it with & so we can call split() on it using & as the delimiter
          const split_params=queryString.split("&"); 
          
          for (let i=0;i<split_params.length;i++) {
               if (split_params[i] !== '') {
                    const param=split_params[i].split("=")[0]; // URL is in the form Name=Value; Get Name part of the parameter

                    //if (!this.state.validURLParameters.includes(param))
                    //     this.showSnackBarMessage('The URL parameter ' + param + ' is not a valid URL parameter');                    
               }
          }
     }

     clearFieldValues() {
          const fields=this.state.fields;

          this.state.fieldKeys.forEach(key => {
               fields[key].Value = "";
          });

          this.setState({fields: fields});
     }

     // Download file step
     downloadFile() {
          // Start timer that gets download progress
          
          /* FIX ME LATER! */
          //if (!this.debugging)
          //     this.getDownloadProgress();

          const fileName = (this.isAudioFormat() && !isNaN(parseInt(this.state.fields.TrackNum.Value)) ? this.state.fields.TrackNum.Value + " " : "" ) + (this.state.fields.Name.Value != "" ? this.state.fields.Name.Value : "Unknown");
                    
          // Remove this step when you aren't generating an mp3
          if (!this.isMP3Format()) {
               let stepperStepNames=this.state.stepperStepNames;

               stepperStepNames.splice(stepperStepNames.indexOf('Writing ID3 Tags'), 1);

               this.setState({stepperStepNames: stepperStepNames});
          }

          // extra URL parameters in a Youtube link causes issues for youtube-dl
          if (this.fields.URL.Value.includes('youtube.com')) {
               const arr = this.fields.URL.Value.split('&');
               const fields = this.state.fields;

               fields.URL.Value = arr[0];

               this.setState({fields : fields});
          }

          const params = `?DownloadFile` +
                         `&URL=${this.state.fields.URL.Value}` +
                         `&Filename=${this.rfc3986EncodeURIComponent(fileName)}` +
                         `&Debugging=${this.state.debugging}` +
                         '&MoveToServer=' + (this.state.movetoServer ? "true" : "false") +
                         '&AllowMoveToServer=' + (this.state.allowMoveToServer ? "true" : "false") +
                         (this.isAudioFormat()
                              ? `&IsAudioFormat=true` + (this.isMP3Format() ? `&Bitrate=${this.state.currentFormat}` : ``) + `&AudioFormat=${this.state.currentFormat}`
                              : `&IsVideoFormat=true&VideoFormat=${this.state.currentFormat}`);

          // Call data service to download the file
	     fetch('./php/serverTasks.php' + params, {method: 'GET',}).then(response => response.json()).then((response) => {
               if (response[0].indexOf("ERROR") !== -1) {
                    // write error status
                    this.updateStatus("A fatal error occurred: " + response[0]);
               }

               // Stop the REST service that gets the download status
               if (!this.debugging) {
                    /* Fix me */
                    //this.downloadProgressSubscription.unsubscribe();

                    this.setState({downloadStatusVisible :false});

                    // Call REST service to delete download progress temp db
                    /* Fix me */
                    /*this.dataService.deleteDownloadProgress().subscribe((response) => {
                    },
                    error => {
                         this.handleError(Response, error);
                    });*/
               }

               // Trap server side errors
               if (response[0].includes('Error:')) {
                    this.handleError(response, response);
                    console.log(response[1]);
                    return;
               }

               // First index will be filename
               this.setState({fileName : response[0]});

               // Second index will be Artist if matched through Python script that does audio fingerprinting
               const fields = this.state.fields;

               if (typeof response[1] !== 'undefined')
                    fields.Artist.Value=response[1];

               // Third index will be Title if matched through Python script that does audio fingerprinting
               if (typeof response[2] !== 'undefined')
                    fields.Name.Value=response[1];
               
               this.setState({fields : fields});

               // If the selected format is MP3 format and the Python script tried but fails to get the artist and album
               // Make artist and name fields required
               if (this.isMP3Format()) {
                    if (this.state.fields.Artist.Value === "") {
                         const fields = this.state.fields;
                         fields.Artist.Required.true;
                         this.setState({fields : fields});

                         this.showSnackBarMessage('Please enter the artist');
                         
                         this.setState({
                              currentStep : 1,
                              formatOverride : true,
                              isSubmitted : false,
                         });
                         
                         if (fields.Name.Value !== "")
                              return;
                    }

                    if (fields.Name.Value === "") {
                         const fields = this.state.fields;
                         fields.Name.Required.true;

                         this.showSnackBarMessage('Please enter the name');
                         
                         this.setState({
                              currentStep : 1,
                              fields : fields,
                              formatOverride : true,
                              isSubmitted : false,
                         });

                         return;
                    }

                    this.updateStatus('The file has been downloaded. Writing the ID3 tags');

                    const nextStep=this.state.currentStep+1;
                    this.setState({currentStep : nextStep});

                    this.processSteps();
               } else if (!this.isMP3Format() && !this.state.moveToServer) { // If the format is not MP3 and we aren't moving to the server we are done
                    // The response returns the URL for the downloaded file
                    this.setState({downloadLink : decodeURIComponent(response[0].replace(/\+/g, ' '))});

                    this.updateStatus('The file is ready for you to download or move to your server');

                    this.finished();

                    return;
               }

               this.setState({fields : fields});
          }).catch(error => { 
               console.log('request failed', error); 
          });
          
          /*this.dataService.fetchFile(this.moveToServer, this.allowMoveToServer, this.debugging)
          .subscribe((response) => {
               // Stop the REST service that gets the download status
               if (!this.debugging) {
                    this.downloadProgressSubscription.unsubscribe();

                    this.downloadStatusVisible = false;

                    // Call REST service to delete download progress temp db
                    this.dataService.deleteDownloadProgress().subscribe((response) => {
                    },
                    error => {
                         this.handleError(Response, error);
                    });
               }

               // Trap server side errors
               if (response[0].includes('Error:')) {
                    this.handleError(response, response);
                    console.log(response[1]);
                    return;
               }

               // First index will be filename
               this.fileName = response[0];

               // Second index will be Artist if matched through Python script that does audio fingerprinting
               if (typeof response[1] !== 'undefined')
                    this.dataService.setFieldProperty('Artist','Value',response[1]);

               // Third index will be Title if matched through Python script that does audio fingerprinting
               if (typeof response[2] !== 'undefined')
                    this.dataService.setFieldProperty('Name','Value',response[2]);

               // If the selected format is MP3 format and the Python script tried but fails to get the artist and album
               // Make artist and name fields required
               if (this.dataService.isMP3Format()) {
                    if (this.dataService.getFieldProperty('Artist','Value') === "") {
                         this.dataService.setFieldProperty('Artist','Required',true);
                         this.dataService.showSnackBarMessage('Please enter the artist');
                         this.currentStep = 1;
                         this.formatOverride = true;
                         this.isSubmitted = false;

                         if (this.dataService.getFieldProperty('Name','Value') !== "")
                              return;
                    }

                    if (this.dataService.getFieldProperty('Name','Value') === "") {
                         this.dataService.setFieldProperty('Name','Required',true);
                         this.dataService.showSnackBarMessage('Please enter the name');
                         this.currentStep = 1;
                         this.formatOverride = true;
                         this.isSubmitted = false;
                         return;
                    }

                    this.updateStatus('The file has been downloaded. Writing the ID3 tags');

                    this.currentStep++;

                    this.processSteps();
               } else if (!this.dataService.isMP3Format() && !this.moveToServer) { // If the format is not MP3 and we aren't moving to the server we are done
                    // The response returns the URL for the downloaded file
                    this.downloadLink = decodeURIComponent(response[0].replace(/\+/g, ' '));

                    this.updateStatus('The file is ready for you to download or move to your server');

                    this.finished();

                    return;
               }
          },
          error => {
               // Stop the REST service that gets the download status
               if (!this.debugging) {
                    this.downloadProgressSubscription.unsubscribe();

                    // Call REST service to delete download progress temp db
                    this.dataService.deleteDownloadProgress().subscribe((response) => {
                    },
                    error => {
                         this.handleError(Response, error);
                    });
               }
          
               this.handleError(Response, error);
          });*/
     }
     
     // Event handler when download link is clicked
     downloadLinkClicked() {
          const fileNameWithoutPath=this.state.downloadLink.substr(this.state.downloadLink.lastIndexOf("/")+1);
          
          /* Fix Me need to be re-written for React */
          // Subscribe to DL service and wait for the done response 
          /*this.downloads.download(this.downloadLink, fileNameWithoutPath).subscribe((response) => {
               //console.log("Response: " + response.state);
               if (response.state === "DONE") {
                    if (!this.debugging) {
                         // Send request to delete the file
                         this.dataService.deleteDownloadFile(this.downloadLink).subscribe((response) => { 
                              //console.log(response)
                         },
                         error => {
                              console.log("An error " + error + " occurred deleting the file from the server 1");
                         });
                    }
               }
          },
          error => {
               console.log("An error " + error + " occurred deleting the file from the server 2");
          });
          */
          /*
          // Subscribe to DL service and wait for the done response 
          this.downloads.download(this.downloadLink, fileNameWithoutPath).subscribe((response) => {
               //console.log("Response: " + response.state);
               if (response.state === "DONE") {
                    if (!this.debugging) {
                         // Send request to delete the file
                         this.dataService.deleteDownloadFile(this.downloadLink).subscribe((response) => { 
                              //console.log(response)
                         },
                         error => {
                              console.log("An error " + error + " occurred deleting the file from the server 1");
                         });
                    }
               }
          },
          error => {
               console.log("An error " + error + " occurred deleting the file from the server 2");
          });

          this.downloadButtonVisible = false;

          // Hide moveToServer button to prevent subsequent clicks
          this.moveToServerButtonVisible = false;
          */
          
     }

     fetchFile(movetoServe, allowMoveToServer, debugging) {
          /* Fix Me Later! */
          /*
          const fileName: string = (this.isAudioFormat() && !isNaN(parseInt(this.fields.TrackNum.Value)) ? this.fields.TrackNum.Value + " " : "" ) + (this.fields.Name.Value != "" ? this.fields.Name.Value : "Unknown");
          
          // Remove this step when you aren't generating an mp3
          if (!this.isMP3Format())
               this.stepperStepNames.splice(this.stepperStepNames.indexOf('Writing ID3 Tags'), 1);

          // extra URL parameters in a Youtube link causes issues for youtube-dl
          if (this.fields.URL.Value.includes('youtube.com')) {
               const arr = this.fields.URL.Value.split('&');

               this.fields.URL.Value = arr[0];
          }

          const params = `?DownloadFile` +
                         `&URL=${this.fields.URL.Value}` +
                         `&Filename=${this.rfc3986EncodeURIComponent(fileName)}` +
                         `&Debugging=${debugging}` +
                         '&MoveToServer=' + (movetoServer ? "true" : "false") +
                         '&AllowMoveToServer=' + (allowMoveToServer ? "true" : "false") +
                         (this.isAudioFormat()
                              ? `&IsAudioFormat=true` + (this.isMP3Format() ? `&Bitrate=${this.currentFormat}` : ``) + `&AudioFormat=${this.currentFormat}`
                              : `&IsVideoFormat=true&VideoFormat=${this.currentFormat}`);

          return this.processStep(params);
          */
     }

     fieldIsHidden(key) {
          // Specified values are the fields to hide
          const videoHideFields = Object.freeze(['Artist', 'Album', 'TrackNum', 'Genre', 'Year']);
          const nonMP3HideFields = Object.freeze(['TrackNum', 'Genre', 'Year']);
        
          const thisField = this.getField(key);
          
          return (
               // If the fields property is set to disabled this is the de-facto determiner whether this field is enabled or disabled
               thisField !== null && thisField.Disabled)
               || (
                    // If the format is a video format, hide these fields
                    (!this.isAudioFormat() && videoHideFields.includes(key))
                    ||
                    // If the format is an audio format but is not MP3, hide these fields
                    (this.isAudioFormat() && (!this.isMP3Format() && nonMP3HideFields.includes(key))
               )
          );
     }

     // Method called when all status have finished   
     finished(isError = false) {      
          this.setState({
               debuggingCheckboxVisible: true,
               downloadButtonVisible: (!this.state.moveToServer && !isError && this.state.currentStep <=2 ? true : false),
               isFinished : true,
               isSubmitted : true,
               moveToServerButtonVisible: (!isError && this.allowMoveToServer && !this.moveToServerButtonVisible && this.currentStep <=2 ? true : false),
          });

          // Stop the REST service that gets the download status
          /* Fix me later */
          /*if (!this.debugging) {
               this.downloadProgressSubscription.unsubscribe();

               // Delete download progress temp db
               this.dataService.deleteDownloadProgress().subscribe((response) => {
               },
               error => {
                    this.handleError(Response, error);
               });
          }*/
     }

     formatChange(event) {
          this.setState({currentFormat: event.target.value});
     }
    
     // When the text field value changes, store the value in the array
     formFieldChange = name => event => {
          const fields=this.state.fields;
          fields[name].Value=event.target.value;
          this.setState({fields : fields});
     }

     // Get progress of youtube-dl
     getDownloadProgress() {
          /* Fix me later! */
          /*if (this.debugging)
               return;

          this.downloadProgressSubscription = interval(50)
               .subscribe(()=>{
                    this.dataService.getDownloadProgress()
                    .subscribe((jsonResult:Object)=>{
                         if(jsonResult !== null && !jsonResult[1])
                              this.downloadStatus=jsonResult[0];
                    },
                    error => {
                         //show errors
                         console.log(error)
                    }
               );
          });*/
     }

     getField(fieldName) {
          if (typeof this.state.fields[fieldName] === 'undefined')
               return null;
          else
               return this.state.fields[fieldName];
     }

     // Get URL parameter
     getURLParam(name) {
          // If urlParams is still undefined, there are no url params
          if (typeof this.state.urlParams === 'undefined')
               return (name === "Debugging" ? false : null);
          
          // Make URL params upper case when checking so they aren't case sensitive
          name=name.toUpperCase();

          switch (name) {
               case 'URL':
                    return (typeof  this.state.urlParams[name] !== 'undefined' && this.state.urlParams[name] !== '' ? decodeURI(this.state.urlParams[name]) : null);
               case 'ARTIST':
                    return (typeof this.state.urlParams[name] !== 'undefined' && decodeURI(this.state.urlParams[name]) || null);
               case 'ALBUM':
                    return (typeof this.state.urlParams[name] !== 'undefined' && decodeURI(this.state.urlParams[name]) || null);
               case 'FORMAT':
                    return (typeof this.state.urlParams[name] !== 'undefined' && decodeURI(this.state.urlParams[name]) || null);
               case 'GENRE':
                    return (typeof this.state.urlParams[name] !== 'undefined' && decodeURI(this.state.urlParams[name]) || null);
               case 'NAME':
                    if (typeof this.state.urlParams[name] === 'undefined')
                         return null;
                    
                    let title = this.state.urlParams[name];

                    title = title.replace('Title=', '');
                    title = title.replace(' (HQ)', '');
                    title = title.replace(' (Acoustic / Audio) - YouTube', '');
                    title = title.replace(' - YouTube', '');

                    return decodeURI(title);
               case 'TRACKNUM':
                    return (typeof this.state.urlParams[name] !== 'undefined' && decodeURI(this.state.urlParams[name])  || null);
               case 'MOVETOSERVER':
                    return (typeof this.state.urlParams[name] !== 'undefined' ? this.state.urlParams[name] : null);
               case 'YEAR':
                    return (typeof this.state.urlParams[name] !== 'undefined' ? decodeURI(this.state.urlParams[name]) : null);
               case 'DEBUGGING':
                    return (typeof this.state.urlParams[name] !== 'undefined' && this.state.urlParams[name] === 'true' ? true : null);
               default:
                    return null;
          }
     }

     // Handle errors returned by observable
     handleError(response, error) {
          // write error status
          this.updateStatus(`A fatal error occurred`  + (response[0] !== null ? `: ${response[0]}` : ``));

          console.log(`An error occurred at step ${this.currentStep} with the error ${error[0]}`);

          /* Fix me later */
          //if (!this.debugging)
          //     this.downloadProgressSubscription.unsubscribe();

          this.finished(true);
     }

     handleSaveValuesChange = (event) => {
          this.setState({saveValues: event.target.checked});
     };

     isAudioFormat() {
          let isAudio = false;

          Object.keys(this.state.formats).forEach(key => {
               if (this.state.currentFormat === this.state.formats[key].FormatName && this.state.formats[key].FormatTypeName === 'Audio')
                    isAudio = true;              
          });

          return isAudio;
     }

     // Is currently selected format an mp3 format
     isMP3Format() {
          let isMP3 = false;

          Object.keys(this.state.formats).forEach(key => {
               if (this.state.currentFormat === this.state.formats[key].FormatName && this.state.formats[key].FormatTypeName === 'Audio' && this.state.formats[key].IsMP3Format == true)
                    isMP3=true; 
          });

          return isMP3;
     }

     moveFile(localFile, isAudio) {
          const params = `?MoveFile` +
                         `&MoveToServer=true`  +
                         `&Filename=${localFile}` +
                         `&Artist=${this.rfc3986EncodeURIComponent(this.fields.Artist.Value)}` +
                         (isAudio
                         ? `&IsAudioFormat=true` + (typeof this.fields.Album.Value !== 'undefined' ? `&Album=${this.rfc3986EncodeURIComponent(this.fields.Album.Value)}` : '')
                         : `&IsVideoFormat=true`);

          /* Fix me later! */
          //return this.processStep(params);
     }

     // Move To Server Task
     moveFileToServer() {
          if (this.moveToServer || this.allowMoveToServer) {
               /* Fix Me */
               /*this.dataService.moveFile(this.fileName, this.dataService.isAudioFormat())
               .subscribe((response) => {
                    // Trap server side errors
                    if (response[0].includes('Error:')) {
                         this.handleError(response, response);
                         return;
                    }

                    this.updateStatus('The file has been moved to the server');

                    this.currentStep++;

                    this.finished();
               },
               error => {
                    this.handleError(Response, error);
               });*/
          }
     }

     // Event if the user clicks on the Move To Server button
     moveToServerClick() {
          // If we are able to move to server 
          if (this.allowMoveToServer)
               this.moveFileToServer();
     }
  
     // Parse title from URL
     parseTitle(section) {
          // section can be artist name or song name
          let titleParam=this.getParam("Title");
            
          if (!titleParam)
               return null;
   
          // Remove these strings from the URL 
          titleParam=titleParam.toString().replace(' - [HQ] - YouTube','');
          titleParam=titleParam.replace(' - YouTube','');
   
          // If no dash is in the title, I'm going to assume that the title is the song name 
          if (titleParam.includes('-') && section.toUpperCase() === 'TITLE')
               return titleParam;
   
          const res=titleParam.split('-');
   
          if (section==='artist' && res[0])
               return decodeURI(res[0].trim());
          else if (section==='title' && res[1])
               return decodeURI(res[1].trim());
     }

     /*processStep(params) {
          // Run the AJAX request
	     fetch('./php/serverTasks.php' + params, {method: 'GET',}).then(response => response.json()).then((response) => {
               if (response[0].indexOf("ERROR") !== -1) {
                    // write error status
                    this.updateStatus("A fatal error occurred: " + response[0]);
               }
          }).catch(error => { 
               console.log('request failed', error); 
          });
     }*/

     processSteps() {
          // Call data service based on the current step
          switch (this.state.currentStep) {
               case 0: // Download the file                    
                    this.downloadFile();

                    break;
               case 1: // Write ID3 tags
                    this.writeID3Tags()

                    break;
               case 2: // Call the data service to move the file to the media server
                    this.moveFileToServer();

                    break;
          }
     }

     render() {
          const cardStyle = {
               borderStyle: 'solid',
               borderWidth: '1px',
               marginLeft: '15px',
               width: '600px',
          };

          const divStyle = {
               borderStyle: 'solid',
               borderWidth: '1px',
               
               maxWidth: '550px',
               marginLeft: '15px',
               marginTop: '15px',
          }

          const supportedSitesStyle = {
               borderStyle: 'solid',
               borderWidth: '1px',
               maxWidth: '550px',
          }

          const downloadButtonStyle = {
               backgroundColor: 'green',
               color: 'white',
          };

          const formatLabelStyle = {
               position: 'relative',
               top: '25px'
          }
          
          const labelStyle = {
               display: 'inline-block',
               width: '100%',
          };
           
          const movetoServerStyle = {
               backgroundcolor: 'red',
               color: 'white',
          }

          const snackbarStyleMobile = {
               position: 'absolute',
               zIndex: '999',
               minWidth: '353px',
               top: '35%',
          };

          const spacer = {
               marginTop: '25px'
          }

          const submitButtonStyle = {
               marginLeft: 'auto',
               marginRight: 'auto',
               marginBottom: '25px',
               marginTop: '25px',
          };

          const handleClose = (event, reason) => {
               if (reason === 'clickaway') {
                 return;
               }
           
               this.setState({snackBarVisible : false});
          };
          
          const fields = Object.keys(this.state.fields).map(key => this.renderTextFields(key));
          const stepperSteps = Object.keys(this.state.stepperStepNames).map(key => this.renderSteps(key));
          const optionItems=Object.keys(this.state.formats).map(key => this.renderFormatOptions(key));
    
          return (
               <div>
               <div style={divStyle}>
	                    <AppBar position="static">
		                    <Toolbar>
		                         <Typography color="inherit">
			                         You2Me {(this.state.moveToServer && " (Server)")} {(this.state.debugging && " (Debugging enabled)")}
		                         </Typography>
		                    </Toolbar>
	                    </AppBar>

                         {/* Fields */}
	                    <Grid container direction="column">
		                    {fields}
	                    </Grid>

                         {/* Format dropdown */}
                         <Grid container direction="column" style={spacer}>
                              {(this.state.currentFormat === '' &&
                                   <InputLabel id="demo-controlled-open-select-label" style={formatLabelStyle}>Format</InputLabel>
                              )}
                              <Select value={this.state.currentFormat} onChange={this.formatChange}>
		                         {optionItems}
                              </Select>
	                    </Grid>

                         {/* Snackbar alert */}
	                    <Snackbar
                              anchorOrigin={{
                                   vertical: 'bottom',
                                   horizontal: 'left',
                              }}
                              open={this.state.snackBarVisible}
                              autoHideDuration={6000}
                              message={this.state.snackBarMessage}
                              action={
                                   <React.Fragment>
                                        <Button color="secondary" size="small" onClick={handleClose}>
                                             UNDO
                                        </Button>
                                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                                             <CloseIcon fontSize="small" />
                                        </IconButton>
                                   </React.Fragment>
                              }
                         />

                         <h2>
                              <div style={labelStyle} onDoubleClick = {this.statusDoubleClick()}>
                                   {this.state.statusMessage}
                              </div>
	                    </h2>

                         {/* Stepper */}
                         {(this.state.isSubmitted &&
	                         <Stepper activeStep={this.state.currentStep} orientation="vertical">
	                              {stepperSteps}
	                         </Stepper>                               
                         )}

                         {/* Download status messages */}
                         {(this.state.isSubmitted && this.state.currentStep == 0 && this.state.downloadButtonVisible && 
                              <div>{{downloadStatus}}</div>
                         )}

                         {/* Save values checkbox */}
                         {(this.state.isFinished &&
                              <FormGroup row>
                                   <FormControlLabel
                                        control={<Checkbox checked={this.state.saveValues} onChange={this.handleSaveValuesChange}>Save Values</Checkbox>}
                                        label="Save Values"
                                   />
                              </FormGroup>
                         )}
                     
                         <Grid container direction="row" justify="space-between">
                              {/* Submit/Restart button */}
                              {( (!this.state.isSubmitted || this.state.isFinished) &&
                                   <Button color="primary" onClick={this.submitClick} style={submitButtonStyle} variant="contained">{(!this.state.isSubmitted ? "Start" : "Restart")}</Button>
                              )}

                              {/* Download button */}
                              {( (this.state.downloadButtonVisible) &&
                                   <Button color="primary" onClick={this.downloadLinkClicked} style={downloadButtonStyle} variant="contained">Download</Button>
                              )}

                              {/* Move To Server button */}
                              {( (this.state.allowMoveToServer && this.state.moveToServerButtonVisible && this.state.isSubmitted) &&
                                   <Button color="primary" onClick={this.moveToServerClick} style={movetoServerStyle} variant="contained">Download</Button>
                              )}                                                       
                         </Grid>             
               </div>
               <div style={supportedSitesStyle} elevation={3}>
                         <FormGroup row>
                              <FormControlLabel
                                   control={<Checkbox checked={this.state.saveValues} onChange={this.handleSaveValuesChange}>Save Values</Checkbox>}
                                   label="Show Supported Sites"
                              />
                         </FormGroup>
                         {/*<Checkbox checked={this.state.supportedURLsVisible}>Show supported sites</Checkbox>*/}
                    </div>    
               </div>
          );
     }

     renderFormatOptions(i) {
          return (
               <MenuItem key={i} value={this.state.formats[i].FormatName}>{this.state.formats[i].FormatDisplayName}</MenuItem>
          )
     }

     // Render the steps 
     renderSteps(i) {
          return (
               <Step key={i} >
                    <StepLabel>{this.state.stepperStepNames[i]}</StepLabel>
               </Step>
          );
     }     

     // Render the row with the Label and Field
     renderTextFields(i) {
          const txtFieldStyle = {
               marginTop: '25px',
          }
         
          if (!this.fieldIsHidden(i))
               return (
                    <TextField key={i} placeholder={i} label={i} onChange={this.formFieldChange(i)} required={this.state.fields[i].Required} style={txtFieldStyle} value={(this.state.fields[i].Value)} />
               )
     }
     
     // Escapes all special characters so they can safely be passed as URL parameters
     rfc3986EncodeURIComponent(str) {  
          return encodeURIComponent(str).replace(/[!'()*]/g, escape);  
     }

     // Show snackbar message
     showSnackBarMessage(message) {
          setTimeout(function() {
               this.setState({
                    snackBarVisible : true,
                    snackBarMessage : message
               });

               setTimeout(function(){
                    this.setState({snackBarVisible : false});
               }.bind(this), 5000);
          }.bind(this), 500);
     }

     // If you double click twice on the status message before submitting, it will show the checkbox to toggle the Debugging checkbox
     // so you can enable Debugging after loading the form but before submitting it
     statusDoubleClick() {
          if (this.state.isSubmitted)
               return;

          this.statusCountClick++;

          if (this.statusCountClick == 2) {
               this.setState({debuggingCheckboxVisible: false});
               this.setState({statusCountClick: 0});
          }
     }

     // submit button click event 
     submitClick() {
          // When the last step has been completed, the submit button changes to restart. This will reset everything when restart is clicked
          if (this.state.isFinished) {
               // If the Save Values checkbox is not checked
               if (!this.saveValues)                    
                    this.clearFieldValues(); // Clear all of the field values

               this.setState({currentStep: 1});

               this.setState({statusMessage: 'Fields marked with an * are required'});

               this.setState({isSubmitted: false});

               this.setState({isFinished: false});

               this.setState({isFinished: false});

               this.setState({formatOverride: false});

               this.setState({downloadButtonVisible: false});

               this.setState({moveToServerButtonVisible: false});

               return;
          }

          // Since I use Python fingerprinting, you don't have to fill in the artist and name if an MP3 format is selected. formatOverride is set to true 
          // if python fingerprinting cannot identify the track in which case the artist and song name ARE required
          if (this.isMP3Format() && !this.state.formatOverride) {
               const fields=this.state.fields;
               fields.Artist.Required=false;
               fields.Name.Required=false;

               this.setState({fields: fields});
          }

           // Validate the required fields
           const validateResult = this.validateFields();

           if (validateResult !== null) {
               this.showSnackBarMessage(validateResult);
               return;
          }

          // Set initial status
          if (this.state.currentStep === 0)
               this.updateStatus('Starting the download');

          this.setState({formatOverride: false});

          this.setState({isSubmitted: false});

          // Start the process
          this.processSteps();
     }

     // Update the status message 
     updateStatus(newStatus) {
          this.setState({statusMessage : newStatus});
     }

     // Validate all of the text fields
     validateFields() {          
          if (this.state.fields.URL.Value === null || this.state.fields.URL.Value === "")
               return 'Please enter the URL';

          if (this.state.fields.URL.Value !== null && this.state.fields.URL.Value !== "" && !this.state.fields.URL.Value.startsWith("http://") && !this.state.fields.URL.Value.startsWith("https://"))
               return 'Please enter a valid URL beginning with http:// or https://';

          if (!this.fieldIsHidden('Artist') && (this.state.fields.Artist.Required && (this.state.fields.Artist.Value === null || this.fields.state.Artist.Value === '')))
               return 'Please enter the artist';
          
          if (!this.fieldIsHidden('Album') && this.state.fields.Album.Required && (this.state.fields.Album.Value === null || this.state.fields.Album.Value === ''))
               return 'Please enter the album';

          if (this.state.fields.Name.Required && (this.state.fields.Name.Value === null || this.state.fields.Name.Value === ''))
               return 'Please enter the name';

          if (this.state.fields.TrackNum.Required && (this.state.fields.TrackNum.Value === null || this.state.fields.TrackNum.Value === ''))
               return 'Please enter the track #';

          if (this.state.fields.Year.Required && (this.state.fields.Year.Value === null || this.state.fields.Year.Value === ''))
               return 'Please enter the year';

          // Default album to Unknown if not provided
          if (!this.fieldIsHidden('Album') && this.state.fields.Album.Value === null) {
               const fields=this.state.fields;
               fields.Album.Value = 'Unknown';
               this.setState({fields: fields});
          }

          if (this.currentFormat === null || this.currentFormat === '')
               return 'Please select the format';

          return null;
     }

     // Write ID3 tags step
     writeID3Tags() {
          // Call data service to write ID3 tags
          /* Fix Me */
          /*this.dataService.writeID3Tags(this.fileName)
          .subscribe((response) => {
               // Trap server side errors
               if (response[0].includes('Error:')) {
                    this.handleError(response, response);
                    return;
               }

               this.updateStatus('The ID3 tags have been written. Renaming the file');

               // Update the status and continue on to the next step
               this.currentStep++;

               // If MoveToServer is NOT enabled, this is the last step
               if (!this.moveToServer) {
                    // The response returns the URL for the downloaded file
                    this.downloadLink = decodeURIComponent(response[0].replace(/\+/g, ' '));

                    this.finished();

                    return;
               } else { // Move To Server is enabled so process next step
                    this.processSteps();
               }
          },
          error => {
               this.handleError(Response, error);
          });*/
     }
}

export default You2Me