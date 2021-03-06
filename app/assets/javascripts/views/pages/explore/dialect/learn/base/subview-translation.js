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
import _ from 'underscore';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

export default class SubViewTranslation extends Component {

  static containerStyles = {
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: '#efefef',
    margin: '10px 0',
    padding: '10px'
  };

  static tabsStyles = {
    tabItemContainerStyle: {
      backgroundColor: 'transparent'
    }
  };

  static tabStyles = {
    headline: {
      fontSize: 12,
      color: '#000',
      paddingTop: 2,
      paddingBottom: 2,
      marginBottom: 5,
      textAlign: 'left'
    }
  };

  constructor(props, context){
    super(props, context);
  }

  render() {

    const _this = this;

    if ( !this.props.group )
      return <div></div>;

    const grouped = _.groupBy(this.props.group, function(obj) {
      return obj[_this.props.groupByElement];
    });

    if ( !grouped || _.isEmpty(grouped) )
      return <div></div>;

    return <div className="row" style={SubViewTranslation.containerStyles}>
      <div className="col-md-4">
        <h3>{this.props.children}</h3>
      </div>

      <div className="col-md-8">
      <Tabs tabItemContainerStyle={SubViewTranslation.tabsStyles.tabItemContainerStyle}>
      {_.map(grouped, function(group, key) {

        return <Tab style={SubViewTranslation.tabStyles.headline} label={key} key={key}>

        <List>

          {group.map(function(groupValue, key) {
            return (<ListItem key={key} primaryText={groupValue[_this.props.groupValue]} />);
          })}

        </List>

        </Tab>;

      })}
      </Tabs>
      </div>
    </div>;
  }
}
