// Text field component 
import React from 'react';
import { Col } from 'react-bootstrap';

// Stateless functional component
/*const FormField = props => 
     <Col xs={6}><h2><input type="text" style={{'marginLeft':'5%','MarginRight':'25%'}} name={props.value} required={(props.required===true ? "required" : "")} onChange={props.onChange} value={props.value} /></h2></Col>
*/
const MobileDetect = require('mobile-detect');
const md = new MobileDetect(window.navigator.userAgent);
const isMobile=md.mobile();

class FormField extends React.Component {
     render() {
          // text field style
	  const fieldStyle = {
	       marginLeft: '0%',
	       marginRight: '5%',
	       width: '415px',
	  };

	  const mobileFieldStyle = {
	       marginLeft: '20%',
	       marginRight: '5%',
	       width: '225px',
	  };
      
          return (
	       <Col xs={4} md={6} lg={9}><h2><input type="text" style={(isMobile ? mobileFieldStyle : fieldStyle)} name={this.props.value} required={(this.props.required===true ? "required" : "")} onChange={this.props.onChange} value={this.props.value || ''} /></h2></Col>
	  );
     }
}

export default FormField;
