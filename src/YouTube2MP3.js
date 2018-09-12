/*
TO DO
               ? <Button color="primary" onClick={this.submitClick} style={submitButtonStyle} variant="contained">{buttonText}</Button>
https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-assets-outside-of-the-module-system

Feature: look into audio fingerprinting using Acoustid https://acoustid.org/fingerprinter (maybe)
*/

import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { TextField } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const MobileDetect = require('mobile-detect');
const md = new MobileDetect(window.navigator.userAgent);
const isMobile=md.mobile();

const moveToServer = false;

const stepperStepNames = [
     'Started download',
     'Finished download',
     'Writing ID3 Tags',
     'Renaming the file',
];

// Form component 
class YouTube2MP3 extends React.Component {
     constructor(props) {
          super(props);
          
          this.state = {  
               currentStep : 1,
               downloadLinkVisible: false,
               // fieldArray format: KEY : { 'field name',required (true or false),'value or default value if initialized in state'  }
               fieldArray : {'URL' : ['url',true,(this.getParam("URL") !== "" && typeof this.getParam("URL") !== 'undefined' ? this.getParam("URL") : "")],'Artist' : ['artist',true,this.parseTitle('artist')],'Album': ['album',false,""],'Name' : ['trackname',true,this.parseTitle('title')],'Track #' : ['tracknum',false,""], 'Genre' : ['genre',false,""], 'Year' : ['year',false,""] },
               isFinished: false,
               isSubmitted : false, 
               mp3File : "",
               snackBarVisible: false,
               snackBarMessage: "",
               statusMessage : "Fields marked with an * are required",
          };

          // Bind custom methods to this
          this.downloadLinkClick = this.downloadLinkClick.bind(this);
          this.finished = this.finished.bind(this);
          this.formFieldChange = this.formFieldChange.bind(this);
          this.handleFetchResponse = this.handleFetchResponse.bind(this);
          this.resetForm = this.resetForm.bind(this);
          this.showSnackBarMessage=this.showSnackBarMessage.bind(this);
          this.submitClick = this.submitClick.bind(this);
          this.updateStatus = this.updateStatus.bind(this);

          // DELETE LATER!
          //this.state.fieldArray["URL"][2]="https://www.youtube.com/watch?v=Wch3gJG2GJ4";
          //this.state.fieldArray["Artist"][2]="a";
          //this.state.fieldArray["Name"][2]="a";

         if (moveToServer === true)
              stepperStepNames.push('Moving the file to new location'); 
     }
 
     // Build URL parameters
     buildParameters() {
          switch(this.state.currentStep) {
               case 1:
                    return '?step=1&URL=' + this.state.fieldArray["URL"][2];
               case 2:
                    return '?step=2&Filename=' + this.state.mp3File + '&Artist=' + this.state.fieldArray["Artist"][2] + '&Album=' + this.state.fieldArray["Album"][2] + '&TrackName=' + this.state.fieldArray["Name"][2] + '&TrackNum=' + this.state.fieldArray["Track #"][2] + '&Genre=' + this.state.fieldArray["Genre"][2]  + '&Year=' + this.state.fieldArray["Year"][2];
               case 3:
                    // Step count is included because if the file is downloaded, theres only steps 0-3. If the file is moved to a server, there's one extra step so the server side action is different for each situation
                    return '?step=3&Filename=' + this.state.mp3File + '&Artist=' + this.state.fieldArray["Artist"][2] + '&Album=' + this.state.fieldArray["Album"][2] + '&TrackName=' + this.state.fieldArray["Name"][2] + '&TrackNum=' + this.state.fieldArray["Track #"][2] + '&Genre=' + this.state.fieldArray["Genre"][2]  + '&Year=' + this.state.fieldArray["Year"][2] + '&StepCount=' +  stepperStepNames.length;
               case 4:
                    return '?step=4&Filename=' + encodeURI(this.state.mp3File) + '&Artist=' + this.state.fieldArray["Artist"][2] + '&Album=' + this.state.fieldArray["Album"][2];
               default:
                    return null;
          }
     }
     
     // Event handler when download link is clicked
     downloadLinkClick() {
          let fileName=this.state.mp3File;

          if (fileName.lastIndexOf("/") !== -1) {
               fileName=fileName.substring(fileName.lastIndexOf("/")+1);
          }

          window.location.href=fileName;
     }

     // Method called when all status have finished   
     finished() {      
          this.setState({isSubmitted : true});
          this.setState({downloadLinkVisible: true});
          this.setState({isFinished: true});
     }
    
     // When the text field value changes, store the value in the array
     formFieldChange = name => event => {
          let fld=this.state.fieldArray;
          fld[name][2]=event.target.value;
          this.setState({fieldArray : fld });
     }

     // Get URL parameter
     getParam(name) {
          let query = window.location.search.substr(1);
            
          if (query==="")
               return;

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
    
     // handles fetch response
     handleFetchResponse(response) {
          if (response[0].indexOf("ERROR") !== -1) {
               // write error status
               this.updateStatus("A fatal error occurred: " + response[0]);

               // Set submitted status            
               this.setState({isSubmitted : true});

               return;
          }

          switch (this.state.currentStep) {
               case 1: 
                    let mp3File = response[0];
                    this.setState({mp3File : mp3File});

                    /*
                    if (response[1] !== "") {
                         let newFieldArray={...this.state.fieldArray};
                         newFieldArray['Artist'][2]=response[1];
                         this.setState({fieldArray : newFieldArray});
                    }

                    if (response[2] !== "") {
                         let newFieldArray={...this.state.fieldArray};
                         newFieldArray['Title'][2]=response[2];
                         this.setState({fieldArray : newFieldArray});
                    } 
                    */

                    this.updateStatus("The file has been downloaded. Writing the ID3 tags");
           
                    // Update the status and continue on to the next step 
                    this.setState({ currentStep : 2}, () => this.submitClick());

                    break;
               case 2:
                    this.updateStatus("The ID3 tags have been written. Renaming the file");
      
                    // Update the status and continue on to the next step 
                    this.setState({currentStep : 3}, () => this.submitClick());

                    break;
               case 3:
                    // save the new file name
                    mp3File = response;

                    this.setState({mp3File : mp3File});

                    // If this is the last step, finalize everything 
                    if (stepperStepNames.length === 4) {          
                         this.updateStatus("Please click on the download button");
                         this.setState({currentStep : 4});
                         this.finished();
                    } else
                         this.setState({currentStep : 4}, () => this.submitClick());
               
                    break;
               case 4:
                     this.updateStatus("The file has been moved to the new location");
       
                     this.setState({currentStep : 5});
                     
                     this.finished();

                    break;
               default:
                    alert("Unknown AJAX status");
          } 
     }
  
     // Parse title from URL
     parseTitle(section) {
          // section can be artist name or song name
          let titleParam=this.getParam("Title");
            
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

     render() {
          const downloadButtonStyle = {
               backgroundColor: 'green',
               marginLeft: '15%',
          };
          
          const labelStyle = {
               display: 'inline-block',
               width: '100%',
          };
           
          const paperStyle = {
               width: '400px',
               borderStyle: 'thin',
               borderWidth: '1px'
          };
          
          const snackbarStyle= {
               maxWidth: '353px',
          };

          const snackbarStyleMobile= {
               position: 'absolute',
               zIndex: '999',
               minWidth: '353px',
               top: '35%',
          };

          const submitButtonStyle = {
               
          };
          
          const buttonText=(!this.state.isSubmitted ? "Start" : "Restart");
          const dlLink = (this.state.downloadLinkVisible && stepperStepNames.length === 4 ? <Button color="secondary" onClick={this.downloadLinkClick} style={downloadButtonStyle} variant="contained">Download</Button> : <div />);  
          const fields = Object.keys(this.state.fieldArray).map(key => this.renderTextFields(key));
          const stepperSteps = Object.keys(stepperStepNames).map(key => this.renderSteps(key));
    
          return (
               <div>
                    <Paper style={paperStyle} elevation={3}>
	                       <AppBar position="static">
		                          <Toolbar>
		                               <Typography variant="title" color="inherit">
			                                  YouTube to MP3
		                               </Typography>
		                          </Toolbar>
	                       </AppBar>

	                       <Grid container direction="column">
		                          {fields}
	                       </Grid>

	                       <h2>
                              <div style={labelStyle}>
                                   {this.state.statusMessage}
                              </div>
	                       </h2>
                     
                         <Grid container direction="row" justify="space-between">
                              {( (!this.state.isSubmitted || this.state.isFinished) &&
                                   <Button color="primary" onClick={this.submitClick} style={submitButtonStyle} variant="contained">{buttonText}</Button>
                              )}
                              
                              {dlLink}

                         </Grid>
                          
                         {(this.state.isSubmitted === true &&
	                            <Stepper activeStep={this.state.currentStep} orientation="vertical">
	                                 {stepperSteps}
	                            </Stepper>                               
                         )}
                    </Paper>
    
                    {(this.state.snackBarVisible === true &&
	                       <SnackbarContent message={this.state.snackBarMessage} style={(isMobile ? snackbarStyleMobile : snackbarStyle)} />
                    )}                    
               </div>
          );
     }

     // Render the steps 
     renderSteps(i) {
          return (
               <Step key={i} >
                    <StepLabel>{stepperStepNames[i]}</StepLabel>
               </Step>
          );
     }

     // Render the row with the Label and Field
     renderTextFields(i) {
          const txtFieldStyle = {
               marginTop: '25px',
          }

          return (
               <TextField key={i} placeholder={i} label={i} onChange={this.formFieldChange(i)} required={this.state.fieldArray[i][1]} style={txtFieldStyle} value={(this.state.fieldArray[i][2] != null ? this.state.fieldArray[i][2] : "")} />
          );
     }

     // Reset the form
     resetForm() {
          // Clear all of the field values
          let fieldArray=this.state.fieldArray;

          for (let key in fieldArray)
               fieldArray[key][2]="";

          this.setState({fieldArray : fieldArray});

          // reset the stepper
          this.setState({currentStep : 0});

          // Set initial status message
          this.setState({statusMessage : "Fields marked with an * are required" });

          // Reset submitted status            
          this.setState({isSubmitted : false});

          this.setState({currentStep : 1 });

          this.setState({isFinished: false});

          this.setState({downloadLinkVisible: false});          
     }

     // Show snackbar message
     showSnackBarMessage(message) {
          this.setState({snackBarMessage : message});
          this.setState({snackBarVisible : true});

          setTimeout(function(){
               this.setState({snackBarVisible : false});
          }.bind(this), 5000);
     }

     // submit button click event 
     submitClick() {
          // When the last step has been completed, the submit button changes to restart. This will reset everything when restart is clicked
          if (this.state.isFinished===true) {
               this.resetForm();
               return;
          }

          // Validate the required fields when the status == 2
          // if (this.state.currentStep==2) {
          let result=this.validateFields(this.state.fieldArray);

          if (result[0]==="Error") 
               return;

          // Show steps
          this.setState({isSubmitted : true});

          // Build fetch parameters 
          const params=this.buildParameters();

          // Set initial status
          if (this.state.currentStep===1)
               this.updateStatus("Starting the download");

          // Run the AJAX request
          fetch('./php/serverTasks.php' + params, {method: 'GET',}).then(response => response.json()).then((response) => {
               this.handleFetchResponse(response);
          }).catch(error => { 
               console.log('request failed', error); 
          });
     }

     // Update the status message 
     updateStatus(newStatus) {
          this.setState({statusMessage : newStatus});
     }

     // Validate all of the text fields
     validateFields(fieldArray) {
          if (fieldArray["URL"][2]==="") {
               this.showSnackBarMessage("Please enter the URL");
               return ["Error"];
          }

          if (!fieldArray["URL"][2].startsWith("http://") && !fieldArray["URL"][2].startsWith("https://")) {
               this.showSnackBarMessage("Please enter a valid URL beginning with http:// or https://");
               return ["Error"];
          }

          if (fieldArray["URL"][2].indexOf("youtube.com")===-1 && fieldArray["URL"][2].indexOf("youtu.be")===-1) {
               this.showSnackBarMessage("Only YouTube URLs are allowed");
               return ["Error"];
          }

          if (fieldArray["Artist"][2]===null) {
               this.showSnackBarMessage("Please enter the artist");
               return ["Error"];
          }

          if (fieldArray["Album"][1]===true && fieldArray["Album"][2]===null) {
               this.showSnackBarMessage("Please enter the album");
               return ["Error"];
          }

          if (fieldArray["Name"][2]===null) {
               this.showSnackBarMessage("Please enter the track name");
               return ["Error"];
          }

          if (fieldArray["Track #"][1]===true && fieldArray["Track #"][2]===null) {
               this.showSnackBarMessage("Please enter the track #");
               return ["Error"];
          }

          /*if (fieldArray["Genre"][2]==="") {
               return ["Error","Please enter the genre"];
          }*/

          if (fieldArray["Year"][1]===true && fieldArray["Year"][2]===null) {
               this.showSnackBarMessage("Please enter the year");
               return ["Error"];
          }

          return ["OK",""];
     }
}

export default YouTube2MP3;
