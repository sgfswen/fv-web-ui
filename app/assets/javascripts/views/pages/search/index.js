/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import provide from 'react-redux-provide';

import TextField from 'material-ui/lib/text-field';
import CircularProgress from 'material-ui/lib/circular-progress';
import RaisedButton from 'material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

import StringHelpers from 'common/StringHelpers';
import DocumentListView from 'views/components/Document/DocumentListView';

@provide
export default class Search extends React.Component {

  static propTypes = {
	splitWindowPath: PropTypes.array.isRequired,
	pushWindowPath: PropTypes.func.isRequired,	
    querySearchResults: PropTypes.func.isRequired,
	computeSearchResults: PropTypes.object.isRequired
  };	
	
  constructor(props, context) {
    super(props, context);
    
    this.state = {
    	columns: [
    	           { minWidth: 80, name: 'title', title: 'Title', render: function (v) {
    	           		return (<span dangerouslySetInnerHTML={{__html: v}}></span>);
    	           }},
    	           { width: 60, name: 'type', title: 'Type', 
    	        	   render: function(v) {
    	        		   return v.replace("FV", "");
    	        	   }
    	           },
    	           { minWidth: 600, name: 'searchMatch', title: 'Match', render: function (v) {
    	           		return (<span dangerouslySetInnerHTML={{__html: v}}></span>);
    	           }},
    	           /*{ name: 'path', title: 'Document Location',
    	        	   render: function(v) {
    	        		   return (v.includes("/Workspaces/") ? "Workspace" : "Section");
    	        	   }
    	           },*/
    	           /*{ minWidth: 50, name: 'ancestry_family_title', title: 'Family'},
    	           { minWidth: 50, name: 'ancestry_language_title', title: 'Language'},    	               	           
    	           { minWidth: 50, name: 'ancestry_dialect_title', title: 'Dialect'}*/
    	           { 
    	           	   minWidth: 150, name: 'location', title: 'Location'
    	           }
    	],
    	queryParam: "",
    	queryPath: "",
    	queryFilter: "'FVWord', 'FVPhrase', 'FVBook', 'FVBookEntry'"
    };
        
    // Bind methods to 'this'
    ['_handleRefetch', '_handleSearchSubmit', '_computeQueryParam', '_computeQueryPath', '_handleSearchFieldChange',  '_onEntryNavigateRequest', '_handleQueryFilterChange'].forEach( (method => this[method] = this[method].bind(this)) ); 

  }

  fetchData(newProps) {	  
	  //console.log("fetchData");	  
	  if(this.state.queryParam != "") { 
		  // Decode URL and unescape single quotes
		  let queryParam = StringHelpers.clean(this.state.queryParam);		  
		  let queryPath = StringHelpers.clean(this.state.queryPath);		  
		  
		  newProps.querySearchResults(queryParam, queryPath, this.state.queryFilter, 1, 10);
	  }
  }

  // Fetch data on initial render
  componentDidMount() {  
	  this.state.queryParam = this._computeQueryParam();
	  this.state.queryPath = this._computeQueryPath();	
	  this.fetchData(this.props);
  }   

  componentDidUpdate(oldProps, oldState) {
	  //console.log("componentDidUpdate");
	  
	  // If url has changed, either the queryParam or queryPath is different - need to refetch
	  if(oldProps.splitWindowPath.join("/") != this.props.splitWindowPath.join("/")) {
		  //console.log("new path detected!");		  
		  this.state.queryParam = this._computeQueryParam();
		  this.state.queryPath = this._computeQueryPath();	
		  
		  // Handle the case where user is already on the search results page, but they submit a new search from the navigation search field
		  if(!this.props.computeSearchResults.isFetching) {
			  this.fetchData(this.props);
			  this.refs.searchDocumentListView.resetPage();
		  }	  
	  }
  }
	  
  _handleRefetch(dataGridProps, page, pageSize) { 
    this.props.querySearchResults(this.state.queryParam, decodeURI(this.state.queryPath), this.state.queryFilter, page, pageSize);
  }    
  
  _handleSearchSubmit() {
	  let newQueryParam = this.refs.searchTextField.getValue();
	  this.state.queryParam = newQueryParam;	  
	  this.props.pushWindowPath('/explore' + this.state.queryPath + '/search/' + this.state.queryParam);
	  this.fetchData(this.props);
	  this.refs.searchDocumentListView.resetPage();
  }

  _handleSearchFieldChange() {
	  this.setState({queryParam: this.refs.searchTextField.getValue()});
  }  

  _onEntryNavigateRequest(item) {

  	let replacePath = '';
    let splitPath = item.path.split('/');

    switch(item.type) {
    	case 'FVWord':
    		replacePath = '/learn/words/';
    	break;

    	case 'FVPhrase':
    		replacePath = '/learn/phrases/';
    	break;

    	case 'FVBook':
    		replacePath = '/learn/songs-stories/';
    	break;
    }

    this.props.pushWindowPath('/explore' + splitPath.join('/').replace('/Dictionary/', replacePath));
  }  
  
  _computeQueryPath() {
	  let path = "/" + this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length).join('/');
	  // Extract the query path
	  let queryPath = path.split("/search")[0];

	  //console.log("queryPath:" + queryPath);	  
	  return queryPath;
  }

  _computeQueryParam() {
	  let path = "/" + this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length).join('/');
	  let lastPathSegment = this.props.splitWindowPath[this.props.splitWindowPath.length - 1];
	  
	  let queryParam = "";
	  if(lastPathSegment != "search") {
		  queryParam = lastPathSegment;
		  //console.log("queryParam:" + queryParam);		  
	  }
	  
	  return queryParam;
  }  
  
  _handleQueryFilterChange = (event, index, value) => {
	  this.setState({queryFilter: value});
	  //console.log(this.state.queryFilter);  
  };
  
  render() {

	const { computeSearchResults } = this.props;

	if (computeSearchResults.isFetching || !computeSearchResults.success) {
		return <CircularProgress mode="indeterminate" size={3} />;
	}	

	let searchResults = Object.assign({}, computeSearchResults);

	// Very basic search matching. Should be replace by more performant operation (i.e. returned from server directly).
	if (computeSearchResults.success) {

		let searchTerm = this.state.queryParam;
//
		for (let i = 0; i < searchResults.response.entries.length; ++i) {

		computeSearchResults.response.entries.map(function(searchEntry) {
			let searchTermMatches = [];
			let match = "";
			
			if (searchResults.response.entries[i].properties['dc:title'].indexOf(searchTerm) !== -1) {
				searchResults.response.entries[i]['title'] = searchResults.response.entries[i]['title'].replace(searchTerm, '<strong>' + searchTerm + '</strong>');
			}

			searchResults.response.entries[i].properties['fv:definitions'].map(function(definition) {
				if (definition.translation.indexOf(searchTerm) !== -1) {
					searchTermMatches.push('<strong>Definitions</strong>: ' + definition.translation.replace(searchTerm, '<strong>' + searchTerm + '</strong>'));
				}
			});

			searchResults.response.entries[i].properties['fv:literal_translation'].map(function(definition) {
				if (definition.translation.indexOf(searchTerm) !== -1) {
					searchTermMatches.push('<strong>Literal Translations</strong>: ' + definition.translation.replace(searchTerm, '<strong>' + searchTerm + '</strong>'));
				}
			});

    	    searchResults.response.entries[i]['location'] = searchResults.response.entries[i]['ancestry_family_title'] + " > " + searchResults.response.entries[i]['ancestry_language_title'] + " > " + searchResults.response.entries[i]['ancestry_dialect_title'];
			searchResults.response.entries[i]['searchMatch'] = searchTermMatches.join('<br/>');
		});

		}
	}

    return <div>
    		<h1>Search</h1>
    		
    		<div className="col-xs-12">
	    		<div className="col-xs-4">
	    			<TextField ref="searchTextField" hintText="Please enter a search parameter..." onEnterKeyDown={this._handleSearchSubmit} onChange={this._handleSearchFieldChange} value={this.state.queryParam} fullWidth={true} />
	    		</div>
	    		<div className="col-xs-2">	    		
		            <SelectField value={this.state.queryFilter} onChange={this._handleQueryFilterChange}>
			            <MenuItem value="'FVWord', 'FVPhrase', 'FVBook', 'FVBookEntry'" primaryText="All Document Types" />
			            <MenuItem value="'FVWord'" primaryText="Words" />
			            <MenuItem value="'FVPhrase'" primaryText="Phrases" />
			            <MenuItem value="'FVBook', 'FVBookEntry'" primaryText="Songs and Stories" />
		            </SelectField>	    			    		
                </div>
    	    	<div className="col-xs-1">  			    		
                	<RaisedButton onTouchTap={this._handleSearchSubmit} label="Search" primary={true} /> 
                </div>	                 	
    		</div>
    		
		    <div className="col-xs-12">
			    <DocumentListView
			      ref="searchDocumentListView"
			      data={searchResults}
			      refetcher={this._handleRefetch}
			      onSelectionChange={this._onEntryNavigateRequest}
			      columns={this.state.columns}
			      className="browseDataGrid" />
			</div>
		</div>;
  }
}