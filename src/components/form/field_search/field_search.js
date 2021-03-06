import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Browser } from '../../../services/browser';
import { ENTER } from '../../../services/key_codes';

import {
  EuiFormControlLayout,
} from '../form_control_layout';

import {
  EuiValidatableControl,
} from '../validatable_control';


const propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  isInvalid: PropTypes.bool,
  fullWidth: PropTypes.bool,
  isLoading: PropTypes.bool,
  inputRef: PropTypes.func,
  onSearch: PropTypes.func,
  /**
   * when `true` the search will be executed (that is, the `onSearch` will be called) as the
   * user types.
   */
  incremental: PropTypes.bool
};

const defaultProps = {
  fullWidth: false,
  isLoading: false,
  incremental: false
};

export class EuiFieldSearch extends Component {

  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.cleanups = [];
  }

  componentDidMount() {
    if (Browser.isEventSupported('search', this.inputElement)) {
      const onSearch = (event) => {
        if (this.props.onSearch) {
          this.props.onSearch(event.target.value);
        }
      };
      this.inputElement.addEventListener('search', onSearch);
      this.cleanups.push(() => this.inputElement.removeEventListener('search', onSearch));
    }
  }

  componentWillUnmount() {
    this.cleanups.forEach(cleanup => cleanup());
  }

  onKeyUp = (incremental, onSearch, event) => {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event);
      if (event.defaultPrevented) {
        return;
      }
    }
    if (onSearch && (incremental || event.keyCode === ENTER)) {
      onSearch(event.target.value);
    }
  };

  render() {

    const { className,
      id,
      name,
      placeholder,
      value,
      isInvalid,
      fullWidth,
      isLoading,
      inputRef,
      incremental,
      onSearch,
      ...rest } = this.props;

    const classes = classNames(
      'euiFieldSearch',
      {
        'euiFieldSearch--fullWidth': fullWidth,
        'euiFieldSearch-isLoading': isLoading,
      },
      className
    );

    const ref = (inputElement) => {
      this.inputElement = inputElement;
      if (inputRef) {
        inputRef(inputElement);
      }
    };

    return (

      <EuiFormControlLayout
        icon="search"
        fullWidth={fullWidth}
        isLoading={isLoading}
      >
        <EuiValidatableControl isInvalid={isInvalid}>
          <input
            type="search"
            id={id}
            name={name}
            placeholder={placeholder}
            className={classes}
            value={value}
            onKeyUp={this.onKeyUp.bind(this, incremental, onSearch)}
            ref={ref}
            {...rest}
          />
        </EuiValidatableControl>
      </EuiFormControlLayout>
    );
  }
}
