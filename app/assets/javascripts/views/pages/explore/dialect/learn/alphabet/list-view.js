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

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import ProviderHelpers from 'common/ProviderHelpers';
import UIHelpers from 'common/UIHelpers';

import DocumentListView from 'views/components/Document/DocumentListView';

import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view';

import Preview from 'views/components/Editor/Preview';

/**
* List view for alphabet
*/
@provide
export default class ListView extends DataListView {
  
  static defaultProps = {
    DISABLED_SORT_COLS: ['state', 'related_audio'],
    DEFAULT_PAGE: 0,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'fvcharacter:alphabet_order',
    DEFAULT_SORT_TYPE: 'asc'
  }

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired, 
    fetchDialect2: PropTypes.func.isRequired,
    fetchCharacters: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    computeCharacters: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    filter: PropTypes.object,
    data: PropTypes.string,

    DISABLED_SORT_COLS: PropTypes.array,
    DEFAULT_PAGE: PropTypes.number,
    DEFAULT_PAGE_SIZE: PropTypes.number,
    DEFAULT_SORT_COL: PropTypes.string,
    DEFAULT_SORT_TYPE: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      columns : [
        { name: 'title', title: 'Character', render: function(v, data, cellProps){
          return v;
        }, sortName: 'fvcharacter:alphabet_order'},
        { name: 'fvcharacter:upper_case_character', title: 'Uppercase Character', render: function(v, data, cellProps){
          return selectn('properties.' + cellProps.name, data);
        }, sortName: 'fvcharacter:alphabet_order'},
        { name: 'related_words', title: 'Related Words', render: function(v, data, cellProps) {
            return UIHelpers.renderComplexArrayRow(selectn('contextParameters.character.' + cellProps.name, data), function (entry, i) {
                return <li key={selectn('uid', entry)}>{selectn('dc:title', entry)}</li>;
            }.bind(this));
          }.bind(this),
          sortName: 'fv:literal_translation/0/translation'
        },
        { name: 'related_audio', title: 'Audio', render: function(v, data, cellProps) {
            let firstAudio = selectn('contextParameters.character.' + cellProps.name + '[0]', data);
            if (firstAudio)
              return <Preview minimal={true} tagStyles={{width: '300px', maxWidth:'100%'}} key={selectn('uid', firstAudio)} expandedValue={firstAudio} type="FVAudio" />;
          }.bind(this)
        }
      ],
      sortInfo: {
        uiSortOrder: [], 
        currentSortCols: this.props.DEFAULT_SORT_COL,
        currentSortType: this.props.DEFAULT_SORT_TYPE
      },
      pageInfo: {
        page: this.props.DEFAULT_PAGE,
        pageSize: this.props.DEFAULT_PAGE_SIZE
      }
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', '_onEntryNavigateRequest', '_handleRefetch', '_handleSortChange', '_handleColumnOrderChange', '_resetColumns'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path);
    this._fetchListViewData(newProps, newProps.DEFAULT_PAGE, newProps.DEFAULT_PAGE_SIZE, newProps.DEFAULT_SORT_TYPE, newProps.DEFAULT_SORT_COL);
  }

  _onEntryNavigateRequest(item) {
    this.props.pushWindowPath('/' + this.props.routeParams.theme + item.path.replace('Alphabet', 'learn/alphabet'));
  }  

  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    props.fetchCharacters(props.routeParams.dialect_path + '/Alphabet',
    '&currentPageIndex=0' + 
    '&pageSize=100' + 
    '&sortOrder=' + sortOrder + 
    '&sortBy=' + sortBy);
  }

  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this.props.routeParams.dialect_path + '/Alphabet',
      'entity': this.props.computeCharacters
    },{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    }])

    const computeCharacters = ProviderHelpers.getEntry(this.props.computeCharacters, this.props.routeParams.dialect_path + '/Alphabet');
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
                {(() => {
                if (selectn('response.entries', computeCharacters)) {

                    return <DocumentListView
                                objectDescriptions="phrases" 
                                data={computeCharacters}
                                refetcher={this._handleRefetch}
                                onSortChange={this._handleSortChange}
                                onSelectionChange={this._onEntryNavigateRequest}
                                page={this.state.pageInfo.page}
                                pageSize={this.state.pageInfo.pageSize}
                                onColumnOrderChange={this._handleColumnOrderChange}
                                columns={this.state.columns}
                                sortInfo={this.state.sortInfo.uiSortOrder}
                                className="browseDataGrid" 
                                dialect={selectn('response', computeDialect2)} />;
                }
                })()}
        </PromiseWrapper>;
  }
}