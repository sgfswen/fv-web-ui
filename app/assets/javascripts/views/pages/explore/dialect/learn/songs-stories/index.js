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
import Immutable, { List, Map } from 'immutable';

import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import ConfGlobal from 'conf/local.json';

import ProviderHelpers from 'common/ProviderHelpers';
import StringHelpers from 'common/StringHelpers';

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base';

import RaisedButton from 'material-ui/lib/raised-button';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

import {ListView} from './list-view';

import withFilter from 'views/hoc/grid-list/with-filter';

const DEFAULT_LANGUAGE = 'english';

const FilteredCardList = withFilter(ListView);

/**
* Learn songs
*/
@provide
export default class PageDialectLearnStoriesAndSongs extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    fetchBooks: PropTypes.func.isRequired,
    computeBooks: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired, 
    routeParams: PropTypes.object.isRequired,
    typeFilter: PropTypes.string,
    typePlural: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      filteredList: null
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', 'fixedListFetcher'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path);

    newProps.fetchBooks(newProps.routeParams.dialect_path + '/Stories & Songs',
    (selectn('filter.currentAppliedFilter', newProps) ? Object.values(newProps.filter.currentAppliedFilter).join('') : '')
    );
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps);
    }
  }

  fixedListFetcher(list) {
    this.setState({
      filteredList: list
    });
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path);
  }

  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this.props.routeParams.dialect_path + '/Stories & Songs',
      'entity': this.props.computeBooks
    },{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    }])

    const computeBooks = ProviderHelpers.getEntry(this.props.computeBooks, this.props.routeParams.dialect_path + '/Stories & Songs');
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
              <div className="row">
                <div className="col-xs-8"></div>
                <div className={classNames('col-xs-4', 'text-right')}>
                  <AuthorizationFilter filter={{role: ['Record', 'Approve', 'Everything'], entity: selectn('response', computeDialect2), login: this.props.computeLogin}}>
                    <RaisedButton label={"Create " + this.props.typeFilter + " Book"} onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/create')} primary={true} />
                  </AuthorizationFilter>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">

                  <h1>{selectn('response.title', computeDialect2)} {StringHelpers.toTitleCase(this.props.typePlural)}</h1>

                  <div className="row" style={{marginBottom: '20px'}}>

                    <FilteredCardList
                      defaultLanguage={DEFAULT_LANGUAGE}
                      filterOptionsKey="Books"
                      fixedList={true}
                      fixedListFetcher={this.fixedListFetcher}
                      filteredItems={this.state.filteredList}
                      area={this.props.routeParams.area}
                      applyDefaultFormValues={true}
                      formValues={{'properties.fvbook:type': this.props.typeFilter}}
                      metadata={selectn('response', computeBooks)}
                      items={selectn('response.entries', computeBooks) || []}
                      action={this._onNavigateRequest}  />

                  </div>

                </div>
              </div>
        </PromiseWrapper>;
  }
}
