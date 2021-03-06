import React from 'react';
import t from 'tcomb-form';
import selectn from 'selectn';

import FontIcon from 'material-ui/lib/font-icon';
import FlatButton from 'material-ui/lib/flat-button';

import AddMediaComponent from 'views/components/Editor/AddMediaComponent';
import SelectMediaComponent from 'views/components/Editor/SelectMediaComponent';
import Preview from 'views/components/Editor/Preview';

import Paper from 'material-ui/lib/paper';

/**
* Define auto-suggest factory
*/
function renderInput(locals) {

  const _onRequestEdit = function (event) {
    locals.onChange(null);
  }

  const onComplete = function (fullValue) {
    locals.onChange(fullValue.uid);
    locals.setExpandedValue(fullValue);
  };

  const onCancel = function () {

    let initialValue = selectn('context.initialValues.' + locals.attrs.name, locals);

    if (initialValue)
      locals.onChange(initialValue);
  };

  let content = <Paper style={{maxWidth: '400px', textAlign: 'center'}} zDepth={2}>
      <Preview id={locals.value} expandedValue={selectn('attrs.expandedValue', locals)} type={locals.type} />
      <FlatButton onTouchTap={_onRequestEdit} label="Replace Selection" labelPosition="after">
        <FontIcon style={{verticalAlign: 'middle'}} className="material-icons">swap_horiz</FontIcon>
      </FlatButton>
  </Paper>;

  if (!locals.value) {
    content = <div>
                <AddMediaComponent type={locals.type} label="Upload New" onComplete={onComplete} dialect={locals.context} />
                <SelectMediaComponent type={locals.type} label="Browse Existing" onComplete={onComplete} dialect={locals.context} />
                {(selectn('context.initialValues.' + locals.attrs.name, locals)) ? <FlatButton onTouchTap={onCancel} label="Cancel" /> : ''}
              </div>;
  }

  return <div>{content}</div>;
}

const mediaTemplate = t.form.Form.templates.textbox.clone({ renderInput })

export default class MediaFactory extends t.form.Textbox {

  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { expandedValue: null } );

    this.setExpandedValue = this.setExpandedValue.bind(this);
  }

  setExpandedValue(expandedValue) {
	  this.setState({ expandedValue });
  }

  getLocals() {
    const locals = super.getLocals();
    locals.attrs = this.getAttrs();
    locals.setExpandedValue = this.setExpandedValue;
    locals.attrs.expandedValue = this.state.expandedValue;

    return locals;
  }

  getTemplate() {
    return mediaTemplate
  }
}