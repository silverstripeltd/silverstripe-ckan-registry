/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/src/boot/index.js":
/*!**********************************!*\
  !*** ./client/src/boot/index.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _registerComponents = _interopRequireDefault(__webpack_require__(/*! boot/registerComponents */ "./client/src/boot/registerComponents.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
window.document.addEventListener('DOMContentLoaded', () => {
  (0, _registerComponents.default)();
});

/***/ }),

/***/ "./client/src/boot/registerComponents.js":
/*!***********************************************!*\
  !*** ./client/src/boot/registerComponents.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _Injector = _interopRequireDefault(__webpack_require__(/*! lib/Injector */ "lib/Injector"));
var _CKANResourceLocatorField = _interopRequireDefault(__webpack_require__(/*! components/CKANResourceLocatorField */ "./client/src/components/CKANResourceLocatorField.js"));
var _CKANPresentedOptionsField = _interopRequireDefault(__webpack_require__(/*! components/CKANPresentedOptionsField */ "./client/src/components/CKANPresentedOptionsField.js"));
var _CKANResultConditionsField = _interopRequireDefault(__webpack_require__(/*! components/CKANResultConditionsField */ "./client/src/components/CKANResultConditionsField.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = () => {
  _Injector.default.component.registerMany({
    CKANResourceLocatorField: _CKANResourceLocatorField.default,
    CKANPresentedOptionsField: _CKANPresentedOptionsField.default,
    CKANResultConditionsField: _CKANResultConditionsField.default
  });
};
exports["default"] = _default;

/***/ }),

/***/ "./client/src/components/CKANPresentedOptionsField.js":
/*!************************************************************!*\
  !*** ./client/src/components/CKANPresentedOptionsField.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.SELECT_TYPE_CUSTOM = exports.SELECT_TYPE_ALL = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "prop-types"));
var _Injector = __webpack_require__(/*! lib/Injector */ "lib/Injector");
var _reactstrap = __webpack_require__(/*! reactstrap */ "reactstrap");
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "components/FieldHolder/FieldHolder"));
var _CKANApi = _interopRequireDefault(__webpack_require__(/*! lib/CKANApi */ "./client/src/lib/CKANApi.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "classnames"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const SELECT_TYPE_ALL = '0';
exports.SELECT_TYPE_ALL = SELECT_TYPE_ALL;
const SELECT_TYPE_CUSTOM = '1';
exports.SELECT_TYPE_CUSTOM = SELECT_TYPE_CUSTOM;
class CKANPresentedOptionsField extends _react.Component {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      customOptions: [],
      selectType: props.selectTypeDefault,
      selections: [],
      suggestedOptions: [],
      suggestedOptionCache: {},
      loading: false,
      fetchFailure: false,
      separatorDelimiter: '',
      ...value
    };
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectTypeChange = this.handleSelectTypeChange.bind(this);
    this.handleDelimiterChange = this.handleDelimiterChange.bind(this);
    this.handleExecuteSeparator = this.handleExecuteSeparator.bind(this);
    this.handleTryAgain = this.handleTryAgain.bind(this);
  }
  componentDidMount() {
    this.loadSuggestedOptions();
  }
  getFieldName(fieldName) {
    return `${this.props.name}-${fieldName}`;
  }
  getInputValue() {
    return this.state.customOptions.join('\n');
  }
  getSelectType() {
    if (typeof this.state.selectType !== 'undefined') {
      return String(this.state.selectType);
    }
    return String(this.props.data.selectTypeDefault);
  }
  loadSuggestedOptions() {
    let resetFetchFailure = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const {
      selectedFields
    } = this.props;
    this.setState({
      suggestedOptions: [],
      loading: false
    });
    if (resetFetchFailure) {
      this.setState({
        fetchFailure: false
      });
    }
    if (!selectedFields.length) {
      return [];
    }
    let options = [];
    const {
      suggestedOptionCache,
      separatorDelimiter,
      fetchFailure,
      selections
    } = this.state;
    const loadPromises = [];
    selectedFields.forEach(field => {
      if (suggestedOptionCache[field]) {
        options = options.concat(suggestedOptionCache[field]);
        return;
      }
      if (!fetchFailure || resetFetchFailure) {
        loadPromises.push(this.fetchOptionsForField(field));
      }
    });
    if (!loadPromises.length) {
      options = this.splitOptionsBySeparator(options, separatorDelimiter);
      const suggestedOptions = this.prepOptions(options);
      this.setState({
        suggestedOptions,
        selections: selections.length ? selections : [...suggestedOptions],
        loading: false
      });
      return options;
    }
    this.setState({
      loading: true
    });
    Promise.all(loadPromises).then(() => this.loadSuggestedOptions());
    return null;
  }
  prepOptions(options) {
    const trimmed = options.map(item => {
      if (item === null) {
        return null;
      }
      return String(item).trim().replace(/\s+/g, ' ');
    });
    return trimmed.filter((item, index) => {
      if (!item || typeof item !== 'string' || item.length === 0) {
        return false;
      }
      if (trimmed.indexOf(item) !== index) {
        return false;
      }
      return true;
    }).sort();
  }
  fetchOptionsForField(field) {
    const {
      data: {
        endpoint,
        resource
      }
    } = this.props;
    return _CKANApi.default.loadDatastore(endpoint, resource).search([field], null, true, 1000).then(result => {
      let newOptions = [];
      newOptions = result.records.map(record => record[field]);
      this.setState(state => ({
        suggestedOptionCache: {
          ...state.suggestedOptionCache,
          [field]: newOptions,
          fetchFailure: false
        }
      }));
    }).catch(() => {
      this.setState(() => ({
        loading: false,
        fetchFailure: true
      }));
    });
  }
  splitOptionsBySeparator(options, delimiter) {
    if (!delimiter || !delimiter.length) {
      return options;
    }
    return options.reduce((accumulator, item) => accumulator.concat(item.split(delimiter)), []);
  }
  handleCheckboxChange(event) {
    const {
      selections
    } = this.state;
    const currentCheckedIndex = selections.indexOf(event.target.value);
    const newSelections = selections;
    if (currentCheckedIndex < 0) {
      newSelections.push(event.target.value);
    } else {
      newSelections.splice(currentCheckedIndex, 1);
    }
    this.setState({
      selections: newSelections
    });
  }
  handleInputChange(event) {
    this.setState({
      customOptions: event.target.value.split('\n').map(value => value.trim())
    });
  }
  handleSelectTypeChange(event) {
    this.setState({
      selectType: event.target.value
    });
  }
  handleDelimiterChange(event) {
    this.setState({
      separatorDelimiter: event.target.value
    });
  }
  handleExecuteSeparator() {
    const {
      separatorDelimiter
    } = this.state;
    const options = this.loadSuggestedOptions();
    if (!separatorDelimiter.length) {
      return;
    }
    if (!options) {
      return;
    }
    const newOptions = this.prepOptions(this.splitOptionsBySeparator(options, separatorDelimiter));
    let selections = this.state.selections;
    if (!this.props.value || !this.props.value.selections || !this.props.value.selections.length) {
      selections = [...newOptions];
    }
    this.setState({
      suggestedOptions: newOptions,
      selections
    });
  }
  handleTryAgain() {
    this.loadSuggestedOptions(true);
  }
  isCheckboxChecked(value) {
    return this.state.selections.includes(value);
  }
  renderFreetextInput() {
    const {
      readOnly
    } = this.props;
    if (!readOnly && this.getSelectType() !== SELECT_TYPE_CUSTOM) {
      return null;
    }
    const description = _i18n.default._t('CKANPresentedOptionsField.MANUAL_OPTION_DESCRIPTION', 'Options provided must match the data within the selected column. Each option should be ' + 'placed on a new line.');
    let value = this.getInputValue();
    if (readOnly && this.getSelectType() !== SELECT_TYPE_CUSTOM) {
      value = this.state.selections.join('\n');
    }
    return _react.default.createElement(_reactstrap.Row, null, _react.default.createElement(_reactstrap.Col, {
      lg: 9,
      sm: 12
    }, _react.default.createElement(_reactstrap.Input, {
      type: "textarea",
      className: "ckan-presented-options__manual-options",
      name: this.getFieldName('options-custom'),
      onChange: this.handleInputChange,
      value: value,
      readOnly: readOnly
    })), _react.default.createElement(_reactstrap.Col, {
      lg: 3,
      sm: 12
    }, !readOnly && description));
  }
  renderHiddenInput() {
    const {
      name,
      readOnly
    } = this.props;
    if (readOnly) {
      return null;
    }
    const {
      selections,
      customOptions,
      separatorDelimiter
    } = this.state;
    const value = {
      customOptions,
      selectType: this.getSelectType(),
      selections,
      separatorDelimiter
    };
    return _react.default.createElement("input", {
      type: "hidden",
      name: name,
      value: JSON.stringify(value)
    });
  }
  renderCheckboxList() {
    const fieldName = this.getFieldName('options');
    const {
      LoadingComponent,
      readOnly
    } = this.props;
    const {
      loading,
      suggestedOptions
    } = this.state;
    const innerContent = suggestedOptions.length ? suggestedOptions.map((option, index) => _react.default.createElement(_reactstrap.FormGroup, {
      key: option,
      className: "ckan-presented-options__option-group",
      check: true
    }, _react.default.createElement(_reactstrap.Input, {
      id: `${fieldName}-${index}`,
      type: "checkbox",
      name: `${fieldName}[]`,
      onChange: this.handleCheckboxChange,
      checked: this.isCheckboxChecked(option),
      value: option,
      readOnly: readOnly
    }), _react.default.createElement(_reactstrap.Label, {
      for: `${fieldName}-${index}`
    }, option))) : _react.default.createElement("div", null, this.renderBadFetchMessage(), _react.default.createElement("span", {
      className: "ckan-presented-options__options-list-empty"
    }, _i18n.default._t('CKANPresentedOptionsField.PLEASE_SELECT_COLUMNS', 'Please select columns to be able to select from all options')));
    return _react.default.createElement("fieldset", {
      className: "ckan-presented-options__options-list"
    }, loading ? _react.default.createElement(LoadingComponent, null) : innerContent);
  }
  renderSeparator() {
    const {
      readOnly
    } = this.props;
    if (readOnly) {
      return null;
    }
    return _react.default.createElement(_reactstrap.FormGroup, {
      className: "ckan-presented-options__option-separator"
    }, _react.default.createElement(_reactstrap.Label, {
      for: "optionSeparator"
    }, _i18n.default._t('CKANPresentedOptionsField.DELIMITER', 'Delimiter')), _react.default.createElement(_reactstrap.InputGroup, null, _react.default.createElement(_reactstrap.Input, {
      value: this.state.separatorDelimiter,
      onChange: this.handleDelimiterChange
    }), _react.default.createElement(_reactstrap.InputGroupAddon, {
      addonType: "append"
    }, _react.default.createElement(_reactstrap.Button, {
      onClick: this.handleExecuteSeparator,
      color: "primary"
    }, _i18n.default._t('CKANPresentedOptionsField.UPDATE', 'Update')))), _react.default.createElement("div", {
      className: "form__field-description"
    }, _i18n.default._t('CKANPresentedOptionsField.SPLIT_OPTIONS_DESCRIPTION', 'Split options by characters. eg. comma')));
  }
  renderBadFetchMessage() {
    const {
      data: {
        selectTypes
      }
    } = this.props;
    const manualAdd = selectTypes.find(type => type.value.toString() === SELECT_TYPE_CUSTOM).title;
    const {
      fetchFailure
    } = this.state;
    const fetchErrorDescription = _i18n.default._t('CKANPresentedOptionsField.FETCH_FAILURE', 'There was an issue fetching the available options. ');
    const tryAgain = _i18n.default._t('CKANPresentedOptionsField.RETRY_FETCH', 'Try again?');
    const orManuallyAdd = _i18n.default.inject(_i18n.default._t('CKANPresentedOptionsField.OR_MANUAL', ' Or choose to "{manualAdd}"'), {
      manualAdd
    });
    return fetchFailure && _react.default.createElement("div", {
      className: "ckan-presented-options__fetch-failure alert alert-danger"
    }, fetchErrorDescription, _react.default.createElement("a", {
      className: "ckan-presented-options__try-again alert-link",
      onClick: this.handleTryAgain,
      role: "button",
      tabIndex: "0"
    }, tryAgain), orManuallyAdd && null);
  }
  renderCheckboxListAndSeparator() {
    const {
      readOnly
    } = this.props;
    if (readOnly || this.getSelectType() !== SELECT_TYPE_ALL) {
      return null;
    }
    return _react.default.createElement(_reactstrap.Row, null, _react.default.createElement(_reactstrap.Col, {
      lg: 9,
      sm: 12
    }, this.renderCheckboxList()), _react.default.createElement(_reactstrap.Col, {
      lg: 3,
      sm: 12
    }, this.renderSeparator()));
  }
  renderRadioOptions() {
    const {
      readOnly,
      data: {
        selectTypes
      }
    } = this.props;
    if (readOnly) {
      return null;
    }
    const selectedValue = this.getSelectType();
    return selectTypes.map(option => _react.default.createElement(_reactstrap.FormGroup, {
      key: option.value,
      className: "ckan-presented-options__option-group"
    }, _react.default.createElement(_reactstrap.Label, {
      for: `option-${option.value}`,
      check: true
    }, _react.default.createElement(_reactstrap.Input, {
      id: `option-${option.value}`,
      type: "radio",
      name: this.getFieldName('select-type'),
      value: option.value,
      onChange: this.handleSelectTypeChange,
      checked: selectedValue === String(option.value)
    }), option.title)));
  }
  render() {
    const {
      extraClass
    } = this.props;
    return _react.default.createElement("div", {
      className: (0, _classnames.default)('ckan-presented-options', extraClass)
    }, this.renderRadioOptions(), this.renderCheckboxListAndSeparator(), this.renderFreetextInput(), this.renderHiddenInput());
  }
}
exports.Component = CKANPresentedOptionsField;
CKANPresentedOptionsField.propTypes = {
  selectedFields: _propTypes.default.arrayOf(_propTypes.default.string),
  data: _propTypes.default.shape({
    endpoint: _propTypes.default.string.isRequired,
    resource: _propTypes.default.string.isRequired,
    selectTypeDefault: _propTypes.default.string,
    selectTypes: _propTypes.default.arrayOf(_propTypes.default.shape({
      value: _propTypes.default.string,
      title: _propTypes.default.string
    }))
  }),
  extraClass: _propTypes.default.string,
  name: _propTypes.default.string,
  value: _propTypes.default.object,
  readOnly: _propTypes.default.bool,
  LoadingComponent: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]).isRequired
};
CKANPresentedOptionsField.defaultProps = {
  data: {},
  extraClass: '',
  selectedFields: [],
  value: {},
  readOnly: false
};
var _default = (0, _FieldHolder.default)((0, _Injector.inject)(['Loading'], LoadingComponent => ({
  LoadingComponent
}), () => 'CKAN.Filter.PresentedOptions')(CKANPresentedOptionsField));
exports["default"] = _default;

/***/ }),

/***/ "./client/src/components/CKANResourceLocatorField.js":
/*!***********************************************************!*\
  !*** ./client/src/components/CKANResourceLocatorField.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "prop-types"));
var _CKANApi = _interopRequireDefault(__webpack_require__(/*! lib/CKANApi */ "./client/src/lib/CKANApi.js"));
var _i18n = _interopRequireDefault(__webpack_require__(/*! i18n */ "i18n"));
var _reactstrap = __webpack_require__(/*! reactstrap */ "reactstrap");
var _debounce = _interopRequireDefault(__webpack_require__(/*! lodash/debounce */ "./node_modules/lodash/debounce.js"));
var _Injector = __webpack_require__(/*! lib/Injector */ "lib/Injector");
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "components/FieldHolder/FieldHolder"));
var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "classnames"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class CKANResourceLocatorField extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: _CKANApi.default.generateURI(props.value || {}) || '',
      spec: props.value || null,
      validationPending: false,
      forceInvalid: false,
      currentDataset: null,
      forceInvalidTimeout: null,
      changesNotified: false,
      isMounting: true
    };
    this.valueInput = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleResourceSelect = this.handleResourceSelect.bind(this);
    this.handleNotificationOfChanges = this.handleNotificationOfChanges.bind(this);
    this.delayedValidateInput = (0, _debounce.default)(this.validateInput.bind(this), 500);
  }
  componentDidMount() {
    const {
      uri
    } = this.state;
    if (uri.length) {
      this.validateInput();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.valueInput && JSON.stringify(prevState.spec) !== JSON.stringify(this.state.spec)) {
      const event = new Event('change', {
        bubbles: true
      });
      event.simulated = true;
      this.valueInput.dispatchEvent(event);
    }
  }
  getInvalidURLMessage() {
    const {
      currentDataset,
      spec,
      forceInvalid,
      isMounting
    } = this.state;
    const message = {
      type: 'error'
    };
    if (isMounting || !forceInvalid && (!spec || currentDataset)) {
      return null;
    }
    message.value = _i18n.default._t('CKANResourceLocatorField.INVALID_DATASET_URL', 'The provided data source URL does not appear to be a valid CKAN data set.');
    return message;
  }
  handleChange(event) {
    const uri = event.target.value;
    clearTimeout(this.state.forceInvalidTimeout);
    this.setState({
      uri,
      forceInvalid: false,
      forceInvalidTimeout: null
    });
    this.delayedValidateInput();
    this.handleNotificationOfChanges();
  }
  handleResourceSelect(event, _ref) {
    let {
      value
    } = _ref;
    this.setState({
      spec: {
        ...this.state.spec,
        resource: value
      }
    });
    this.handleNotificationOfChanges();
  }
  handleNotificationOfChanges() {
    const {
      value
    } = this.props;
    const {
      changesNotified
    } = this.state;
    if (changesNotified || !value || value.length === 0) {
      return;
    }
    window.alert(_i18n.default._t('CKANResourceLocatorField.CHANGES_WARNING', 'Please note: Changing the data source URL or resource will clear all' + ' existing columns and filters when saving the page.'));
    this.setState({
      changesNotified: true
    });
  }
  validateInput() {
    const {
      uri
    } = this.state;
    const {
      defaultEndpoint
    } = this.props;
    const spec = _CKANApi.default.parseURI(uri);
    if (spec && !spec.endpoint && defaultEndpoint) {
      spec.endpoint = defaultEndpoint;
      if (spec.dataset) {
        this.setState({
          uri: _CKANApi.default.generateURI(spec)
        });
      }
    }
    if (!spec || !spec.endpoint) {
      this.setState({
        spec: null,
        forceInvalidTimeout: setTimeout(() => this.setState({
          forceInvalid: true
        }), 2000),
        currentDataset: null
      });
      return;
    }
    this.setState({
      validationPending: true
    });
    const handleErrorResponse = () => this.setState({
      validationPending: false,
      isMounting: false,
      spec: null,
      currentDataset: null
    });
    if (spec.resource) {
      if (!spec.dataset) {
        _CKANApi.default.loadResource(spec.endpoint, spec.resource).then(resource => {
          const newSpec = {
            ...spec,
            dataset: resource.package_id
          };
          this.setState({
            spec: newSpec,
            uri: _CKANApi.default.generateURI(newSpec) || '',
            isMounting: false
          });
          this.validateInput();
        }, handleErrorResponse);
        return;
      }
    }
    _CKANApi.default.loadDataset(spec.endpoint, spec.dataset).then(dataset => {
      let newUri = uri;
      if (dataset.name) {
        spec.dataset = dataset.name;
        newUri = _CKANApi.default.generateURI(spec);
      }
      if (spec.resource && dataset) {
        newUri = newUri.substring(0, newUri.lastIndexOf('/', newUri.lastIndexOf('/') - 1));
      }
      if (!spec.resource && dataset) {
        const resource = dataset.resources.find(res => res.datastore_active);
        spec.resource = resource && resource.id;
      }
      this.setState({
        uri: newUri,
        validationPending: false,
        spec,
        currentDataset: dataset || null,
        isMounting: false
      });
    }, handleErrorResponse);
  }
  renderResourceSelect() {
    const {
      uri,
      currentDataset,
      spec
    } = this.state;
    const {
      name,
      readOnly,
      SelectComponent,
      TextFieldComponent
    } = this.props;
    const sharedProps = {
      title: _i18n.default._t('CKANResourceLocatorField.RESOURCE_NAME', 'Resource name'),
      extraClass: 'stacked'
    };
    if (readOnly || !currentDataset || !uri || !uri.length) {
      let value = '';
      if (spec && spec.resource && currentDataset) {
        const resource = currentDataset.resources.find(candidate => candidate.id === spec.resource);
        value = resource.name || resource.description || resource.id;
      }
      return _react.default.createElement(TextFieldComponent, _extends({}, sharedProps, {
        type: "text",
        disabled: true,
        value: value
      }));
    }
    const unavailableMessage = _i18n.default._t('CKANResourceLocatorField.INVALID_RESOURCE_SELECTION', 'Datastore is not available for the selected resource.');
    const resources = currentDataset.resources.map(resource => ({
      value: resource.id,
      title: resource.name || resource.description || null,
      disabled: !resource.datastore_active,
      description: !resource.datastore_active ? unavailableMessage : null
    }));
    let message = null;
    const selectedResource = resources.find(resource => resource.value === spec.resource);
    if (selectedResource && selectedResource.disabled) {
      message = {
        type: 'error',
        value: unavailableMessage
      };
    }
    return _react.default.createElement(SelectComponent, _extends({}, sharedProps, {
      message: message,
      className: {
        'is-invalid': message,
        'no-change-track': true
      },
      name: `${name}-resource-name`,
      source: resources,
      value: spec.resource,
      onChange: this.handleResourceSelect
    }));
  }
  renderHiddenInput() {
    const {
      spec,
      validationMessage
    } = this.state;
    const value = !spec || validationMessage ? '' : JSON.stringify(spec);
    const {
      readOnly
    } = this.props;
    if (readOnly) {
      return null;
    }
    return _react.default.createElement(_reactstrap.Input, {
      name: this.props.name,
      type: "hidden",
      value: value,
      innerRef: input => {
        this.valueInput = input;
      }
    });
  }
  renderUrlInput() {
    const {
      uri
    } = this.state;
    const {
      readOnly,
      TextFieldComponent,
      name
    } = this.props;
    const invalidMessage = this.getInvalidURLMessage();
    const invalid = !!invalidMessage;
    const inputProps = {
      name: `${name}-uri`,
      title: _i18n.default._t('CKANResourceLocatorField.DATA_SOURCE_URL', 'Data source URL'),
      className: (0, _classnames.default)('no-change-track', {
        'is-invalid': invalid
      }),
      message: invalidMessage,
      value: uri || '',
      readOnly,
      invalid,
      onChange: this.handleChange
    };
    return _react.default.createElement(TextFieldComponent, inputProps);
  }
  render() {
    const {
      validationPending
    } = this.state;
    const inputContainerClasses = (0, _classnames.default)('ckan-resource-locator__uri-input', {
      'ckan-resource-locator__uri-input--loading': validationPending
    });
    return _react.default.createElement("div", {
      className: "ckan-resource-locator"
    }, _react.default.createElement("div", {
      className: inputContainerClasses
    }, this.renderUrlInput()), _react.default.createElement("div", {
      className: "ckan-resource-locator__big-slash"
    }, "/"), _react.default.createElement("div", {
      className: "ckan-resource-locator__resource-select"
    }, this.renderResourceSelect()), this.renderHiddenInput());
  }
}
exports.Component = CKANResourceLocatorField;
CKANResourceLocatorField.propTypes = {
  name: _propTypes.default.string.isRequired,
  value: _propTypes.default.object,
  defaultEndpoint: _propTypes.default.string,
  SelectComponent: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func])
};
var _default = (0, _FieldHolder.default)((0, _Injector.inject)(['SingleSelectField', 'TextField'], (SelectComponent, TextFieldComponent) => ({
  SelectComponent,
  TextFieldComponent
}), () => 'CKAN.ResourceLocatorField')(CKANResourceLocatorField));
exports["default"] = _default;

/***/ }),

/***/ "./client/src/components/CKANResultConditionsField.js":
/*!************************************************************!*\
  !*** ./client/src/components/CKANResultConditionsField.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Component = void 0;
var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));
var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "prop-types"));
var _Injector = __webpack_require__(/*! lib/Injector */ "lib/Injector");
var _reactstrap = __webpack_require__(/*! reactstrap */ "reactstrap");
var _FieldHolder = _interopRequireDefault(__webpack_require__(/*! components/FieldHolder/FieldHolder */ "components/FieldHolder/FieldHolder"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
class CKANResultConditionsField extends _react.Component {
  constructor(props) {
    super(props);
    const value = props.value && props.value[0] ? props.value[0] : {
      'match-select': props.data.matchTypeDefault,
      'match-text': ''
    };
    this.state = {
      0: {
        [this.getFieldName('match-select', props)]: value['match-select'],
        [this.getFieldName('match-text', props)]: value['match-text']
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }
  getFieldName(fieldName) {
    let props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const name = props.name || this.props.name;
    return `${name}-${fieldName}`;
  }
  getSelectValue() {
    return `${this.state[0][this.getFieldName('match-select')]}`;
  }
  getInputValue() {
    return this.state[0][this.getFieldName('match-text')];
  }
  getValue() {
    return {
      0: {
        'match-select': this.getSelectValue(),
        'match-text': this.getInputValue()
      }
    };
  }
  handleChange(event) {
    const currentState = this.state;
    this.setState({
      0: {
        ...currentState[0],
        [event.target.name]: event.target.value
      }
    });
  }
  renderSelect() {
    const {
      SelectComponent,
      data: {
        source
      }
    } = this.props;
    return _react.default.createElement(SelectComponent, {
      className: ['no-change-track', 'ckan-result-conditions__match-select'],
      name: this.getFieldName('match-select'),
      source: source,
      value: this.getSelectValue(),
      onChange: this.handleChange
    });
  }
  renderTextInput() {
    const {
      TextFieldComponent
    } = this.props;
    return _react.default.createElement(TextFieldComponent, {
      name: this.getFieldName('match-text'),
      className: ['no-change-track', 'ckan-result-conditions__match-text'],
      onChange: this.handleChange,
      value: this.getInputValue()
    });
  }
  renderHiddenInput() {
    const {
      name
    } = this.props;
    const rawValue = this.getValue();
    const value = rawValue[0]['match-text'].length ? JSON.stringify(rawValue) : '';
    return _react.default.createElement("input", {
      type: "hidden",
      name: name,
      value: value
    });
  }
  renderReadOnly() {
    const {
      data: {
        source
      }
    } = this.props;
    const input = this.getInputValue();
    const type = source.find(candidate => `${candidate.value}` === this.getSelectValue());
    if (!type) {
      return null;
    }
    return _react.default.createElement("p", {
      className: "form-control-static readonly"
    }, type.title, ": ", input);
  }
  render() {
    if (this.props.readOnly) {
      return this.renderReadOnly();
    }
    return _react.default.createElement("div", {
      className: "ckan-result-conditions"
    }, _react.default.createElement(_reactstrap.Row, {
      form: true
    }, _react.default.createElement(_reactstrap.Col, {
      md: 4,
      className: "ckan-result-conditions__column-left"
    }, this.renderSelect()), _react.default.createElement(_reactstrap.Col, {
      md: 8,
      className: "ckan-result-conditions__column-right"
    }, this.renderTextInput())), this.renderHiddenInput());
  }
}
exports.Component = CKANResultConditionsField;
CKANResultConditionsField.propTypes = {
  name: _propTypes.default.string,
  value: _propTypes.default.object,
  data: _propTypes.default.shape({
    source: _propTypes.default.arrayOf(_propTypes.default.shape({
      value: _propTypes.default.string,
      title: _propTypes.default.string
    })),
    matchTypeDefault: _propTypes.default.string
  }),
  readOnly: _propTypes.default.bool,
  TextFieldComponent: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]).isRequired,
  SelectComponent: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]).isRequired
};
CKANResultConditionsField.defaultProps = {
  value: {},
  data: {},
  readOnly: false
};
var _default = (0, _FieldHolder.default)((0, _Injector.inject)(['SingleSelectField', 'TextField'], (SelectComponent, TextFieldComponent) => ({
  SelectComponent,
  TextFieldComponent
}), () => 'CKAN.Column.ResultConditionsField')(CKANResultConditionsField));
exports["default"] = _default;

/***/ }),

/***/ "./client/src/legacy/CKANPresentedOptionsField-entwine.js":
/*!****************************************************************!*\
  !*** ./client/src/legacy/CKANPresentedOptionsField-entwine.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "jquery"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _client = __webpack_require__(/*! react-dom/client */ "react-dom/client");
var _Injector = __webpack_require__(/*! lib/Injector */ "lib/Injector");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', $ => {
  $('.ckan-presented-options__container').entwine({
    FieldIDs: [],
    Mounted: false,
    ReactRoot: null,
    renderComponent() {
      let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      const context = {};
      const PresentedOptionsComponent = (0, _Injector.loadComponent)('CKANPresentedOptionsField', context);
      const schema = this.data('schema');
      const {
        data: {
          fieldMap
        }
      } = schema;
      const fields = this.getFieldIDs().map(id => fieldMap[id] || null);
      const {
        extraClass,
        ...forwardedProps
      } = schema;
      const props = {
        name: this.attr('name'),
        value: value ? JSON.parse(value) : undefined,
        selectedFields: fields,
        ...forwardedProps
      };
      let root = this.getReactRoot();
      if (!root) {
        root = (0, _client.createRoot)(this[0]);
        this.setReactRoot(root);
      }
      root.render(_react.default.createElement(PresentedOptionsComponent, props));
      this.setMounted(true);
    },
    setFields(fields) {
      if (!Array.isArray(fields)) {
        return;
      }
      this.setFieldIDs(fields);
      if (this.getMounted()) {
        this.renderComponent();
      }
    }
  });
  $('.js-injector-boot .ckan-presented-options__container').entwine({
    onmatch() {
      const temporaryInput = this.children('input:first');
      if (!temporaryInput.length) {
        return;
      }
      this.renderComponent(temporaryInput.val());
    },
    onunmatch() {
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
      this.setMounted(false);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/CKANResourceFilterForm-entwine.js":
/*!*************************************************************!*\
  !*** ./client/src/legacy/CKANResourceFilterForm-entwine.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "jquery"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', $ => {
  $('select.ckan-columns__filter-fields').entwine({
    onmatch() {
      if (this.val().length) {
        const presentedOptions = this.closest('form').find('.ckan-presented-options__container');
        presentedOptions.setFields(this.val());
      }
    },
    onchange() {
      const presentedOptions = this.closest('form').find('.ckan-presented-options__container');
      presentedOptions.setFields(this.val() || []);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/CKANResourceLocatorField-entwine.js":
/*!***************************************************************!*\
  !*** ./client/src/legacy/CKANResourceLocatorField-entwine.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "jquery"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _client = __webpack_require__(/*! react-dom/client */ "react-dom/client");
var _Injector = __webpack_require__(/*! lib/Injector */ "lib/Injector");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', $ => {
  $('.js-injector-boot .ckan-resource-locator__container').entwine({
    ReactRoot: null,
    onmatch() {
      const context = {};
      const CKANResourceLocatorField = (0, _Injector.loadComponent)('CKANResourceLocatorField', context);
      const schemaData = this.data('schema');
      const value = this.children('input:first').val();
      const props = {
        name: this.attr('name'),
        ...schemaData,
        defaultEndpoint: schemaData.defaultEndpoint || null,
        description: schemaData.description && schemaData.description.html || '',
        value: value ? JSON.parse(value) : undefined
      };
      let root = this.getReactRoot();
      if (!root) {
        root = (0, _client.createRoot)(this[0]);
        this.setReactRoot(root);
      }
      root.render(_react.default.createElement(CKANResourceLocatorField, props));
    },
    onunmatch() {
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/CKANResultConditionsField-entwine.js":
/*!****************************************************************!*\
  !*** ./client/src/legacy/CKANResultConditionsField-entwine.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "jquery"));
var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));
var _client = __webpack_require__(/*! react-dom/client */ "react-dom/client");
var _Injector = __webpack_require__(/*! lib/Injector */ "lib/Injector");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', $ => {
  $('.js-injector-boot .ckan-result-conditions__container').entwine({
    ReactRoot: null,
    onmatch() {
      const context = {};
      const CKANResultConditionsField = (0, _Injector.loadComponent)('CKANResultConditionsField', context);
      const temporaryInput = this.children('input:first');
      if (!temporaryInput.length) {
        return;
      }
      const value = temporaryInput.val();
      const props = {
        name: this.attr('name'),
        value: value ? JSON.parse(value) : undefined,
        ...this.data('schema')
      };
      let root = this.getReactRoot();
      if (!root) {
        root = (0, _client.createRoot)(this[0]);
        this.setReactRoot(root);
      }
      root.render(_react.default.createElement(CKANResultConditionsField, props));
    },
    onunmatch() {
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/GridFieldResourceTitle.js":
/*!*****************************************************!*\
  !*** ./client/src/legacy/GridFieldResourceTitle.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "jquery"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', $ => {
  $('.ckan-columns__edit-resource').entwine({
    onclick(e) {
      e.preventDefault();
      $('.ckan-resource-locator__container').toggleClass('hide');
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/ResourceFilter.js":
/*!*********************************************!*\
  !*** ./client/src/legacy/ResourceFilter.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jquery = _interopRequireDefault(__webpack_require__(/*! jquery */ "jquery"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_jquery.default.entwine('ss', $ => {
  $('.field.ckan-columns__filter-fields').entwine({
    onmatch() {
      const checkbox = this.prev('.ckan-columns__all-columns');
      if (checkbox.length) {
        checkbox.toggleSourcesField();
      }
    }
  });
  $('.form-check-input.ckan-columns__all-columns').entwine({
    onmatch() {
      this.toggleSourcesField();
    },
    onchange() {
      this.toggleSourcesField();
    },
    toggleSourcesField() {
      const sources = this.closest('.field').next('.ckan-columns__filter-fields');
      if (!sources.length) {
        return;
      }
      if (this.is(':checked')) {
        sources.hide();
      } else {
        sources.show();
      }
    }
  });
});

/***/ }),

/***/ "./client/src/lib/CKANApi.js":
/*!***********************************!*\
  !*** ./client/src/lib/CKANApi.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _isomorphicFetch = _interopRequireDefault(__webpack_require__(/*! isomorphic-fetch */ "isomorphic-fetch"));
var _DataStore = _interopRequireDefault(__webpack_require__(/*! lib/CKANApi/DataStore */ "./client/src/lib/CKANApi/DataStore.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const CKAN_VERSION = 3;
class CKANApi {
  static parseURI(uri) {
    if (typeof uri !== 'string' || !uri.length) {
      return false;
    }
    let preppedUri = uri;
    let protocol = 'https://';
    const protocolMatch = preppedUri.match(/^https?:\/\//);
    if (protocolMatch) {
      protocol = protocolMatch[0];
      preppedUri = preppedUri.substr(protocol.length);
    }
    if (preppedUri.endsWith('/')) {
      preppedUri = preppedUri.substring(0, preppedUri.length - 1);
    }
    const parts = preppedUri.split('/');
    if (parts.length >= 5) {
      parts.splice(0, parts.length - 4, parts.slice(0, parts.length - 4).join('/'));
      return {
        endpoint: `${protocol}${parts[0]}/`,
        dataset: parts[2],
        resource: parts[4]
      };
    }
    if (parts.length === 4) {
      parts.splice(0, 2, parts.slice(0, 2).join('/'));
    }
    if (parts.length === 3) {
      return {
        endpoint: `${protocol}${parts[0]}/`,
        dataset: parts[2],
        resource: null
      };
    }
    if (preppedUri.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)) {
      return {
        endpoint: null,
        dataset: null,
        resource: preppedUri
      };
    }
    if (protocolMatch) {
      return false;
    }
    if (preppedUri.match(/^[\d\w-]+$/i)) {
      return {
        endpoint: null,
        dataset: preppedUri,
        resource: null
      };
    }
    return false;
  }
  static generateURI(spec) {
    if (typeof spec !== 'object' || !spec.endpoint || !spec.dataset) {
      return false;
    }
    let {
      endpoint
    } = spec;
    try {
      new URL(endpoint);
    } catch (e) {
      return false;
    }
    if (endpoint.slice(-1) !== '/') {
      endpoint += '/';
    }
    const uri = `${endpoint}dataset/${spec.dataset}`;
    if (spec.resource) {
      return `${uri}/resource/${spec.resource}`;
    }
    return uri;
  }
  static loadDataset(endpoint, dataset) {
    return this.makeRequest(endpoint, 'package_show', {
      id: dataset
    }).then(response => response.json().then(json => {
      if (!json.success || !json.result) {
        return false;
      }
      const {
        result
      } = json;
      if (result.name !== dataset && result.id !== dataset) {
        return false;
      }
      return result;
    }), () => Promise.resolve(false));
  }
  static loadResource(endpoint, resource) {
    return this.makeRequest(endpoint, 'resource_show', {
      id: resource
    }).then(response => response.json().then(json => {
      if (!json.success) {
        return false;
      }
      return json.result;
    }), () => Promise.resolve(false));
  }
  static validateEndpoint(endpoint) {
    return this.makeRequest(endpoint, 'site_read').then(response => {
      if (!response.ok) {
        return Promise.resolve(false);
      }
      return response.json().then(json => json && json.success);
    }, () => Promise.resolve(false));
  }
  static loadDatastore(endpoint, resource) {
    return new _DataStore.default(endpoint, resource);
  }
  static makeRequest(endpoint, action, requestVars) {
    let url = `${endpoint}api/${CKAN_VERSION}/action/${action}`;
    if (requestVars && Object.values(requestVars).length) {
      const queryString = Object.entries(requestVars).map(_ref => {
        let [key, value] = _ref;
        return `${key}=${encodeURIComponent(value)}`;
      }).join('&');
      url += `?${queryString}`;
    }
    return (0, _isomorphicFetch.default)(url);
  }
}
var _default = CKANApi;
exports["default"] = _default;

/***/ }),

/***/ "./client/src/lib/CKANApi/DataStore.js":
/*!*********************************************!*\
  !*** ./client/src/lib/CKANApi/DataStore.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _CKANApi = _interopRequireDefault(__webpack_require__(/*! lib/CKANApi */ "./client/src/lib/CKANApi.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class _default {
  constructor(endpoint, resource) {
    this.endpoint = endpoint;
    this.resource = resource;
  }
  search(fields) {
    let term = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let distinct = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
    let offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    let sort = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    if (!Array.isArray(fields) || !fields.length) {
      return Promise.reject(false);
    }
    const options = {
      id: this.resource,
      fields: fields.join(','),
      include_total: true
    };
    const termType = term === null ? null : typeof term;
    if (term !== null && termType !== 'string' && termType !== 'object') {
      return Promise.resolve(false);
    }
    if (termType === 'string' && term.length) {
      options.q = term;
    } else if (termType === 'object') {
      const terms = Object.entries(term);
      if (terms.length) {
        options.filters = JSON.stringify(term);
      }
    }
    if (distinct) {
      options.distinct = true;
    }
    options.limit = limit;
    options.offset = offset;
    if (sort) {
      const {
        sortField,
        sortAscending
      } = sort;
      options.sort = `${sortField} ${sortAscending ? 'ASC' : 'DESC'}`;
    }
    return _CKANApi.default.makeRequest(this.endpoint, 'datastore_search', options).then(this.handleResponse);
  }
  searchSql(query) {
    return _CKANApi.default.makeRequest(this.endpoint, 'datastore_search_sql', {
      sql: query.parse(this.resource)
    }).then(this.handleResponse);
  }
  countSql(query) {
    return _CKANApi.default.makeRequest(this.endpoint, 'datastore_search_sql', {
      sql: query.parseCount(this.resource)
    }).then(response => response.json().then(result => {
      if (!result.success) {
        return false;
      }
      return result.result.records[0].count;
    }));
  }
  handleResponse(response) {
    return response.json().then(result => {
      if (!result.success) {
        return false;
      }
      return {
        records: result.result.records,
        total: result.result.total
      };
    });
  }
}
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/lodash/_Symbol.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "./node_modules/lodash/_baseGetTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "./node_modules/lodash/_baseTrim.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseTrim.js ***!
  \******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var trimmedEndIndex = __webpack_require__(/*! ./_trimmedEndIndex */ "./node_modules/lodash/_trimmedEndIndex.js");

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

module.exports = baseTrim;


/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ "./node_modules/lodash/_getRawTag.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "./node_modules/lodash/_objectToString.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
/***/ (function(module) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "./node_modules/lodash/_root.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "./node_modules/lodash/_trimmedEndIndex.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_trimmedEndIndex.js ***!
  \*************************************************/
/***/ (function(module) {

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

module.exports = trimmedEndIndex;


/***/ }),

/***/ "./node_modules/lodash/debounce.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/debounce.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    now = __webpack_require__(/*! ./now */ "./node_modules/lodash/now.js"),
    toNumber = __webpack_require__(/*! ./toNumber */ "./node_modules/lodash/toNumber.js");

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ }),

/***/ "./node_modules/lodash/isObject.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
/***/ (function(module) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ "./node_modules/lodash/isObjectLike.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isObjectLike.js ***!
  \*********************************************/
/***/ (function(module) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ "./node_modules/lodash/isSymbol.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isSymbol.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ "./node_modules/lodash/now.js":
/*!************************************!*\
  !*** ./node_modules/lodash/now.js ***!
  \************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ }),

/***/ "./node_modules/lodash/toNumber.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/toNumber.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseTrim = __webpack_require__(/*! ./_baseTrim */ "./node_modules/lodash/_baseTrim.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),

/***/ "components/FieldHolder/FieldHolder":
/*!******************************!*\
  !*** external "FieldHolder" ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = FieldHolder;

/***/ }),

/***/ "lib/Injector":
/*!***************************!*\
  !*** external "Injector" ***!
  \***************************/
/***/ (function(module) {

"use strict";
module.exports = Injector;

/***/ }),

/***/ "isomorphic-fetch":
/*!**********************************!*\
  !*** external "IsomorphicFetch" ***!
  \**********************************/
/***/ (function(module) {

"use strict";
module.exports = IsomorphicFetch;

/***/ }),

/***/ "prop-types":
/*!****************************!*\
  !*** external "PropTypes" ***!
  \****************************/
/***/ (function(module) {

"use strict";
module.exports = PropTypes;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ (function(module) {

"use strict";
module.exports = React;

/***/ }),

/***/ "react-dom/client":
/*!*********************************!*\
  !*** external "ReactDomClient" ***!
  \*********************************/
/***/ (function(module) {

"use strict";
module.exports = ReactDomClient;

/***/ }),

/***/ "reactstrap":
/*!*****************************!*\
  !*** external "Reactstrap" ***!
  \*****************************/
/***/ (function(module) {

"use strict";
module.exports = Reactstrap;

/***/ }),

/***/ "classnames":
/*!*****************************!*\
  !*** external "classnames" ***!
  \*****************************/
/***/ (function(module) {

"use strict";
module.exports = classnames;

/***/ }),

/***/ "i18n":
/*!***********************!*\
  !*** external "i18n" ***!
  \***********************/
/***/ (function(module) {

"use strict";
module.exports = i18n;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ (function(module) {

"use strict";
module.exports = jQuery;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!********************************************!*\
  !*** ./client/src/bundles/bundle-admin.js ***!
  \********************************************/


__webpack_require__(/*! legacy/CKANResourceLocatorField-entwine */ "./client/src/legacy/CKANResourceLocatorField-entwine.js");
__webpack_require__(/*! legacy/CKANPresentedOptionsField-entwine */ "./client/src/legacy/CKANPresentedOptionsField-entwine.js");
__webpack_require__(/*! legacy/CKANResultConditionsField-entwine */ "./client/src/legacy/CKANResultConditionsField-entwine.js");
__webpack_require__(/*! legacy/CKANResourceFilterForm-entwine */ "./client/src/legacy/CKANResourceFilterForm-entwine.js");
__webpack_require__(/*! legacy/GridFieldResourceTitle */ "./client/src/legacy/GridFieldResourceTitle.js");
__webpack_require__(/*! legacy/ResourceFilter */ "./client/src/legacy/ResourceFilter.js");
__webpack_require__(/*! boot */ "./client/src/boot/index.js");
}();
/******/ })()
;
//# sourceMappingURL=bundle-admin.js.map