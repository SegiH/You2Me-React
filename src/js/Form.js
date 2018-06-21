/*
TO DO
https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-assets-outside-of-the-module-system
change handleSubmit() to use statusTaskNames array
work on restart form functionality
Feature: look into audio fingerprinting using Acoustid https://acoustid.org/fingerprinter (maybe)
*/

import React from 'react';
import FormCheckBox from './FormCheckBox.js';
import FormLabel from './FormLabel.js';
import FormField from './FormField.js';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Col, Label, Panel, Row } from 'react-bootstrap';
import { buildParameters, getParam, parseTitle, validateFields } from './Y2M.module';

const initialStatusTaskState = 'New';
            
const MobileDetect = require('mobile-detect');
const md = new MobileDetect(window.navigator.userAgent);
const isMobile=md.mobile();

const statusTaskNames = [
     '',
     'Downloading the song',
     'Writing ID3 Tags',
     'Renaming the file',
];

// Form component 
class Form extends React.Component {
     constructor(props) {
          super(props);
          
   	           this.state = {  
	           currentStatus : 1,
	       
               // fieldArray format: KEY : { 'field name',required (true or false),'value or default value if initialized in state'  }
               fieldArray : {'URL' : ['url',true,(getParam("URL") !== "" && typeof getParam("URL") !== 'undefined' ? getParam("URL") : "")],'Artist' : ['artist',true,parseTitle('artist')],'Album': ['album',false,""],'Name' : ['trackname',true,parseTitle('title')],'Track #' : ['tracknum',false,""], 'Genre' : ['genre',false,""], 'Year' : ['year',false,""] },
                   finished: false,
                   isSubmitted : false, 
	           mp3File : "",
	           processStatus : "Fields marked in red are required",
	           submitButtonDisabled: false,
	           statusTasks : { [statusTaskNames[1]] : [ initialStatusTaskState,false],[statusTaskNames[2]]  : [initialStatusTaskState,false], [statusTaskNames[3]] : [initialStatusTaskState,false]        },
               statusTasksVisible : false 
          };

          // Bind custom methods to this
          this.finished = this.finished.bind(this);
          this.formFieldChange = this.formFieldChange.bind(this);
          this.handleFetchResponse = this.handleFetchResponse.bind(this);
          this.resetForm = this.resetForm.bind(this);
          this.submitClick = this.submitClick.bind(this);
          this.updateStatus = this.updateStatus.bind(this);
          this.updateStatusTask = this.updateStatusTask.bind(this);
     }

     // Method called when all status have finished   
     finished() {
          //this.updateStatusTask('Done','Success');
      
          this.setState({isSubmitted : true});
          this.setState({finished: true});
     }

     // When the text field value changes, store the value in the array
     formFieldChange(name,value) {
          let fld=this.state.fieldArray;
          fld[name][2]=value;
	  this.setState({fieldArray : fld });
     }
    
     handleFetchResponse(response) {
          if (response[0].indexOf("ERROR") !== -1) {
               // write error status
               this.updateStatus("A fatal error occurred: " + response[0]);
                   
               // Update the status task
               this.updateStatusTask(statusTaskNames[this.state.currentStatus],'Danger');

               // Set submitted status            
               this.setState({isSubmitted : true});

               return;
         }

          switch (this.state.currentStatus) {
               case 1: 
                    let mp3File = response[0];
                    this.setState({mp3File : mp3File});

                    this.updateStatus("The file has been downloaded. Writing the ID3 tags");
           
                    // Update the status and continue on to the next step 
                    this.setState({ currentStatus : 2}, () => this.submitClick());

                    break;
               case 2:
                    this.updateStatus("The ID3 tags have been written. Renaming the file");
      
                    // Update the status and continue on to the next step 
                    this.setState({ currentStatus : 3}, () => this.submitClick());

                    break;
                case 3:
                    // save the new file name
                    mp3File = response;

                    this.setState({mp3File : mp3File});

                    this.updateStatus("The file has been renamed");
       
                    this.updateStatusTask('Renaming the file','Success');
                    
                    this.finished();

                    break;
               case 4:
                    // this.updateStatus("The file has been moved to the new location");
    
                    // this.updateStatusTask('Moving the file to new location','Success');
                    
                    // this.setState({ currentStatus : 5}, () => this.submitClick());
                     // this.finished();

                    break;
               default:
                    alert("Unknown AJAX status");
          } 
     }

     render() {
	      const buttonStyle = {
	           marginLeft: '40%',
	           marginRight: '50%',
          };
          
          const labelStyle = {
               display: 'inline-block',
               width: '100%',
          };

          const mobileLabelStyle = {
               display: 'inline-block',
               width: '375px',
          };

	  const fields = Object.keys(this.state.fieldArray).map(key => this.renderLabelFieldRow(key));
	  const statusTasks = Object.keys(this.state.statusTasks).map(key => this.renderStatusTasks(key));
	  
          let fileName=this.state.mp3File;

          if (fileName.lastIndexOf("/") !== -1) {
               fileName=fileName.substring(fileName.lastIndexOf("/")+1);
          }

          const dlLink = (this.state.finished ? <a href={fileName}>Download</a> : ""); 
	  
          let submitButtonDisabled=false;

	  // if (this.state.submitButtonDisabled && this.state.isSubmitted===false) {
	  if (this.state.submitButtonDisabled && !this.state.isSubmitted) {
               submitButtonDisabled=true; 
	  }	       
         
          const buttonText=(!this.state.isSubmitted ? "Start" : "Restart");

	  return (
               <Panel header="You to Me" bsStyle={"primary"}>
                    {fields} 
	                <Row>
	                     <Col xs={3}></Col>
		                 <Col xs={6}>
                              <Button onClick={this.submitClick} style={buttonStyle} bsStyle="primary" disabled={submitButtonDisabled}>{buttonText}</Button>
                         </Col>
		            </Row>
                    
                    <h2>
                         <Label bsStyle={"warning"} style={(isMobile ? mobileLabelStyle : labelStyle)}>{this.state.processStatus}</Label>
                    </h2>
	                 {this.state.statusTasksVisible ? statusTasks : ""}
                         {dlLink}
               </Panel>
          );
     }
   
     // Render the row with the Label and Field
     renderLabelFieldRow(i) {
          const fieldRow = <FormField key={i} required={this.state.fieldArray[i][1]} onChange={e => this.formFieldChange(i,e.target.value)} value={this.state.fieldArray[i][2]} ></FormField>
	 
          return (
	       <Row key={i}>
		    <FormLabel key={"Label-" + i} value={i}></FormLabel> 
		    {fieldRow}
	       </Row>
	  );
     }

     // Render the status task checkbox and labels 
     renderStatusTasks(i) {
	  const chkField = <FormCheckBox key={i} value={i} currentStatus={this.state.statusTasks[i][0]} checked={this.state.statusTasks[i][1]}></FormCheckBox> 
	 
	  return (
	       <div className='classdiv' key={i}>{chkField}</div>
	  );
     }
    
     resetForm() {
          // Clear all of the field values
          let fieldArray=this.state.fieldArray;

          for (let key in fieldArray) {
               fieldArray[key][2]="";
          }

          // this.setState({fieldArray : fieldArray});

          // reset all status tasks 
          let statusTasks=this.state.statusTasks;
 
          for (let key in statusTasks) {
               statusTasks[key][0]=initialStatusTaskState;
               statusTasks[key][1]=false;
          }
         
          this.setState({statusTasks : statusTasks});

          // Hide status tasks
          this.setState({statusTasksVisible : false});

          // Set initial status accordingly if we are on desktop or mobile
          if (md.mobile()==null) {
               this.setState({processStatus : "All fields are required" });
          } else {
               this.setState({processStatus : "URL, Artist and Genre are required" });
          }
               
          // Reset submitted status            
          this.setState({isSubmitted : false});
 
          // enable submit button 
          this.setState({submitButtonDisabled : false});

          this.setState({currentStatus : 1 });
     }

     // submit button click event 
     submitClick() {
          // When the last task has been completed, the submit button changes to restart. This will reset everything when restart is clicked
          if (this.state.isSubmitted===true) {
               this.resetForm();

               return;
          }
          
          // Validate the required fields
          let result=validateFields(this.state.fieldArray);
         
          if (result[0]==="Error") {
               this.updateStatus(result[1]);
              return;
          }

          // Once the user clicks on submit, disable the button to prevent further clicks
          if (this.state.submitButtonDisabled===false) {
	       this.setState({submitButtonDisabled : true});
          }
     
          // Show status tasks
          if (this.state.statusTasksVisible===false) {
	       this.setState({statusTasksVisible : true});
          }
       
          // Build fetch parameters 
          const params=buildParameters(this.state.currentStatus,this.state.fieldArray,this.state.mp3File);

          // Set initial status
          if (this.state.currentStatus===1) {
	       this.updateStatus("Starting the download");
          }
        
          // Update status task based on current status
          if (this.state.currentStatus===1) {
               this.updateStatusTask(statusTaskNames[1],'Info');
          } else {
               this.updateStatusTask(statusTaskNames[this.state.currentStatus-1],'Success');
               this.updateStatusTask(statusTaskNames[this.state.currentStatus],'Info');
          }
          
          // Run the AJAX request
          fetch('./php/serverTasks.php' + params, {method: 'GET',}).then(response => response.json()).then((response) => {
	       this.handleFetchResponse(response);
          }).catch(error => { 
               console.log('request failed', error); 
          });
     }
    
     // Update the gray status message label
     updateStatus(newStatus) {
	  this.setState({processStatus : newStatus});
     }
     
     // Update the status task 
     updateStatusTask(taskName,value) {
          let currentStatus={ ...this.state.statusTasks};
          currentStatus[taskName][0]=value;
 
          // Check the checkbox if the status is not New or Info
          currentStatus[taskName][1]=(value !== 'New' && value !== 'Info' ? true : false);

          this.setState({statusTasks : currentStatus });
     }
}

export default Form;
