// Text field component 
import React from 'react';
import { Col } from 'react-bootstrap';

// Stateless functional component
/*const FormField = props => 
     <Col xs={6}><h2><input type="text" style={{'marginLeft':'5%','MarginRight':'25%'}} name={props.value} required={(props.required===true ? "required" : "")} onChange={props.onChange} value={props.value} /></h2></Col>
*/

class FormField extends React.Component {
    render() {
         // text field style
	 const fieldStyle = {
	      marginLeft: '5%',
	      marginRight: '25%',
	 };
      
         return (
	      <Col xs={6}><h2><input type="text" style={fieldStyle} name={this.props.value} required={(this.props.required===true ? "required" : "")} onChange={this.props.onChange} value={this.props.value} /></h2></Col>
	 );
    }
}

export default FormField;