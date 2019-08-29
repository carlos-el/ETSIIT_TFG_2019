"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

//*************************************************
//*************************************************
//General usage functions
function getCurrentTreeZoom() {
  var style = window.getComputedStyle(document.getElementById('tree-wrapper'));
  var transform = style.getPropertyValue('transform');
  return parseFloat(transform.substr(7, 3));
}

function isValidEmail(email) {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (email.match(mailformat) && email.length < 254 || email === '') {
    return true;
  } else {
    return false;
  }
}

function isValidDate(year, month, day) {
  if (year === '' && month === '' && day === '') {
    return true;
  }

  if (!(year !== '' && month !== '' && day !== '')) {
    return false;
  }

  var d = parseInt(day);
  var m = parseInt(month);
  if (m > 12 || m < 1 || m === 2 && d > 29 || d < 1 || d > 31) return false;
  return true;
}

function errorsInDataForModal(email, birth_year, birth_month, birth_day, death_year, death_month, death_day, name, surname, notes) {
  var error_messages = [];
  if (!isValidEmail(email)) error_messages.push("Dirección de email no válida.");
  if (!isValidDate(birth_year, birth_month, birth_day)) error_messages.push("Fecha de nacimiento no válida.");
  if (!isValidDate(death_year, death_month, death_day)) error_messages.push("Fecha de defunción no válida.");
  if (name.length > 15) error_messages.push("Nombre demasiado largo.");
  if (surname.length > 30) error_messages.push("Apellidos demasiado largos.");
  if (notes.length > 299) error_messages.push("La información sobrepasa la longitud permitida.");

  if (isValidDate(birth_year, birth_month, birth_day) && isValidDate(death_year, death_month, death_day) && birth_year + birth_month + birth_day !== "" && death_year + death_month + death_day !== "") {
    if (birth_year > death_year || birth_year == death_year && birth_month > death_month || birth_year == death_year && birth_month == death_month && birth_day > death_day) {
      error_messages.push("La fecha de nacimiento debe ser anterior a la de defunción.");
    }
  }

  return error_messages;
}

function dragElement(idElementMovable, idElementToDragForMoving) {
  var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
  var elmnt = document.getElementById(idElementMovable);
  var dragger = document.getElementById(idElementToDragForMoving);

  if (document.getElementById(idElementToDragForMoving)) {
    /* if present, the dragger is where you move the DIV from:*/
    dragger.onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault(); // get the mouse cursor position at startup:

    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement; // call a function whenever the cursor moves:

    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault(); // calculate the new cursor position:

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY; // set the element's new position:

    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function download(canvas, filename) {
  /* Canvas Donwload */
  /// create an "off-screen" anchor tag
  var lnk = document.createElement('a'),
      e; /// the key here is to set the download attribute of the a tag

  lnk.download = filename; /// convert canvas content to data-uri for link. When download
  /// attribute is set the content pointed to by link will be
  /// pushed as "download" in HTML5 capable browsers

  lnk.href = canvas.toDataURL("image/png;base64"); /// create a "fake" click-event to trigger the download

  if (document.createEvent) {
    e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    lnk.dispatchEvent(e);
  } else if (lnk.fireEvent) {
    lnk.fireEvent("onclick");
  }
}

function getCookie(name) {
  var cookieValue = null;

  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim(); // Does this cookie string begin with the name we want?

      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
} //*************************************************
//*************************************************


var LoadingCircle =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LoadingCircle, _React$Component);

  function LoadingCircle() {
    _classCallCheck(this, LoadingCircle);

    return _possibleConstructorReturn(this, _getPrototypeOf(LoadingCircle).apply(this, arguments));
  }

  _createClass(LoadingCircle, [{
    key: "render",
    value: function render() {
      var showHideClassName = this.props.show ? 'loading-screen display-block' : 'loading-screen display-none';
      var animateClassName = this.props.show ? 'loading-icon loading-icon-animation' : 'loading-icon';
      return React.createElement("div", {
        className: showHideClassName
      }, React.createElement("img", {
        className: animateClassName,
        src: "/static/images/loading_icon.png",
        alt: ""
      }));
    }
  }]);

  return LoadingCircle;
}(React.Component);

var EditorMenu =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(EditorMenu, _React$Component2);

  function EditorMenu() {
    _classCallCheck(this, EditorMenu);

    return _possibleConstructorReturn(this, _getPrototypeOf(EditorMenu).apply(this, arguments));
  }

  _createClass(EditorMenu, [{
    key: "render",
    value: function render() {
      var _this = this;

      var style = this.props.show ? {
        display: 'inline-block'
      } : {
        display: 'none'
      };
      var map_gender = {
        'O': 'Otro',
        'U': 'Desconocido',
        'M': 'Masculino',
        'F': 'Femenino'
      };
      return React.createElement("div", {
        className: "editor-menu-container"
      }, React.createElement("div", {
        className: "editor-menu",
        style: style
      }, !this.props.data ? React.createElement("p", null, "Usa el bot\xF3n de informaci\xF3n de una persona del \xE1rbol para ver sus datos.") : React.createElement("div", null, React.createElement("img", {
        src: '/static/person_photos/' + this.props.data.img_path,
        alt: ""
      }), React.createElement("b", null, this.props.data.name), React.createElement("br", null), React.createElement("b", null, this.props.data.surname), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement("p", null, React.createElement("b", null, "G\xE9nero: "), map_gender[this.props.data.gender]), React.createElement("p", null, React.createElement("b", null, "Fecha de nacimiento: "), this.props.data.birth.day && this.props.data.birth.month && this.props.data.birth.year ? this.props.data.birth.day + '/' + this.props.data.birth.month + '/' + this.props.data.birth.year : 'Desconocida'), this.props.data.death.day && this.props.data.death.month && this.props.data.death.year ? React.createElement("p", null, React.createElement("b", null, "Fecha de defuncion: "), this.props.data.death.day, "/", this.props.data.death.month, "/", this.props.data.death.year) : '', React.createElement("p", null, React.createElement("b", null, "Email: "), this.props.data.email ? this.props.data.email : 'Desconocido'), React.createElement("p", null, React.createElement("b", null, "M\xE1s informaci\xF3n: "), this.props.data.notes ? this.props.data.notes : 'No especificada.'), React.createElement("p", null, React.createElement("b", null, "Propietario del registro: "), this.props.data.creator), React.createElement("br", null), React.createElement("a", {
        href: 'http://localhost:8000/person/' + this.props.data.id
      }, React.createElement("button", null, "Ir a la lista de parientes de esta persona")))), React.createElement("div", {
        onClick: function onClick() {
          return _this.props.handleHideInfo();
        },
        className: "editor-menu-display"
      }, React.createElement("span", {
        id: "editor-menu-display-arrow"
      }, "\u21D4")));
    }
  }]);

  return EditorMenu;
}(React.Component);

var ModalAdd =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(ModalAdd, _React$Component3);

  function ModalAdd(props) {
    var _this2;

    _classCallCheck(this, ModalAdd);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ModalAdd).call(this, props));
    _this2.state = {
      relative: 'P',
      gender: 'U',
      name: '',
      surname: '',
      email: '',
      birth_day: '',
      birth_month: '',
      birth_year: '',
      death_day: '',
      death_month: '',
      death_year: '',
      notes: '',
      img_path: '',
      img_blob: null,
      relative_id: 0,
      relative_name: '',
      relative_couple_id: '',
      num_parents: 0,
      form_error: []
    };
    _this2.handleChange = _this2.handleChange.bind(_assertThisInitialized(_this2));
    _this2.handleSubmit = _this2.handleSubmit.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(ModalAdd, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      this.setState({
        relative: 'P',
        gender: 'U',
        name: '',
        surname: '',
        email: '',
        birth_day: '',
        birth_month: '',
        birth_year: '',
        death_day: '',
        death_month: '',
        death_year: '',
        notes: '',
        img_path: '',
        img_blob: null,
        form_error: []
      });
      if (nextProps.data !== null) this.setState({
        relative_id: nextProps.data.id,
        relative_name: nextProps.data.name,
        relative_couple_id: nextProps.data.couple_id,
        num_parents: nextProps.data.num_parents,
        relative: nextProps.data.num_parents >= 2 ? 'S' : 'P'
      });
    }
    /*static getDerivedStateFromProps(nextProps, prevState){
        let state = {
                relative: 'P', gender: 'U', name: '', surname: '', email: '',
                birth_day: '', birth_month: '', birth_year: '',
                death_day: '', death_month: '', death_year: '',
                notes: '', img_path: '', img_blob: null,
                form_error: []
        }
         if (nextProps.data !== null){
            state = {
                gender: 'U', name: '', surname: '', email: '',
                birth_day: '', birth_month: '', birth_year: '',
                death_day: '', death_month: '', death_year: '',
                notes: '', img_path: '', img_blob: null,
                form_error: [],
                 relative_id: nextProps.data.id,
                relative_name: nextProps.data.name,
                relative_couple_id: nextProps.data.couple_id,
                 num_parents: nextProps.data.num_parents,
                relative: ((nextProps.data.num_parents >=2) ? ('S') : ('P'))
            }
        }
         return state;
    }*/

  }, {
    key: "handleChange",
    value: function handleChange(event) {
      if (event.target.name === 'img_path') {
        var _this$setState;

        this.setState((_this$setState = {}, _defineProperty(_this$setState, event.target.name, event.target.value), _defineProperty(_this$setState, "img_blob", event.target.files[0]), _this$setState));
      } else {
        this.setState(_defineProperty({}, event.target.name, event.target.value));
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      var body = {
        relative_type: this.state.relative,
        gender: this.state.gender,
        name: this.state.name,
        surname: this.state.surname,
        email: this.state.email,
        notes: this.state.notes,
        birth: {
          day: this.state.birth_day,
          month: this.state.birth_month,
          year: this.state.birth_year
        },
        death: {
          day: this.state.death_day,
          month: this.state.death_month,
          year: this.state.death_year
        },
        relative_id: this.state.relative_id,
        relative_couple_id: this.state.relative_couple_id,
        timestamp: this.props.data.timestamp
      };
      var error_messages = errorsInDataForModal(this.state.email, this.state.birth_year, this.state.birth_month, this.state.birth_day, this.state.death_year, this.state.death_month, this.state.death_day, this.state.name, this.state.surname, this.state.notes);

      if (error_messages.length > 0) {
        this.setState({
          form_error: error_messages
        });
        return false;
      }

      this.props.handleHideModal();
      this.props.handleFetchData({
        method: 'POST',
        request_body: body,
        img_blob: this.state.img_blob
      });
    }
  }, {
    key: "render",
    value: function render() {
      var showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      return React.createElement("div", {
        className: showHideClassName
      }, React.createElement("div", {
        className: "modal-main"
      }, React.createElement("img", {
        onClick: this.props.handleHideModal,
        src: "/static/images/closewindow_icon.png",
        className: "close-button",
        alt: ""
      }), React.createElement("p", {
        style: {
          fontSize: "x-large"
        }
      }, this.state.relative_id == 0 ? 'Añadir nueva persona' : React.createElement("span", null, "A\xF1adir pariente de ", this.state.relative_name), "."), React.createElement("label", {
        className: this.state.relative_id == 0 ? 'display-none' : ''
      }, "Parentesco: ", React.createElement("br", null), React.createElement("select", {
        name: "relative",
        value: this.state.relative,
        onChange: this.handleChange
      }, "/*TODO comprobar que se puede a\xF1adir un progenitor*/", this.state.num_parents < 2 ? React.createElement("option", {
        value: "P"
      }, "Progenitor") : null, React.createElement("option", {
        value: "S"
      }, "Hermano"), React.createElement("option", {
        value: "C"
      }, "Hijo"), React.createElement("option", {
        value: "U"
      }, "Pareja"))), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "Genero: ", React.createElement("br", null), React.createElement("select", {
        name: "gender",
        value: this.state.gender,
        onChange: this.handleChange
      }, React.createElement("option", {
        value: "M"
      }, "Masculino"), React.createElement("option", {
        value: "F"
      }, "Femenino"), React.createElement("option", {
        value: "O"
      }, "Otro"), React.createElement("option", {
        value: "U"
      }, "Desconocido"))), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "Nombre: ", React.createElement("br", null), React.createElement("input", {
        name: "name",
        type: "text",
        value: this.state.name,
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "Apellidos: ", React.createElement("br", null), React.createElement("input", {
        name: "surname",
        type: "text",
        value: this.state.surname,
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "E-mail: ", React.createElement("br", null), React.createElement("input", {
        name: "email",
        type: "email",
        value: this.state.email,
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "M\xE1s informaci\xF3n: ", React.createElement("br", null), React.createElement("textarea", {
        name: "notes",
        cols: "66",
        value: this.state.notes,
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "Fecha de nacimiento: (dd/mm/aaaa)", React.createElement("br", null), React.createElement("input", {
        name: "birth_day",
        type: "number",
        value: this.state.birth_day,
        onChange: this.handleChange
      })), React.createElement("label", null, React.createElement("input", {
        name: "birth_month",
        type: "number",
        value: this.state.birth_month,
        onChange: this.handleChange
      })), React.createElement("label", null, React.createElement("input", {
        name: "birth_year",
        type: "number",
        value: this.state.birth_year,
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "Fecha de defuncion, si procede: (dd/mm/aaaa)", React.createElement("br", null), React.createElement("input", {
        name: "death_day",
        type: "number",
        value: this.state.death_day,
        onChange: this.handleChange
      })), React.createElement("label", null, React.createElement("input", {
        name: "death_month",
        type: "number",
        value: this.state.death_month,
        onChange: this.handleChange
      })), React.createElement("label", null, React.createElement("input", {
        name: "death_year",
        type: "number",
        value: this.state.death_year,
        onChange: this.handleChange
      })), React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "Agregar fotograf\xEDa: (.png/.jpg/.jpeg)", React.createElement("br", null), React.createElement("input", {
        name: "img_path",
        type: "file",
        value: this.state.img_path,
        accept: "image/png, image/jpeg",
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("p", {
        style: {
          color: "red"
        }
      }, this.state.form_error.map(function (error, index) {
        return React.createElement("span", {
          key: index
        }, React.createElement("br", null), error);
      })), React.createElement("button", {
        className: "standard-button",
        onClick: this.handleSubmit
      }, "Aceptar")));
    }
  }]);

  return ModalAdd;
}(React.Component);

var ModalEdit =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(ModalEdit, _React$Component4);

  function ModalEdit(props) {
    var _this3;

    _classCallCheck(this, ModalEdit);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(ModalEdit).call(this, props));
    _this3.state = {
      id: 0,
      gender: 'U',
      name: '',
      surname: '',
      email: '',
      birth_day: '',
      birth_month: '',
      birth_year: '',
      death_day: '',
      death_month: '',
      death_year: '',
      notes: '',
      img_path: '',
      img_blob: null,
      perm: '',
      type_perm: 'assign',
      form_error: []
    };
    _this3.handleChange = _this3.handleChange.bind(_assertThisInitialized(_this3));
    _this3.handleSubmit = _this3.handleSubmit.bind(_assertThisInitialized(_this3));
    _this3.handleDelete = _this3.handleDelete.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(ModalEdit, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.data !== null) {
        this.setState({
          id: nextProps.data.id,
          gender: nextProps.data.gender,
          name: nextProps.data.name,
          surname: nextProps.data.surname,
          email: nextProps.data.email,
          birth_day: nextProps.data.birth.day,
          birth_month: nextProps.data.birth.month,
          birth_year: nextProps.data.birth.year,
          death_day: nextProps.data.death.day,
          death_month: nextProps.data.death.month,
          death_year: nextProps.data.death.year,
          notes: nextProps.data.notes,
          img_path: '',
          img_blob: null,
          perm: '',
          type_perm: 'assign',
          form_error: []
        });
      }
    }
  }, {
    key: "handleChange",
    value: function handleChange(event) {
      if (event.target.name === 'img_path') {
        var _this$setState3;

        this.setState((_this$setState3 = {}, _defineProperty(_this$setState3, event.target.name, event.target.value), _defineProperty(_this$setState3, "img_blob", event.target.files[0]), _this$setState3));
      } else {
        this.setState(_defineProperty({}, event.target.name, event.target.value));
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      var body = {
        id: this.state.id,
        gender: this.state.gender,
        name: this.state.name,
        surname: this.state.surname,
        email: this.state.email,
        notes: this.state.notes,
        birth: {
          day: this.state.birth_day,
          month: this.state.birth_month,
          year: this.state.birth_year
        },
        death: {
          day: this.state.death_day,
          month: this.state.death_month,
          year: this.state.death_year
        },
        perm: this.state.perm,
        type_perm: this.state.type_perm,
        timestamp: this.props.data.timestamp
      };
      var error_messages = errorsInDataForModal(this.state.email, this.state.birth_year, this.state.birth_month, this.state.birth_day, this.state.death_year, this.state.death_month, this.state.death_day, this.state.name, this.state.surname, this.state.notes);

      if (error_messages.length > 0) {
        this.setState({
          form_error: error_messages
        });
        return false;
      }

      this.props.handleHideModal();
      this.props.handleFetchData({
        method: 'PUT',
        person_id: this.state.id,
        request_body: body,
        img_blob: this.state.img_blob
      });
    }
  }, {
    key: "handleDelete",
    value: function handleDelete() {
      this.props.handleHideModal();
      this.props.handleFetchData({
        method: 'DELETE',
        person_id: this.state.id
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      return React.createElement("div", {
        className: showHideClassName
      }, React.createElement("div", {
        className: "modal-main"
      }, React.createElement("img", {
        onClick: this.props.handleHideModal,
        src: "/static/images/closewindow_icon.png",
        className: "close-button",
        alt: ""
      }), React.createElement("p", {
        style: {
          fontSize: "x-large"
        }
      }, "Editar la informacion de ", this.state.name), React.createElement("label", null, "Genero: ", React.createElement("br", null), React.createElement("select", {
        name: "gender",
        value: this.state.gender,
        onChange: this.handleChange
      }, React.createElement("option", {
        value: "M"
      }, "Masculino"), React.createElement("option", {
        value: "F"
      }, "Femenino"), React.createElement("option", {
        value: "O"
      }, "Otro"), React.createElement("option", {
        value: "U"
      }, "Desconocido"))), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "Nombre: ", React.createElement("br", null), React.createElement("input", {
        name: "name",
        type: "text",
        value: this.state.name,
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "Apellidos: ", React.createElement("br", null), React.createElement("input", {
        name: "surname",
        type: "text",
        value: this.state.surname,
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "E-mail: ", React.createElement("br", null), React.createElement("input", {
        name: "email",
        type: "email",
        value: this.state.email,
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "M\xE1s informaci\xF3n: ", React.createElement("br", null), React.createElement("textarea", {
        name: "notes",
        cols: "66",
        value: this.state.notes,
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "Fecha de nacimiento: (dd/mm/aaaa)", React.createElement("br", null), React.createElement("input", {
        name: "birth_day",
        type: "number",
        value: this.state.birth_day,
        onChange: this.handleChange
      })), React.createElement("label", null, React.createElement("input", {
        name: "birth_month",
        type: "number",
        value: this.state.birth_month,
        onChange: this.handleChange
      })), React.createElement("label", null, React.createElement("input", {
        name: "birth_year",
        type: "number",
        value: this.state.birth_year,
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "Fecha de defuncion, si procede: (dd/mm/aaaa)", React.createElement("br", null), React.createElement("input", {
        name: "death_day",
        type: "number",
        value: this.state.death_day,
        onChange: this.handleChange
      })), React.createElement("label", null, React.createElement("input", {
        name: "death_month",
        type: "number",
        value: this.state.death_month,
        onChange: this.handleChange
      })), React.createElement("label", null, React.createElement("input", {
        name: "death_year",
        type: "number",
        value: this.state.death_year,
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, "Agregar nueva fotograf\xEDa: ", React.createElement("br", null), React.createElement("input", {
        name: "img_path",
        type: "file",
        value: this.state.img_path,
        accept: "image/png, image/jpeg",
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("br", null), React.createElement("label", null, React.createElement("select", {
        name: "type_perm",
        value: this.state.type_perm,
        onChange: this.handleChange
      }, React.createElement("option", {
        value: "assign"
      }, "Asignar"), React.createElement("option", {
        value: "remove"
      }, "Quitar")), "\xA0permisos sobre el registro a usuarios: ", React.createElement("br", null), React.createElement("input", {
        name: "perm",
        type: "text",
        value: this.state.perm,
        onChange: this.handleChange
      })), " ", React.createElement("br", null), React.createElement("p", {
        style: {
          color: "red"
        }
      }, this.state.form_error.map(function (error, index) {
        return React.createElement("span", {
          key: index
        }, React.createElement("br", null), error);
      })), React.createElement("button", {
        className: "standard-button",
        onClick: this.handleSubmit
      }, "Aceptar cambios"), React.createElement("button", {
        className: "standard-button",
        style: {
          float: "right",
          backgroundColor: "red",
          borderColor: "darkred"
        },
        onClick: function onClick() {
          if (window.confirm('¿Estas seguro de que deseas borrar a esta persona de tu árbol?')) _this4.handleDelete();
        }
      }, "Borrar persona")));
    }
  }]);

  return ModalEdit;
}(React.Component);

var NodeRoot =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(NodeRoot, _React$Component5);

  function NodeRoot() {
    _classCallCheck(this, NodeRoot);

    return _possibleConstructorReturn(this, _getPrototypeOf(NodeRoot).apply(this, arguments));
  }

  _createClass(NodeRoot, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.createToCoupleLines();
      this.createToTreesLines();
    }
  }, {
    key: "createToCoupleLines",
    value: function createToCoupleLines() {
      var data = this.props.data['down'] === null ? this.props.data['up'] : this.props.data['down'];

      if (data.couple_selected != null) {
        var c = document.getElementById("canvas");
        var cPos = $('#canvas').offset();
        var nPos = $('#' + data.id).offset();
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
        ctx.lineTo(nPos.left + 270 - cPos.left, nPos.top + 40 - cPos.top);
        ctx.stroke();
      }
    }
  }, {
    key: "createToTreesLines",
    value: function createToTreesLines() {
      var c = document.getElementById("canvas");
      var cPos = $('#canvas').offset();
      var nPos;
      if (this.props.data['up'] != null) nPos = $('#' + this.props.data['up'].id).offset();else nPos = $('#' + this.props.data['down'].id).offset();
      var ctx = c.getContext("2d");
      ctx.beginPath();

      if (!(this.props.data['up'] == null || this.props.data['up'].childs.length == 0)) {
        if (this.props.data['up'].couple_selected == null) {
          ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
          ctx.lineTo(nPos.left + 85 - cPos.left, nPos.top + -15 - cPos.top);
        } else {
          ctx.moveTo(nPos.left + 177.5 - cPos.left, nPos.top + 40 - cPos.top);
          ctx.lineTo(nPos.left + 177.5 - cPos.left, nPos.top + -15 - cPos.top);
        }
      }

      if (!(this.props.data['down'] == null || this.props.data['down'].childs.length == 0)) {
        if (this.props.data['down'].couple_selected == null) {
          ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
          ctx.lineTo(nPos.left + 85 - cPos.left, nPos.top + 95 - cPos.top);
        } else {
          ctx.moveTo(nPos.left + 177.5 - cPos.left, nPos.top + 40 - cPos.top);
          ctx.lineTo(nPos.left + 177.5 - cPos.left, nPos.top + 95 - cPos.top);
        }
      }

      ctx.stroke();
    }
  }, {
    key: "computeNewCoupleIdAsString",
    value: function computeNewCoupleIdAsString(data) {
      var result = data.other_couples.find(function (value) {
        return value.id > (data.couple_selected == null ? null : data.couple_selected.id);
      });
      if (result === undefined) return '0';
      return result.id.toString();
    }
  }, {
    key: "createCouple",
    value: function createCouple(data) {
      var _this5 = this;

      if (data.couple_selected == null) {
        return null;
      } else {
        var dataForEdit = {
          id: data.couple_selected.id,
          gender: data.couple_selected.gender,
          name: data.couple_selected.name,
          surname: data.couple_selected.surname,
          email: data.couple_selected.email,
          notes: data.couple_selected.notes,
          birth: data.couple_selected.birth,
          death: data.couple_selected.death,
          timestamp: data.couple_selected.timestamp
        };
        var dataForAdd = {
          id: data.couple_selected.id,
          couple_id: data.id,
          name: data.couple_selected.name,
          num_parents: data.couple_selected.num_parents,
          timestamp: data.couple_selected.timestamp
        };
        dataForEdit.img_path = data.couple_selected.img_path;
        dataForEdit.creator = data.couple_selected.creator;
        var dataForInfo = dataForEdit;
        return React.createElement("div", {
          className: "node node-root"
        }, React.createElement("img", {
          className: "person_photo",
          src: '/static/person_photos/' + data.couple_selected.img_path,
          onClick: function onClick() {
            return _this5.props.handleFetchData({
              method: 'GET',
              person_id: data.couple_selected.id
            });
          },
          alt: ""
        }), React.createElement("div", {
          className: "content"
        }, data.couple_selected.name + " " + data.couple_selected.surname, React.createElement("span", {
          className: "node-date"
        }, (data.couple_selected.birth.year == '' ? 'Desc' : data.couple_selected.birth.year) + " ‒ " + (data.couple_selected.death.year == '' ? 'Desc' : data.couple_selected.death.year))), React.createElement("img", {
          className: "icon_img edit_icon",
          onClick: function onClick() {
            return _this5.props.handleShowModalEdit(dataForEdit);
          },
          src: "/static/images/edit_icon.png",
          "data-html2canvas-ignore": "true"
        }), React.createElement("img", {
          className: "icon_img add_icon",
          onClick: function onClick() {
            return _this5.props.handleShowModalAdd(dataForAdd);
          },
          src: "/static/images/add_icon.png",
          "data-html2canvas-ignore": "true"
        }), React.createElement("img", {
          className: "icon_img info_icon",
          onClick: function onClick() {
            return _this5.props.handleShowInfo(dataForInfo);
          },
          src: "/static/images/info_icon.png",
          "data-html2canvas-ignore": "true"
        }));
      }
    }
  }, {
    key: "createChildsUp",
    value: function createChildsUp() {
      var _this6 = this;

      if (this.props.data['up'] !== null && this.props.data['up'].childs.length > 0) {
        var addPreGhost = false;
        var addPostGhost = false;

        if (this.props.data['up'].childs.length == 1) {
          if (this.props.data['up'].num_parents > 0) {
            addPostGhost = true;
          } else {
            addPreGhost = true;
          }
        }

        return React.createElement("table", {
          className: "upper"
        }, React.createElement("tbody", null, React.createElement("tr", null, !addPreGhost ? null : React.createElement("td", null, React.createElement("div", {
          className: "node visibility-hidden"
        })), this.props.data['up'].childs.map(function (child_data, index) {
          return React.createElement(NodeUp, {
            key: child_data.id,
            data: child_data,
            handleShowModalAdd: _this6.props.handleShowModalAdd,
            handleShowModalEdit: _this6.props.handleShowModalEdit,
            handleShowInfo: _this6.props.handleShowInfo,
            handleFetchData: _this6.props.handleFetchData
          });
        }), !addPostGhost ? null : React.createElement("td", null, React.createElement("div", {
          className: "node visibility-hidden"
        })))));
      }
    }
  }, {
    key: "createChildsDown",
    value: function createChildsDown() {
      var _this7 = this;

      if (this.props.data['down'] !== null) {
        return React.createElement("table", null, React.createElement("tbody", null, React.createElement("tr", null, this.props.data['down'].childs.map(function (child_data, index) {
          return React.createElement(NodeDown, {
            key: child_data.id,
            data: child_data,
            handleShowModalAdd: _this7.props.handleShowModalAdd,
            handleShowModalEdit: _this7.props.handleShowModalEdit,
            handleShowInfo: _this7.props.handleShowInfo,
            handleFetchData: _this7.props.handleFetchData
          });
        }))));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      var data = this.props.data['down'] === null ? this.props.data['up'] : this.props.data['down'];
      var dataForEdit = {
        id: data.id,
        gender: data.gender,
        name: data.name,
        surname: data.surname,
        email: data.email,
        notes: data.notes,
        birth: data.birth,
        death: data.death,
        timestamp: data.timestamp
      };
      var dataForAdd = {
        id: data.id,
        name: data.name,
        num_parents: data.num_parents,
        timestamp: data.timestamp
      };

      if (data.couple_selected != null) {
        dataForAdd.couple_id = data.couple_selected.id;
      } else {
        dataForAdd.couple_id = 0;
      }

      dataForEdit.img_path = data.img_path;
      dataForEdit.creator = data.creator;
      var dataForInfo = dataForEdit;
      var personId = data.id;
      var newCoupleId = this.computeNewCoupleIdAsString(data);
      var dictForSwitch = {};
      dictForSwitch[personId.toString()] = newCoupleId;
      return React.createElement("table", {
        className: "parent-tree",
        id: "parent-tree"
      }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, this.createChildsUp(), React.createElement("div", {
        className: "node node-root",
        id: data.id
      }, React.createElement("img", {
        className: "person_photo",
        src: '/static/person_photos/' + data.img_path,
        onClick: function onClick() {
          return _this8.props.handleFetchData({
            method: 'GET',
            person_id: data.id
          });
        },
        alt: ""
      }), React.createElement("div", {
        className: "content"
      }, data.name + " " + data.surname, React.createElement("span", {
        className: "node-date"
      }, (data.birth.year == '' ? 'Desc' : data.birth.year) + " ‒ " + (data.death.year == '' ? 'Desc' : data.death.year))), React.createElement("img", {
        className: "icon_img edit_icon",
        onClick: function onClick() {
          return _this8.props.handleShowModalEdit(dataForEdit);
        },
        src: "/static/images/edit_icon.png",
        "data-html2canvas-ignore": "true"
      }), React.createElement("img", {
        className: "icon_img add_icon",
        onClick: function onClick() {
          return _this8.props.handleShowModalAdd(dataForAdd);
        },
        src: "/static/images/add_icon.png",
        "data-html2canvas-ignore": "true"
      }), React.createElement("img", {
        className: "icon_img info_icon",
        onClick: function onClick() {
          return _this8.props.handleShowInfo(dataForInfo);
        },
        src: "/static/images/info_icon.png",
        "data-html2canvas-ignore": "true"
      }), data.couple_selected == null && data.other_couples.length <= 0 ? null : React.createElement("img", {
        className: "icon_img switch-icon",
        onClick: function onClick() {
          return _this8.props.handleFetchData({
            method: 'GET',
            pairs: dictForSwitch
          });
        },
        src: "/static/images/switch_icon.png",
        "data-html2canvas-ignore": "true"
      })), this.createCouple(data), this.createChildsDown()))));
    }
  }]);

  return NodeRoot;
}(React.Component);

var NodeUp =
/*#__PURE__*/
function (_React$Component6) {
  _inherits(NodeUp, _React$Component6);

  function NodeUp() {
    _classCallCheck(this, NodeUp);

    return _possibleConstructorReturn(this, _getPrototypeOf(NodeUp).apply(this, arguments));
  }

  _createClass(NodeUp, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.createToCoupleLines();
      this.createToTreesLines();
    }
  }, {
    key: "createToCoupleLines",
    value: function createToCoupleLines() {
      if (this.props.data.couple_selected != null) {
        var c = document.getElementById("canvas");
        var cPos = $('#canvas').offset();
        var nPos = $('#' + this.props.data.id).offset();
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
        ctx.lineTo(nPos.left + 270 - cPos.left, nPos.top + 40 - cPos.top);
        ctx.stroke();
      }
    }
  }, {
    key: "createToTreesLines",
    value: function createToTreesLines() {
      var c = document.getElementById("canvas");
      var cPos = $('#canvas').offset();
      var nPos = $('#' + this.props.data.id).offset();
      var ctx = c.getContext("2d");
      ctx.beginPath(); //Lines going to the childs

      if (this.props.data.couple_selected != null) {
        ctx.moveTo(nPos.left + 177.5 - cPos.left, nPos.top + 40 - cPos.top);
        ctx.lineTo(nPos.left + 177.5 - cPos.left, nPos.top + 95 - cPos.top);
      } else {
        ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
        ctx.lineTo(nPos.left + 85 - cPos.left, nPos.top + 95 - cPos.top);
      } //Lines going to the parents


      if (this.props.data.childs.length > 0) {
        if (this.props.data.couple_selected != null) {
          ctx.moveTo(nPos.left + 177.5 - cPos.left, nPos.top + 40 - cPos.top);
          ctx.lineTo(nPos.left + 177.5 - cPos.left, nPos.top + -15 - cPos.top);
        } else {
          ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
          ctx.lineTo(nPos.left + 85 - cPos.left, nPos.top + -15 - cPos.top);
        }
      }

      ctx.stroke();
    }
  }, {
    key: "createChilds",
    value: function createChilds() {
      var _this9 = this;

      if (this.props.data.childs.length > 0) {
        var addPreGhost = false;
        var addPostGhost = false;

        if (this.props.data.childs.length == 1) {
          if (this.props.data.num_parents > 0) {
            addPostGhost = true;
          } else {
            addPreGhost = true;
          }
        }

        return React.createElement("table", null, React.createElement("tbody", null, React.createElement("tr", null, !addPreGhost ? null : React.createElement("td", null, React.createElement("div", {
          className: "node visibility-hidden"
        })), this.props.data.childs.map(function (child_data, index) {
          return React.createElement(NodeUp, {
            key: child_data.id,
            data: child_data,
            handleShowModalAdd: _this9.props.handleShowModalAdd,
            handleShowModalEdit: _this9.props.handleShowModalEdit,
            handleShowInfo: _this9.props.handleShowInfo,
            handleFetchData: _this9.props.handleFetchData
          });
        }), !addPostGhost ? null : React.createElement("td", null, React.createElement("div", {
          className: "node visibility-hidden"
        })))));
      }
    }
  }, {
    key: "createCouple",
    value: function createCouple() {
      var _this10 = this;

      if (this.props.data.couple_selected == null) {
        return null;
      } else {
        var dataForEdit = {
          id: this.props.data.couple_selected.id,
          gender: this.props.data.couple_selected.gender,
          name: this.props.data.couple_selected.name,
          surname: this.props.data.couple_selected.surname,
          email: this.props.data.couple_selected.email,
          notes: this.props.data.couple_selected.notes,
          birth: this.props.data.couple_selected.birth,
          death: this.props.data.couple_selected.death,
          timestamp: this.props.data.couple_selected.timestamp
        };
        var dataForAdd = {
          id: this.props.data.couple_selected.id,
          couple_id: this.props.data.id,
          name: this.props.data.couple_selected.name,
          num_parents: this.props.data.couple_selected.num_parents,
          timestamp: this.props.data.couple_selected.timestamp
        };
        dataForEdit.img_path = this.props.data.couple_selected.img_path;
        dataForEdit.creator = this.props.data.couple_selected.creator;
        var dataForInfo = dataForEdit;
        var nameClassForGhost = this.props.data.couple_selected.ghost === true ? " non-visible" : "";
        return React.createElement("div", {
          className: "node"
        }, React.createElement("img", {
          className: "person_photo",
          src: '/static/person_photos/' + this.props.data.couple_selected.img_path,
          onClick: function onClick() {
            return _this10.props.handleFetchData({
              method: 'GET',
              person_id: _this10.props.couple_selected.data.id
            });
          },
          alt: ""
        }), React.createElement("div", {
          className: "content"
        }, this.props.data.couple_selected.name + " " + this.props.data.couple_selected.surname, React.createElement("span", {
          className: "node-date"
        }, (this.props.data.couple_selected.birth.year == '' ? 'Desc' : this.props.data.couple_selected.birth.year) + " ‒ " + (this.props.data.couple_selected.death.year == '' ? 'Desc' : this.props.data.couple_selected.death.year))), React.createElement("img", {
          className: "icon_img edit_icon",
          onClick: function onClick() {
            return _this10.props.handleShowModalEdit(dataForEdit);
          },
          src: "/static/images/edit_icon.png",
          "data-html2canvas-ignore": "true"
        }), React.createElement("img", {
          className: "icon_img add_icon",
          onClick: function onClick() {
            return _this10.props.handleShowModalAdd(dataForAdd);
          },
          src: "/static/images/add_icon.png",
          "data-html2canvas-ignore": "true"
        }), React.createElement("img", {
          className: "icon_img info_icon",
          onClick: function onClick() {
            return _this10.props.handleShowInfo(dataForInfo);
          },
          src: "/static/images/info_icon.png",
          "data-html2canvas-ignore": "true"
        }));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this11 = this;

      var dataForEdit = {
        id: this.props.data.id,
        gender: this.props.data.gender,
        name: this.props.data.name,
        surname: this.props.data.surname,
        email: this.props.data.email,
        notes: this.props.data.notes,
        birth: this.props.data.birth,
        death: this.props.data.death,
        timestamp: this.props.data.timestamp
      };
      var dataForAdd = {
        id: this.props.data.id,
        name: this.props.data.name,
        num_parents: this.props.data.num_parents,
        timestamp: this.props.data.timestamp
      };

      if (this.props.data.couple_selected != null) {
        dataForAdd.couple_id = this.props.data.couple_selected.id;
      } else {
        dataForAdd.couple_id = 0;
      }

      dataForEdit.img_path = this.props.data.img_path;
      dataForEdit.creator = this.props.data.creator;
      var dataForInfo = dataForEdit;
      return React.createElement("td", null, this.createChilds(), React.createElement("div", {
        className: "node",
        id: this.props.data.id
      }, React.createElement("img", {
        className: "person_photo",
        src: '/static/person_photos/' + this.props.data.img_path,
        onClick: function onClick() {
          return _this11.props.handleFetchData({
            method: 'GET',
            person_id: _this11.props.data.id
          });
        },
        alt: ""
      }), React.createElement("div", {
        className: "content"
      }, this.props.data.name + " " + this.props.data.surname, React.createElement("span", {
        className: "node-date"
      }, (this.props.data.birth.year == '' ? 'Desc' : this.props.data.birth.year) + " ‒ " + (this.props.data.death.year == '' ? 'Desc' : this.props.data.death.year))), React.createElement("img", {
        className: "icon_img edit_icon",
        onClick: function onClick() {
          return _this11.props.handleShowModalEdit(dataForEdit);
        },
        src: "/static/images/edit_icon.png",
        "data-html2canvas-ignore": "true"
      }), React.createElement("img", {
        className: "icon_img add_icon",
        onClick: function onClick() {
          return _this11.props.handleShowModalAdd(dataForAdd);
        },
        src: "/static/images/add_icon.png",
        "data-html2canvas-ignore": "true"
      }), React.createElement("img", {
        className: "icon_img info_icon",
        onClick: function onClick() {
          return _this11.props.handleShowInfo(dataForInfo);
        },
        src: "/static/images/info_icon.png",
        "data-html2canvas-ignore": "true"
      })), this.createCouple());
    }
  }]);

  return NodeUp;
}(React.Component);

var NodeDown =
/*#__PURE__*/
function (_React$Component7) {
  _inherits(NodeDown, _React$Component7);

  function NodeDown() {
    _classCallCheck(this, NodeDown);

    return _possibleConstructorReturn(this, _getPrototypeOf(NodeDown).apply(this, arguments));
  }

  _createClass(NodeDown, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.createToCoupleLines();
      this.createToTreesLines();
    }
  }, {
    key: "createToCoupleLines",
    value: function createToCoupleLines() {
      if (this.props.data.couple_selected != null) {
        var c = document.getElementById("canvas");
        var cPos = $('#canvas').offset();
        var nPos = $('#' + this.props.data.id).offset();
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
        ctx.lineTo(nPos.left + 270 - cPos.left, nPos.top + 40 - cPos.top);
        ctx.stroke();
      }
    }
  }, {
    key: "createToTreesLines",
    value: function createToTreesLines() {
      var c = document.getElementById("canvas");
      var cPos = $('#canvas').offset();
      var nPos = $('#' + this.props.data.id).offset();
      var ctx = c.getContext("2d");
      ctx.beginPath(); //Lines going to the childs

      if (this.props.data.childs.length > 0) {
        if (this.props.data.couple_selected != null) {
          ctx.moveTo(nPos.left + 177.5 - cPos.left, nPos.top + 40 - cPos.top);
          ctx.lineTo(nPos.left + 177.5 - cPos.left, nPos.top + 95 - cPos.top);
        } else {
          ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
          ctx.lineTo(nPos.left + 85 - cPos.left, nPos.top + 95 - cPos.top);
        }
      } //Lines going to the parents


      if (this.props.data.couple_selected != null) {
        ctx.moveTo(nPos.left + 177.5 - cPos.left, nPos.top + 40 - cPos.top);
        ctx.lineTo(nPos.left + 177.5 - cPos.left, nPos.top + -15 - cPos.top);
      } else {
        ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
        ctx.lineTo(nPos.left + 85 - cPos.left, nPos.top + -15 - cPos.top);
      }

      ctx.stroke();
    }
  }, {
    key: "computeNewCoupleIdAsString",
    value: function computeNewCoupleIdAsString() {
      var _this12 = this;

      var result = this.props.data.other_couples.find(function (value) {
        return value.id > (_this12.props.data.couple_selected == null ? null : _this12.props.data.couple_selected.id);
      });
      if (result === undefined) return '0';
      return result.id.toString();
    }
  }, {
    key: "createCouple",
    value: function createCouple() {
      var _this13 = this;

      if (this.props.data.couple_selected == null) {
        return null;
      } else {
        var dataForEdit = {
          id: this.props.data.couple_selected.id,
          gender: this.props.data.couple_selected.gender,
          name: this.props.data.couple_selected.name,
          surname: this.props.data.couple_selected.surname,
          email: this.props.data.couple_selected.email,
          notes: this.props.data.couple_selected.notes,
          birth: this.props.data.couple_selected.birth,
          death: this.props.data.couple_selected.death,
          timestamp: this.props.data.couple_selected.timestamp
        };
        var dataForAdd = {
          id: this.props.data.couple_selected.id,
          couple_id: this.props.data.id,
          name: this.props.data.couple_selected.name,
          num_parents: this.props.data.couple_selected.num_parents,
          timestamp: this.props.data.couple_selected.timestamp
        };
        dataForEdit.img_path = this.props.data.couple_selected.img_path;
        dataForEdit.creator = this.props.data.couple_selected.creator;
        var dataForInfo = dataForEdit;
        var nameClassForGhost = this.props.data.couple_selected.ghost === true ? " non-visible" : "";
        return React.createElement("div", {
          className: "node"
        }, React.createElement("img", {
          className: "person_photo",
          src: '/static/person_photos/' + this.props.data.couple_selected.img_path,
          onClick: function onClick() {
            return _this13.props.handleFetchData({
              method: 'GET',
              person_id: _this13.props.couple_selected.data.id
            });
          },
          alt: ""
        }), React.createElement("div", {
          className: "content"
        }, this.props.data.couple_selected.name + " " + this.props.data.couple_selected.surname, React.createElement("span", {
          className: "node-date"
        }, (this.props.data.couple_selected.birth.year == '' ? 'Desc' : this.props.data.couple_selected.birth.year) + " ‒ " + (this.props.data.couple_selected.death.year == '' ? 'Desc' : this.props.data.couple_selected.death.year))), React.createElement("img", {
          className: "icon_img edit_icon",
          onClick: function onClick() {
            return _this13.props.handleShowModalEdit(dataForEdit);
          },
          src: "/static/images/edit_icon.png",
          "data-html2canvas-ignore": "true"
        }), React.createElement("img", {
          className: "icon_img add_icon",
          onClick: function onClick() {
            return _this13.props.handleShowModalAdd(dataForAdd);
          },
          src: "/static/images/add_icon.png",
          "data-html2canvas-ignore": "true"
        }), React.createElement("img", {
          className: "icon_img info_icon",
          onClick: function onClick() {
            return _this13.props.handleShowInfo(dataForInfo);
          },
          src: "/static/images/info_icon.png",
          "data-html2canvas-ignore": "true"
        }));
      }
    }
  }, {
    key: "createChilds",
    value: function createChilds() {
      var _this14 = this;

      if (this.props.data.childs.length > 0) {
        return React.createElement("table", null, React.createElement("tbody", null, React.createElement("tr", null, this.props.data.childs.map(function (child_data, index) {
          return React.createElement(NodeDown, {
            key: child_data.id,
            data: child_data,
            handleShowModalAdd: _this14.props.handleShowModalAdd,
            handleShowModalEdit: _this14.props.handleShowModalEdit,
            handleShowInfo: _this14.props.handleShowInfo,
            handleFetchData: _this14.props.handleFetchData
          });
        }))));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this15 = this;

      var dataForEdit = {
        id: this.props.data.id,
        gender: this.props.data.gender,
        name: this.props.data.name,
        surname: this.props.data.surname,
        email: this.props.data.email,
        notes: this.props.data.notes,
        birth: this.props.data.birth,
        death: this.props.data.death,
        timestamp: this.props.data.timestamp
      };
      var dataForAdd = {
        id: this.props.data.id,
        name: this.props.data.name,
        num_parents: this.props.data.num_parents,
        timestamp: this.props.data.timestamp
      };

      if (this.props.data.couple_selected != null) {
        dataForAdd.couple_id = this.props.data.couple_selected.id;
      } else {
        dataForAdd.couple_id = 0;
      }

      dataForEdit.img_path = this.props.data.img_path;
      dataForEdit.creator = this.props.data.creator;
      var dataForInfo = dataForEdit;
      var personId = this.props.data.id;
      var newCoupleId = this.computeNewCoupleIdAsString();
      var dictForSwitch = {};
      dictForSwitch[personId.toString()] = newCoupleId;
      return React.createElement("td", null, React.createElement("div", {
        className: "node",
        id: this.props.data.id
      }, React.createElement("img", {
        className: "person_photo",
        src: '/static/person_photos/' + this.props.data.img_path,
        onClick: function onClick() {
          return _this15.props.handleFetchData({
            method: 'GET',
            person_id: _this15.props.data.id
          });
        },
        alt: ""
      }), React.createElement("div", {
        className: "content"
      }, this.props.data.name + " " + this.props.data.surname, React.createElement("span", {
        className: "node-date"
      }, (this.props.data.birth.year == '' ? 'Desc' : this.props.data.birth.year) + " ‒ " + (this.props.data.death.year == '' ? 'Desc' : this.props.data.death.year))), React.createElement("img", {
        className: "icon_img edit_icon",
        onClick: function onClick() {
          return _this15.props.handleShowModalEdit(dataForEdit);
        },
        src: "/static/images/edit_icon.png",
        "data-html2canvas-ignore": "true"
      }), React.createElement("img", {
        className: "icon_img add_icon",
        onClick: function onClick() {
          return _this15.props.handleShowModalAdd(dataForAdd);
        },
        src: "/static/images/add_icon.png",
        "data-html2canvas-ignore": "true"
      }), React.createElement("img", {
        className: "icon_img info_icon",
        onClick: function onClick() {
          return _this15.props.handleShowInfo(dataForInfo);
        },
        src: "/static/images/info_icon.png",
        "data-html2canvas-ignore": "true"
      }), this.props.data.couple_selected == null && this.props.data.other_couples.length <= 0 ? null : React.createElement("img", {
        className: "icon_img switch-icon",
        onClick: function onClick() {
          return _this15.props.handleFetchData({
            method: 'GET',
            pairs: dictForSwitch
          });
        },
        src: "/static/images/switch_icon.png",
        "data-html2canvas-ignore": "true"
      })), this.createCouple(), this.createChilds());
    }
  }]);

  return NodeDown;
}(React.Component);

var EditorManager =
/*#__PURE__*/
function (_React$Component8) {
  _inherits(EditorManager, _React$Component8);

  function EditorManager(props) {
    var _this16;

    _classCallCheck(this, EditorManager);

    _this16 = _possibleConstructorReturn(this, _getPrototypeOf(EditorManager).call(this, props));

    _defineProperty(_assertThisInitialized(_this16), "showModalAdd", function (data) {
      _this16.setState({
        showModalAdd: true,
        dataModalAdd: data
      });
    });

    _defineProperty(_assertThisInitialized(_this16), "hideModalAdd", function () {
      _this16.setState({
        showModalAdd: false
      });
    });

    _defineProperty(_assertThisInitialized(_this16), "showModalEdit", function (data) {
      _this16.setState({
        showModalEdit: true,
        dataModalEdit: data
      });
    });

    _defineProperty(_assertThisInitialized(_this16), "hideModalEdit", function () {
      _this16.setState({
        showModalEdit: false
      });
    });

    _defineProperty(_assertThisInitialized(_this16), "showInfo", function (data) {
      _this16.setState({
        showInfo: true,
        dataInfo: data
      });
    });

    _defineProperty(_assertThisInitialized(_this16), "hideInfo", function () {
      _this16.setState({
        showInfo: false
      });
    });

    _this16.state = {
      token: '',
      csrfToken: null,
      showModalAdd: false,
      dataModalAdd: null,
      showModalEdit: false,
      dataModalEdit: null,
      showInfo: false,
      dataInfo: null,
      nodesData: null,
      currentTreeId: 0,
      currentGenerations: 5,
      currentDir: 'UD',
      currentPairs: {},
      loadingTree: false,
      reRenderConnectors: false //TODO manage setting currentTreeId generations and pairs the right way

    };
    _this16.fetchData = _this16.fetchData.bind(_assertThisInitialized(_this16));
    _this16.handleChangeGenerations = _this16.handleChangeGenerations.bind(_assertThisInitialized(_this16));
    _this16.handleChangeDir = _this16.handleChangeDir.bind(_assertThisInitialized(_this16));
    return _this16;
  }

  _createClass(EditorManager, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var link_id = parseInt(JSON.parse(document.getElementById('link_id-container').textContent));
      this.setState({
        currentTreeId: link_id,
        csrfToken: getCookie('csrftoken')
      });
      if (link_id > 0) this.fetchData({
        method: 'GET',
        person_id: link_id
      });else this.setError('Raiz del árbol no especificada o incorrecta, vaya a la lista de personas para seleccionar una.');
      this.loadFunctions();
      /*$("#download-tree-button").click(function(){
            var element = document.querySelector("#tree-wrapper")
          html2canvas(element, {windowWidth: element.scrollWidth, windowHeight: element.scrollHeight, allowTaint: true}).then(canvas => {
              document.body.appendChild(canvas)
          });
         });*/
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.state.reRenderConnectors) {
        this.drawConnectorLines();
        this.setState({
          reRenderConnectors: false
        });
      }
    }
  }, {
    key: "computeNodeIdsForConnectors",
    value: function computeNodeIdsForConnectors() {
      var _this17 = this;

      if (this.state.nodesData != null) {
        var idsUp = [];
        var idsDown = [];

        if (this.state.nodesData['up']) {
          (function () {
            var queue = [];
            queue.push(_this17.state.nodesData['up']);

            while (queue.length > 0) {
              var node = queue.shift();

              if (node.childs.length > 0) {
                node.childs.forEach(function (child) {
                  queue.push(child);
                });
                idsUp.push({
                  nodeId: node.id,
                  firstChildId: node.childs[0].id,
                  lastChildId: node.childs[node.childs.length - 1].id,
                  nodeHasCouple: node.couple_selected != null,
                  fcHasCouple: node.childs[0].couple_selected != null,
                  lcHasCouple: node.childs[node.childs.length - 1].couple_selected != null
                });
              }
            }
          })();
        }

        if (this.state.nodesData['down']) {
          (function () {
            var queue = [];
            queue.push(_this17.state.nodesData['down']);

            while (queue.length > 0) {
              var node = queue.shift();

              if (node.childs.length > 0) {
                node.childs.forEach(function (child) {
                  queue.push(child);
                });
                idsDown.push({
                  nodeId: node.id,
                  firstChildId: node.childs[0].id,
                  lastChildId: node.childs[node.childs.length - 1].id,
                  nodeHasCouple: node.couple_selected != null,
                  fcHasCouple: node.childs[0].couple_selected != null,
                  lcHasCouple: node.childs[node.childs.length - 1].couple_selected != null
                });
              }
            }
          })();
        }

        return {
          idsUp: idsUp,
          idsDown: idsDown
        };
      }
    }
  }, {
    key: "drawConnectorLines",
    value: function drawConnectorLines() {
      $("#tree-wrapper").css("transform", "scale(1)");
      var ids = this.computeNodeIdsForConnectors();

      if (ids) {
        var idsUp = ids.idsUp;
        var idsDown = ids.idsDown;
        var containerPos = $('#canvas').offset();
        var linesCoords = [];
        /*x1 y1 x2 y2*/

        idsUp.forEach(function (value) {
          var nodePos = $('#' + value.nodeId).offset();
          var firstChildPos = $('#' + value.firstChildId).offset();
          var lastChildPos = $('#' + value.lastChildId).offset();
          nodePos.top -= 15;

          if (value.nodeHasCouple) {
            nodePos.left += 177.5;
          } else {
            nodePos.left += 85;
          }

          if (value.fcHasCouple) {
            firstChildPos.left += 177.5;
          } else {
            firstChildPos.left += 85;
          }

          if (value.lcHasCouple) {
            lastChildPos.left += 177.5;
          } else {
            lastChildPos.left += 85;
          }

          linesCoords.push({
            x1: nodePos.left - containerPos.left,
            y1: nodePos.top - containerPos.top,
            x2: firstChildPos.left - containerPos.left,
            y2: nodePos.top - containerPos.top
          });
          linesCoords.push({
            x1: nodePos.left - containerPos.left,
            y1: nodePos.top - containerPos.top,
            x2: lastChildPos.left - containerPos.left,
            y2: nodePos.top - containerPos.top
          });
        });
        idsDown.forEach(function (value) {
          var nodePos = $('#' + value.nodeId).offset();
          var firstChildPos = $('#' + value.firstChildId).offset();
          var lastChildPos = $('#' + value.lastChildId).offset();
          nodePos.top += 80 + 15;
          if (value.nodeHasCouple) nodePos.left += 177.5;else nodePos.left += 85;
          if (value.fcHasCouple) firstChildPos.left += 177.5;else firstChildPos.left += 85;
          if (value.lcHasCouple) lastChildPos.left += 177.5;else lastChildPos.left += 85;
          linesCoords.push({
            x1: nodePos.left - containerPos.left,
            y1: nodePos.top - containerPos.top,
            x2: firstChildPos.left - containerPos.left,
            y2: nodePos.top - containerPos.top
          });
          linesCoords.push({
            x1: nodePos.left - containerPos.left,
            y1: nodePos.top - containerPos.top,
            x2: lastChildPos.left - containerPos.left,
            y2: nodePos.top - containerPos.top
          });
        });
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        linesCoords.forEach(function (coords, index) {
          ctx.moveTo(coords.x1, coords.y1);
          ctx.lineTo(coords.x2, coords.y2);
        });
        ctx.stroke();
      }
    }
  }, {
    key: "handleChangeGenerations",
    value: function handleChangeGenerations(event) {
      this.setState(_defineProperty({}, event.target.name, event.target.value));
      this.fetchData({
        method: 'GET',
        generations: event.target.value
      });
    }
  }, {
    key: "handleChangeDir",
    value: function handleChangeDir(event) {
      this.setState(_defineProperty({}, event.target.name, event.target.value));
      this.fetchData({
        method: 'GET',
        dir: event.target.value
      });
    }
  }, {
    key: "setError",
    value: function setError(errorText) {
      var e = document.getElementById('error-container');
      var d = new Date();
      e.innerHTML = e.innerHTML + '<p>' + errorText + '<span style="float: right">' + d.getHours() + ':' + d.getMinutes() + '</span></p>';
      e.style.display = 'block';
    }
  }, {
    key: "fetchData",
    value: function fetchData() {
      var _this18 = this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$method = _ref.method,
          method = _ref$method === void 0 ? 'GET' : _ref$method,
          _ref$person_id = _ref.person_id,
          person_id = _ref$person_id === void 0 ? this.state.currentTreeId : _ref$person_id,
          _ref$request_body = _ref.request_body,
          request_body = _ref$request_body === void 0 ? {} : _ref$request_body,
          _ref$img_blob = _ref.img_blob,
          img_blob = _ref$img_blob === void 0 ? null : _ref$img_blob,
          _ref$pairs = _ref.pairs,
          pairs = _ref$pairs === void 0 ? {} : _ref$pairs,
          _ref$generations = _ref.generations,
          generations = _ref$generations === void 0 ? this.state.currentGenerations : _ref$generations,
          _ref$dir = _ref.dir,
          dir = _ref$dir === void 0 ? this.state.currentDir : _ref$dir,
          _ref$tree_id = _ref.tree_id,
          tree_id = _ref$tree_id === void 0 ? this.state.currentTreeId : _ref$tree_id;

      pairs = Object.assign({}, this.state.currentPairs, pairs);
      this.setState({
        loadingTree: true,
        currentPairs: pairs
      });
      var url = location.origin + '/person/';
      var response_data = '';

      if (method === 'GET') {
        url = url + person_id + '?';

        if (_typeof(pairs) === "object" && Object.keys(pairs).length > 0) {
          url = url + '&pairs=' + JSON.stringify(pairs);
        }

        url = url + '&generations=' + generations;
        url = url + '&dir=' + dir;
        fetch(url, {
          method: method,
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (!('Error' in data)) {
            _this18.setState({
              nodesData: data,
              currentTreeId: person_id,
              currentGenerations: generations,
              currentPairs: pairs,
              loadingTree: false,
              reRenderConnectors: true
            });
          } else {
            _this18.setError(data['Error']);

            if (data['Error'] == 'Raíz del árbol no especificada, seleccione una en la pantalla de personas') {
              _this18.setState({
                loadingTree: false,
                nodesData: null,
                reRenderConnectors: true
              });
            } else {
              _this18.setState({
                loadingTree: false
              });
            }
          }
        }).catch(function (err) {
          _this18.setError('Error inesperado del servidor, por favor, vuelva a cargar el editor.');

          _this18.setState({
            loadingTree: false
          });
        });
      } else if (method === 'PUT') {
        url = url + person_id + '/';
        request_body['tree_id'] = tree_id;
        request_body['tree_generations'] = generations;
        request_body['tree_dir'] = dir;
        request_body['tree_pairs'] = pairs;
        var body = new FormData();
        body.append('body', JSON.stringify(request_body));

        if (img_blob !== null) {
          body.append('img', img_blob);
        }

        fetch(url, {
          method: method,
          credentials: 'include',
          headers: {
            'X-CSRFToken': this.state.csrfToken
          },
          body: body
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (!('Error' in data)) {
            _this18.setState({
              nodesData: data,
              loadingTree: false,
              reRenderConnectors: true
            });
          } else {
            _this18.setError(data['Error']);

            if (data['Error'] == 'Raíz del árbol no especificada, seleccione una en la pantalla de personas') {
              _this18.setState({
                loadingTree: false,
                nodesData: null,
                reRenderConnectors: true
              });
            } else {
              _this18.setState({
                loadingTree: false
              });
            }
          }
        }).catch(function (err) {
          _this18.setError('Error inesperado del servidor, por favor, vuelva a cargar el editor.');

          _this18.setState({
            loadingTree: false
          });
        });
      } else if (method === 'POST') {
        request_body['tree_id'] = tree_id;
        request_body['tree_generations'] = generations;
        request_body['tree_dir'] = dir;
        request_body['tree_pairs'] = pairs;

        var _body = new FormData();

        _body.append('body', JSON.stringify(request_body));

        if (img_blob !== null) {
          _body.append('img', img_blob);
        }

        fetch(url, {
          method: method,
          credentials: 'include',
          headers: {
            'X-CSRFToken': this.state.csrfToken
          },
          body: _body
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (!('Error' in data)) {
            _this18.setState({
              nodesData: data,
              loadingTree: false,
              reRenderConnectors: true
            });
          } else {
            _this18.setError(data['Error']);

            if (data['Error'] == 'Raíz del árbol no especificada, seleccione una en la pantalla de personas') {
              _this18.setState({
                loadingTree: false,
                nodesData: null,
                reRenderConnectors: true
              });
            } else {
              _this18.setState({
                loadingTree: false
              });
            }
          }
        }).catch(function (err) {
          _this18.setError('Error inesperado del servidor, por favor, vuelva a cargar el editor.');

          _this18.setState({
            loadingTree: false
          });
        });
      } else if (method === 'DELETE') {
        url = url + person_id + '/';
        request_body['tree_id'] = tree_id;
        request_body['tree_generations'] = generations;
        request_body['tree_dir'] = dir;
        request_body['tree_pairs'] = pairs;
        fetch(url, {
          method: method,
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': this.state.csrfToken
          },
          body: JSON.stringify(request_body)
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (!('Error' in data)) {
            _this18.setState({
              nodesData: data,
              loadingTree: false,
              reRenderConnectors: true
            });
          } else {
            _this18.setError(data['Error']);

            if (data['Error'] == 'Raíz del árbol no especificada, seleccione una en la pantalla de personas') {
              _this18.setState({
                loadingTree: false,
                nodesData: null,
                reRenderConnectors: true
              });
            } else {
              _this18.setState({
                loadingTree: false
              });
            }
          }
        }).catch(function (err) {
          _this18.setError('Error inesperado del servidor, por favor, vuelva a cargar el editor.');

          _this18.setState({
            loadingTree: false
          });
        });
      }
    }
  }, {
    key: "loadFunctions",
    value: function loadFunctions() {
      $(".editor-menu-display").click(function () {
        $(".editor-menu").toggle(200);
        $("#editor-menu-display-arrow").css({
          'transform': 'rotate(' + 180 + 'deg)'
        });
      });
      $("#more-zoom").click(function () {
        var zoom = getCurrentTreeZoom();

        if (zoom <= 9.9) {
          $("#tree-wrapper").css("transform", "scale(" + (zoom + 0.1).toString() + ")");
        }
      });
      $("#less-zoom").click(function () {
        var zoom = getCurrentTreeZoom();

        if (zoom >= 0.2) {
          $("#tree-wrapper").css("transform", "scale(" + (zoom - 0.1).toString() + ")");
        }
      });
      $("#1-zoom").click(function () {
        $("#tree-wrapper").css("transform", "scale(1)");
      });
      $('#download-tree-button').click(function () {
        html2canvas(document.getElementById('tree-wrapper')).then(function (canvas) {
          var ctx = canvas.getContext("2d");
          var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          var compositeOperation = ctx.globalCompositeOperation;
          ctx.globalCompositeOperation = "destination-over";
          ctx.fillStyle = "#800000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          var tempCanvas = document.createElement("canvas"),
              tCtx = tempCanvas.getContext("2d");
          tempCanvas.width = $('#parent-tree').width();
          tempCanvas.height = $('#parent-tree').height();
          tCtx.drawImage(canvas, 0, 0);
          download(tempCanvas, 'MyTree.png'); //document.body.appendChild(tempCanvas)
        });
      }); //Make the DIV element draggagle:

      dragElement("tree-wrapper", "tree-draggable-background");
    }
  }, {
    key: "render",
    value: function render() {
      var _this19 = this;

      var dataForAddButton = {
        id: 0,
        couple_id: 0,
        name: '',
        num_parents: 0
      };
      return React.createElement("div", {
        className: "editor-manager-class"
      }, React.createElement(LoadingCircle, {
        show: this.state.loadingTree
      }), React.createElement(ModalAdd, {
        show: this.state.showModalAdd,
        handleHideModal: this.hideModalAdd,
        data: this.state.dataModalAdd,
        handleFetchData: this.fetchData
      }), React.createElement(ModalEdit, {
        show: this.state.showModalEdit,
        handleHideModal: this.hideModalEdit,
        data: this.state.dataModalEdit,
        handleFetchData: this.fetchData
      }), React.createElement(EditorMenu, {
        show: this.state.showInfo,
        data: this.state.dataInfo,
        handleHideInfo: this.hideInfo
      }), React.createElement("div", {
        className: "selectors-menu"
      }, React.createElement("div", {
        className: "zoom-tool"
      }, React.createElement("img", {
        id: "more-zoom",
        height: "20",
        width: "20",
        src: "/static/images/add_icon.png",
        alt: ""
      }), React.createElement("img", {
        id: "1-zoom",
        height: "30",
        width: "30",
        src: "/static/images/magnifiyingglass_icon.png",
        alt: ""
      }), React.createElement("img", {
        id: "less-zoom",
        height: "20",
        width: "20",
        src: "/static/images/less_icon.png",
        alt: ""
      })), React.createElement("div", {
        className: "gen-selector"
      }, React.createElement("label", null, "Generaciones: ", React.createElement("br", null), React.createElement("input", {
        name: "currentGenerations",
        type: "number",
        value: this.state.currentGenerations,
        onChange: this.handleChangeGenerations,
        min: "0",
        max: "7"
      }))), React.createElement("div", {
        className: "dir-selector"
      }, React.createElement("label", null, "Mostrar hacia: ", React.createElement("br", null), React.createElement("select", {
        name: "currentDir",
        value: this.state.currentDir,
        onChange: this.handleChangeDir
      }, React.createElement("option", {
        value: "U"
      }, "Arriba"), React.createElement("option", {
        value: "D"
      }, "Abajo"), React.createElement("option", {
        value: "UD"
      }, "Arriba y abajo")))), React.createElement("button", {
        id: "new-person-button",
        onClick: function onClick() {
          return _this19.showModalAdd(dataForAddButton);
        }
      }, "A\xF1adir persona sin parientes."), React.createElement("button", {
        id: "download-tree-button"
      }, "Descargar imagen del \xE1rbol.")), React.createElement("div", {
        className: "tree-draggable-background"
      }, React.createElement("div", {
        id: "tree-wrapper"
      }, React.createElement("canvas", {
        id: "canvas",
        width: "3000",
        height: "3000"
      }), this.state.nodesData === null ? '' : React.createElement(NodeRoot, {
        data: this.state.nodesData,
        handleShowModalAdd: this.showModalAdd,
        handleShowModalEdit: this.showModalEdit,
        handleShowInfo: this.showInfo,
        handleFetchData: this.fetchData
      }))));
    }
  }]);

  return EditorManager;
}(React.Component); //*************************************************
//*************************************************


ReactDOM.render(React.createElement(EditorManager, null), document.getElementById('root'));