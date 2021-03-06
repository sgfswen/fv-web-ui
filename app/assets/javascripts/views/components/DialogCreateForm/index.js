import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

import PageDialectPhrasesCreate from 'views/pages/explore/dialect/learn/phrases/create';
import PageDialectCategoryCreate from 'views/pages/explore/dialect/category/create';
import PageDialectContributorsCreate from 'views/pages/explore/dialect/contributors/create';
import PageDialectPhraseBooksCreate from 'views/pages/explore/dialect/phrasebooks/create';

export default class DialogCreateForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open: false
    };
    
    // Bind methods to 'this'
    ['_onDocumentCreated'].forEach( (method => this[method] = this[method].bind(this)) );    
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  shouldComponentUpdate(newProps, newState) {

    if (newState != this.state)
      return true;

    return false;
  }  
  
  _onDocumentCreated(document) {
	  if(document) {
		  this.props.onChange(event, document);
	  }
  }
  
  render() {
	let createForm = "";
	let createNewButtonLabel = "";
	switch(this.props.fieldAttributes.type) {
		case "FVPhrase":
			createForm = <PageDialectPhrasesCreate embedded={true} routeParams={{dialect_path: this.props.context.path}} onDocumentCreated={this._onDocumentCreated} />;
			createNewButtonLabel = "Create New Phrase";
		break;
			
		case "FVCategory":
			if(this.props.fieldAttributes.page_provider.folder == "Phrase Books") {
				createForm = <PageDialectPhraseBooksCreate embedded={true} onDocumentCreated={this._onDocumentCreated} />;
				createNewButtonLabel = "Create New Phrase Book";
			}
			else if(this.props.fieldAttributes.page_provider.folder == "Categories") {
				createForm = <PageDialectCategoryCreate embedded={true} onDocumentCreated={this._onDocumentCreated} />;				
				createNewButtonLabel = "Create New Category";
			}
		break;
			
		case "FVContributor":
			createForm = <PageDialectContributorsCreate embedded={true} onDocumentCreated={this._onDocumentCreated} />;
			createNewButtonLabel = "Create New Contributor";
		break;				
	}  

	// Show Create New button, unless otherwise specified
	let createNewButton = "";
	if(!this.props.fieldAttributes.disableCreateNewButton || this.props.fieldAttributes.disableCreateNewButton === false) {
		createNewButton = <RaisedButton label={createNewButtonLabel} onTouchTap={this.handleOpen} />;
	}

    const actions = [
        <FlatButton
	      label="Cancel"
	      secondary={true}
	      onTouchTap={this.handleClose} />
	];	
	
    return (		
      <div>
      	
      	{createNewButton}
        
      	<Dialog
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}	
          actions={actions}>  
        
          {createForm}

        </Dialog>

      </div>
    );
  }
}