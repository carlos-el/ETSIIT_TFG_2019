//*************************************************
//*************************************************
//General usage functions
function getCurrentTreeZoom(){
  const style = window.getComputedStyle(document.getElementById('tree-wrapper'));
  const transform = style.getPropertyValue('transform');
  return (parseFloat(transform.substr(7, 3)));
}

function isValidEmail(email){
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if((email.match(mailformat) && email.length < 254) || email === '') {
        return true;
    } else {
        return false;
    }
}

function isValidDate(year, month, day){
    if(year === '' && month === '' && day === ''){
        return true
    }
    if(!(year !== '' && month !== '' && day !== '')){
        return false
    }

    const d = parseInt(day)
    const m = parseInt(month)

    if( (m > 12 || m < 1) || (m === 2 && d > 29) || (d < 1 || d > 31) )
        return false

    return true
}

function errorsInDataForModal(email,
            birth_year, birth_month, birth_day,
            death_year, death_month, death_day,
            name, surname, notes){

    let error_messages = []
    if(!isValidEmail(email))
        error_messages.push("Dirección de email no válida.")
    if(!isValidDate(birth_year, birth_month, birth_day))
        error_messages.push("Fecha de nacimiento no válida.")
    if(!isValidDate(death_year, death_month, death_day))
        error_messages.push("Fecha de defunción no válida.")
    if(name.length > 15)
        error_messages.push("Nombre demasiado largo.")
    if(surname.length > 30)
        error_messages.push("Apellidos demasiado largos.")
    if(notes.length > 299)
        error_messages.push("La información sobrepasa la longitud permitida.")

    if(isValidDate(birth_year, birth_month, birth_day) && isValidDate(death_year, death_month, death_day) &&
    birth_year+birth_month+birth_day !== "" && death_year+death_month+death_day !== ""){
        if(birth_year > death_year ||
        (birth_year == death_year && birth_month > death_month) ||
        (birth_year == death_year && birth_month == death_month && birth_day > death_day)
        ){
            error_messages.push("La fecha de nacimiento debe ser anterior a la de defunción.")
        }
    }

    return error_messages
}

function dragElement(idElementMovable, idElementToDragForMoving) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            let elmnt = document.getElementById(idElementMovable)
            let dragger = document.getElementById(idElementToDragForMoving)

            if (document.getElementById(idElementToDragForMoving)) {
                /* if present, the dragger is where you move the DIV from:*/
            dragger.onmousedown = dragMouseDown;
            } else {
                /* otherwise, move the DIV from anywhere inside the DIV:*/
                elmnt.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
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
  var lnk = document.createElement('a'), e;

  /// the key here is to set the download attribute of the a tag
  lnk.download = filename;

  /// convert canvas content to data-uri for link. When download
  /// attribute is set the content pointed to by link will be
  /// pushed as "download" in HTML5 capable browsers
  lnk.href = canvas.toDataURL("image/png;base64");

  /// create a "fake" click-event to trigger the download
  if (document.createEvent) {
    e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window,
                     0, 0, 0, 0, 0, false, false, false,
                     false, 0, null);

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
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}




//*************************************************
//*************************************************
class LoadingCircle extends React.Component{
    render(){
        const showHideClassName = this.props.show ? 'loading-screen display-block' : 'loading-screen display-none';
        const animateClassName = this.props.show ? 'loading-icon loading-icon-animation' : 'loading-icon';

        return(
            <div className={showHideClassName}>
                <img className={animateClassName} src="/static/images/loading_icon.png" alt=""/>
            </div>
        )
    }
}

class EditorMenu extends React.Component{
    render(){
        let style = (this.props.show ? {display: 'inline-block'} : {display: 'none'})
        const map_gender = {'O': 'Otro', 'U': 'Desconocido', 'M': 'Masculino', 'F': 'Femenino'}
        return(
            <div className="editor-menu-container">

                    <div className="editor-menu" style={style}>

                        {!this.props.data ? (<p>Usa el botón de información de una persona del árbol para ver sus datos.</p>) : (
                            <div>
                                <img src={'/static/person_photos/' + this.props.data.img_path} alt=""/>
                                <b>{this.props.data.name}</b><br/>
                                <b>{this.props.data.surname}</b><br/><br/><br/><br/>
                                <p><b>Género: </b>{map_gender[this.props.data.gender]}</p>
                                <p><b>Fecha de nacimiento: </b>{this.props.data.birth.day && this.props.data.birth.month && this.props.data.birth.year ?
                                    this.props.data.birth.day+'/'+this.props.data.birth.month+'/'+this.props.data.birth.year : 'Desconocida'}</p>

                                {this.props.data.death.day && this.props.data.death.month && this.props.data.death.year ?
                                    <p><b>Fecha de defuncion: </b>{this.props.data.death.day}/{this.props.data.death.month}/{this.props.data.death.year}</p> : ''}

                                <p><b>Email: </b>{this.props.data.email ? this.props.data.email : 'Desconocido'}</p>
                                <p><b>Más información: </b>{this.props.data.notes ? this.props.data.notes : 'No especificada.'}</p>
                                <p><b>Propietario del registro: </b>{this.props.data.creator}</p>

                                <br/>
                                <a href={'http://localhost:8000/person/' + this.props.data.id}><button>Ir a la lista de parientes de esta persona</button></a>
                            </div>
                        )}


                    </div>
                    <div onClick={() => this.props.handleHideInfo()} className="editor-menu-display">
                        <span id="editor-menu-display-arrow">&#8660;</span>
                    </div>

            </div>
        )
    }
}

class ModalAdd extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            relative: 'P', gender: 'U', name: '', surname: '', email: '',
            birth_day: '', birth_month: '', birth_year: '',
            death_day: '', death_month: '', death_year: '',
            notes: '', img_path: '', img_blob: null,

            relative_id: 0,
            relative_name: '',
            relative_couple_id: '',

            num_parents: 0,

            form_error: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            relative: 'P', gender: 'U', name: '', surname: '', email: '',
            birth_day: '', birth_month: '', birth_year: '',
            death_day: '', death_month: '', death_year: '',
            notes: '', img_path: '', img_blob: null,
            form_error: []
        });

        if (nextProps.data !== null)
            this.setState({relative_id: nextProps.data.id,
                relative_name: nextProps.data.name,
                relative_couple_id: nextProps.data.couple_id,

                num_parents: nextProps.data.num_parents,
                relative: ((nextProps.data.num_parents >=2) ? ('S') : ('P'))
            })

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

    handleChange(event) {
        if(event.target.name === 'img_path'){
            this.setState({[event.target.name]: event.target.value, img_blob: event.target.files[0] });
        }else{
            this.setState({[event.target.name]: event.target.value});
        }
    }

    handleSubmit() {
        const body = {
            relative_type: this.state.relative, gender: this.state.gender, name: this.state.name, surname: this.state.surname, email: this.state.email,
            notes: this.state.notes,
            birth: {day: this.state.birth_day, month: this.state.birth_month, year: this.state.birth_year},
            death: {day: this.state.death_day, month: this.state.death_month, year: this.state.death_year},

            relative_id: this.state.relative_id,
            relative_couple_id: this.state.relative_couple_id,

            timestamp: this.props.data.timestamp
        }

        const error_messages = errorsInDataForModal(this.state.email,
            this.state.birth_year, this.state.birth_month, this.state.birth_day,
            this.state.death_year, this.state.death_month, this.state.death_day,
            this.state.name, this.state.surname, this.state.notes)

        if(error_messages.length > 0){
            this.setState({form_error: error_messages})
            return false
        }

        this.props.handleHideModal();
        this.props.handleFetchData({method:'POST', request_body: body, img_blob: this.state.img_blob});
    }

    render() {
        const showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
        return(
            <div className={showHideClassName}>
                <div className="modal-main">
                    <img onClick={this.props.handleHideModal} src="/static/images/closewindow_icon.png" className="close-button" alt=""/>
                    <p style={{fontSize:"x-large"}}>{ (this.state.relative_id == 0) ? ('Añadir nueva persona') : <span>Añadir pariente de {this.state.relative_name}</span> }.</p>

                        <label className={ (this.state.relative_id == 0) ? ('display-none') : ('') }>
                            Parentesco: <br/>
                            <select name="relative" value={this.state.relative} onChange={this.handleChange}>
                                /*TODO comprobar que se puede añadir un progenitor*/
                                {(this.state.num_parents < 2) ? (<option value="P">Progenitor</option>) : (null)}
                                <option value="S">Hermano</option>
                                <option value="C">Hijo</option>
                                <option value="U">Pareja</option>
                            </select>
                        </label> <br/><br/>
                        <label>
                            Genero: <br/>
                            <select name="gender" value={this.state.gender} onChange={this.handleChange}>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                                <option value="U">Desconocido</option>
                            </select>
                        </label> <br/><br/>
                        <label>
                            Nombre: <br/>
                            <input
                                name="name"
                                type="text"
                                value={this.state.name}
                                onChange={this.handleChange}
                            />
                        </label> <br/><br/>
                        <label>
                            Apellidos: <br/>
                            <input
                                name="surname"
                                type="text"
                                value={this.state.surname}
                                onChange={this.handleChange}
                            />
                        </label> <br/><br/>
                        <label>
                            E-mail: <br/>
                            <input
                                name="email"
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </label> <br/><br/>
                        <label>
                            Más información: <br/>
                            <textarea
                                name="notes"
                                cols="66"
                                value={this.state.notes}
                                onChange={this.handleChange}
                            />
                        </label> <br/><br/>
                        <label>
                            Fecha de nacimiento: (dd/mm/aaaa)<br/>
                            <input
                                name="birth_day"
                                type="number"
                                value={this.state.birth_day}
                                onChange={this.handleChange}
                            />
                        </label><label>
                            <input
                                name="birth_month"
                                type="number"
                                value={this.state.birth_month}
                                onChange={this.handleChange}
                            />
                        </label><label>
                            <input
                                name="birth_year"
                                type="number"
                                value={this.state.birth_year}
                                onChange={this.handleChange}
                            />
                        </label> <br/><br/>
                        <label>
                            Fecha de defuncion, si procede: (dd/mm/aaaa)<br/>
                            <input
                                name="death_day"
                                type="number"
                                value={this.state.death_day}
                                onChange={this.handleChange}
                            />
                        </label><label>
                            <input
                                name="death_month"
                                type="number"
                                value={this.state.death_month}
                                onChange={this.handleChange}
                            />
                        </label><label>
                            <input
                                name="death_year"
                                type="number"
                                value={this.state.death_year}
                                onChange={this.handleChange}
                            />
                        </label><br/><br/>
                        <label>
                            Agregar fotografía: (.png/.jpg/.jpeg)<br/>
                            <input
                                name="img_path"
                                type="file"
                                value={this.state.img_path}
                                accept="image/png, image/jpeg"
                                onChange={this.handleChange}
                            />
                        </label> <br/>

                        <p style={{color: "red"}}>{this.state.form_error.map((error, index) => {return <span key={index}><br/>{error}</span>})}</p>

                        <button className="standard-button" onClick={this.handleSubmit}>Aceptar</button>
                </div>
            </div>
        );
    }

}

class ModalEdit extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            id: 0, gender: 'U', name: '', surname: '', email: '',
            birth_day: '', birth_month: '', birth_year: '',
            death_day: '', death_month: '', death_year: '',
            notes: '', img_path: '', img_blob: null,
            perm:'', type_perm: 'assign',

            form_error: []
        };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete  = this.handleDelete.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.data !== null) {
            this.setState({
                id: nextProps.data.id, gender: nextProps.data.gender, name: nextProps.data.name, surname: nextProps.data.surname, email: nextProps.data.email,
                birth_day: nextProps.data.birth.day, birth_month: nextProps.data.birth.month, birth_year: nextProps.data.birth.year,
                death_day: nextProps.data.death.day, death_month: nextProps.data.death.month, death_year: nextProps.data.death.year,
                notes: nextProps.data.notes, img_path: '', img_blob: null, perm: '', type_perm: 'assign',
                form_error: []
            });
        }
    }

    handleChange(event) {
        if(event.target.name === 'img_path'){
            this.setState({[event.target.name]: event.target.value, img_blob: event.target.files[0] });
        }else{
            this.setState({[event.target.name]: event.target.value});
        }
    }

    handleSubmit() {
        const body = {id: this.state.id, gender: this.state.gender, name: this.state.name, surname: this.state.surname, email: this.state.email,
            notes: this.state.notes,
            birth: {day: this.state.birth_day, month: this.state.birth_month, year: this.state.birth_year},
            death: {day: this.state.death_day, month: this.state.death_month, year: this.state.death_year},
            perm: this.state.perm, type_perm: this.state.type_perm,
            timestamp: this.props.data.timestamp
        }

        const error_messages = errorsInDataForModal(this.state.email,
            this.state.birth_year, this.state.birth_month, this.state.birth_day,
            this.state.death_year, this.state.death_month, this.state.death_day,
            this.state.name, this.state.surname, this.state.notes)

        if(error_messages.length > 0){
            this.setState({form_error: error_messages})
            return false
        }

        this.props.handleHideModal();
        this.props.handleFetchData({method: 'PUT', person_id:this.state.id, request_body: body, img_blob: this.state.img_blob});
    }

    handleDelete() {
        this.props.handleHideModal();
        this.props.handleFetchData({method: 'DELETE', person_id: this.state.id});
    }

    render() {
        const showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
        return(
            <div className={showHideClassName}>
                <div className="modal-main">
                    <img onClick={this.props.handleHideModal} src="/static/images/closewindow_icon.png" className="close-button" alt=""/>
                    <p style={{fontSize:"x-large"}}>Editar la informacion de {this.state.name}</p>

                        <label>
                            Genero: <br/>
                            <select name="gender" value={this.state.gender} onChange={this.handleChange}>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                                <option value="U">Desconocido</option>
                            </select>
                        </label> <br/><br/>
                        <label>
                            Nombre: <br/>
                            <input
                                name="name"
                                type="text"
                                value={this.state.name}
                                onChange={this.handleChange}
                            />
                        </label> <br/><br/>
                        <label>
                            Apellidos: <br/>
                            <input
                                name="surname"
                                type="text"
                                value={this.state.surname}
                                onChange={this.handleChange}
                            />
                        </label> <br/><br/>
                        <label>
                            E-mail: <br/>
                            <input
                                name="email"
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </label> <br/><br/>
                        <label>
                            Más información: <br/>
                            <textarea
                                name="notes"
                                cols="66"
                                value={this.state.notes}
                                onChange={this.handleChange}
                            />
                        </label> <br/><br/>
                        <label>
                            Fecha de nacimiento: (dd/mm/aaaa)<br/>
                            <input
                                name="birth_day"
                                type="number"
                                value={this.state.birth_day}
                                onChange={this.handleChange}
                            />
                        </label><label>
                            <input
                                name="birth_month"
                                type="number"
                                value={this.state.birth_month}
                                onChange={this.handleChange}
                            />
                        </label><label>
                            <input
                                name="birth_year"
                                type="number"
                                value={this.state.birth_year}
                                onChange={this.handleChange}
                            />
                        </label> <br/><br/>
                        <label>
                            Fecha de defuncion, si procede: (dd/mm/aaaa)<br/>
                            <input
                                name="death_day"
                                type="number"
                                value={this.state.death_day}
                                onChange={this.handleChange}
                            />
                        </label><label>
                            <input
                                name="death_month"
                                type="number"
                                value={this.state.death_month}
                                onChange={this.handleChange}
                            />
                        </label><label>
                            <input
                                name="death_year"
                                type="number"
                                value={this.state.death_year}
                                onChange={this.handleChange}
                            />
                        </label> <br/><br/>
                        <label>
                            Agregar nueva fotografía: <br/>
                            <input
                                name="img_path"
                                type="file"
                                value={this.state.img_path}
                                accept="image/png, image/jpeg"
                                onChange={this.handleChange}
                            />
                        </label> <br/><br/>
                        <label>
                            <select name="type_perm" value={this.state.type_perm} onChange={this.handleChange}>
                                <option value='assign'>Asignar</option>
                                <option value='remove'>Quitar</option>
                            </select>
                            &nbsp;permisos sobre el registro a usuarios: <br/>
                            <input
                                name="perm"
                                type="text"
                                value={this.state.perm}
                                onChange={this.handleChange}
                            />
                        </label> <br/>

                        <p style={{color: "red"}}>{this.state.form_error.map((error, index) => {return <span key={index}><br/>{error}</span>})}</p>

                        <button className="standard-button" onClick={this.handleSubmit}>Aceptar cambios</button>
                        <button className="standard-button" style={{float:"right", backgroundColor:"red", borderColor:"darkred"}}
                            onClick={() => { if (window.confirm('¿Estas seguro de que deseas borrar a esta persona de tu árbol?')) this.handleDelete() } }>
                            Borrar persona
                        </button>


                </div>
            </div>
        );
    }
}


class NodeRoot extends React.Component{
    componentDidUpdate(){
        this.createToCoupleLines()
        this.createToTreesLines()
    }

    createToCoupleLines(){
        const data = ( this.props.data['down'] === null ? this.props.data['up'] : this.props.data['down'])

        if(data.couple_selected != null){
            const c = document.getElementById("canvas");
            const cPos = $('#canvas').offset()
            const nPos = $('#'+data.id).offset()
            const ctx = c.getContext("2d");

            ctx.beginPath();
            ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
            ctx.lineTo(nPos.left + 270 - cPos.left, nPos.top + 40 - cPos.top);
            ctx.stroke();
        }
    }

    createToTreesLines(){
        const c = document.getElementById("canvas");
        const cPos = $('#canvas').offset()

        let nPos
        if(this.props.data['up'] != null)
            nPos = $('#'+this.props.data['up'].id).offset()
        else
            nPos = $('#'+this.props.data['down'].id).offset()

        const ctx = c.getContext("2d");
        ctx.beginPath();

        if(!(this.props.data['up'] == null || this.props.data['up'].childs.length == 0)){
            if(this.props.data['up'].couple_selected == null){
                ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
                ctx.lineTo(nPos.left + 85 - cPos.left, nPos.top + (-15) - cPos.top);
            }else{
                ctx.moveTo(nPos.left + 177.5 - cPos.left, nPos.top + 40 - cPos.top);
                ctx.lineTo(nPos.left + 177.5 - cPos.left, nPos.top + (-15) - cPos.top);
            }
        }

        if(!(this.props.data['down'] == null || this.props.data['down'].childs.length == 0)){
            if(this.props.data['down'].couple_selected == null){
                ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
                ctx.lineTo(nPos.left + 85 - cPos.left, nPos.top + 95 - cPos.top);
            }else{
                ctx.moveTo(nPos.left + 177.5 - cPos.left, nPos.top + 40 - cPos.top);
                ctx.lineTo(nPos.left + 177.5 - cPos.left, nPos.top + 95 - cPos.top);
            }
        }

        ctx.stroke();
    }

    computeNewCoupleIdAsString(data){
        let result = data.other_couples.find((value) => {return value.id > ((data.couple_selected == null) ? (null) : (data.couple_selected.id))})
        if(result === undefined)
            return '0'

        return result.id.toString()
    }

    createCouple(data){
        if (data.couple_selected == null) {
            return (null)
        } else {
            const dataForEdit = {
                id: data.couple_selected.id,
                gender: data.couple_selected.gender,
                name: data.couple_selected.name,
                surname: data.couple_selected.surname,
                email: data.couple_selected.email,
                notes: data.couple_selected.notes,
                birth: data.couple_selected.birth,
                death: data.couple_selected.death,
                timestamp: data.couple_selected.timestamp
            }
            const dataForAdd = {
                id: data.couple_selected.id,
                couple_id: data.id,
                name: data.couple_selected.name,
                num_parents: data.couple_selected.num_parents,
                timestamp: data.couple_selected.timestamp
            }

            dataForEdit.img_path = data.couple_selected.img_path
            dataForEdit.creator= data.couple_selected.creator
            const dataForInfo = dataForEdit

            return (
                <div className="node node-root">
                    <img className="person_photo" src={'/static/person_photos/' + data.couple_selected.img_path}
                        onClick={() => this.props.handleFetchData({method: 'GET', person_id: data.couple_selected.id})} alt=""/>
                    <div className="content">
                        {data.couple_selected.name + " " + data.couple_selected.surname}
                        <span className="node-date">{(data.couple_selected.birth.year == '' ? 'Desc' : data.couple_selected.birth.year) + " ‒ " + (data.couple_selected.death.year == '' ? 'Desc' : data.couple_selected.death.year)}</span>
                    </div>
                    <img className="icon_img edit_icon" onClick={() => this.props.handleShowModalEdit(dataForEdit)} src="/static/images/edit_icon.png" data-html2canvas-ignore="true"/>
                    <img className="icon_img add_icon" onClick={() => this.props.handleShowModalAdd(dataForAdd)} src="/static/images/add_icon.png" data-html2canvas-ignore="true"/>
                    <img className="icon_img info_icon" onClick={() => this.props.handleShowInfo(dataForInfo)} src="/static/images/info_icon.png" data-html2canvas-ignore="true"/>
                </div>
            );
        }
    }

    createChildsUp(){
        if(this.props.data['up'] !== null && this.props.data['up'].childs.length > 0){

            let addPreGhost = false
            let addPostGhost = false

            if( this.props.data['up'].childs.length == 1 ){
                if(this.props.data['up'].num_parents > 0){
                    addPostGhost = true
                }
                else{
                    addPreGhost = true
                }
            }

            return(
                <table className="upper">
                    <tbody>
                        <tr>
                            {!addPreGhost ? (null) : (
                                <td>
                                    <div className="node visibility-hidden"></div>
                                </td>
                            )}

                            {this.props.data['up'].childs.map((child_data, index) => {
                                return(
                                    <NodeUp
                                        key={child_data.id}
                                        data={child_data}
                                        handleShowModalAdd={this.props.handleShowModalAdd}
                                        handleShowModalEdit={this.props.handleShowModalEdit}
                                        handleShowInfo={this.props.handleShowInfo}
                                        handleFetchData={this.props.handleFetchData}
                                    />
                                );
                            })}

                            {!addPostGhost ? (null) : (
                                <td>
                                    <div className="node visibility-hidden"></div>
                                </td>
                            )}
                        </tr>
                    </tbody>
                </table>
            );
        }
    }

    createChildsDown(){
        if(this.props.data['down'] !== null){

            return(
                <table>
                    <tbody>
                        <tr>
                                {this.props.data['down'].childs.map((child_data, index) => {
                                    return(
                                        <NodeDown
                                            key={child_data.id}
                                            data={child_data}
                                            handleShowModalAdd={this.props.handleShowModalAdd}
                                            handleShowModalEdit={this.props.handleShowModalEdit}
                                            handleShowInfo={this.props.handleShowInfo}
                                            handleFetchData={this.props.handleFetchData}
                                        />
                                    );
                                })}
                        </tr>
                    </tbody>
                </table>
            );
        }
    }

    render() {
        const data = ( this.props.data['down'] === null ? this.props.data['up'] : this.props.data['down'])

        const dataForEdit = {
                id: data.id,
                gender: data.gender,
                name: data.name,
                surname: data.surname,
                email: data.email,
                notes: data.notes,
                birth: data.birth,
                death: data.death,
                timestamp: data.timestamp
            }
        const dataForAdd = {
                id: data.id,
                name: data.name,
                num_parents: data.num_parents,
                timestamp: data.timestamp
            }

        if (data.couple_selected != null){
            dataForAdd.couple_id = data.couple_selected.id
        }else{
            dataForAdd.couple_id = 0
        }

        dataForEdit.img_path = data.img_path
        dataForEdit.creator= data.creator
        const dataForInfo = dataForEdit

        const personId = data.id
        const newCoupleId = this.computeNewCoupleIdAsString(data)
        let dictForSwitch = {}
        dictForSwitch[personId.toString()] = newCoupleId

        return (
            <table className="parent-tree" id="parent-tree">
                <tbody>
                    <tr>
                        <td>
                            {this.createChildsUp()}

                            <div className="node node-root" id={data.id}>
                                <img className="person_photo" src={'/static/person_photos/' + data.img_path}
                                    onClick={() => this.props.handleFetchData({method: 'GET', person_id: data.id})} alt=""/>
                                <div className="content">
                                    {data.name + " " + data.surname}
                                    <span className="node-date">{(data.birth.year == '' ? 'Desc' : data.birth.year) + " ‒ " + (data.death.year == '' ? 'Desc' : data.death.year)}</span>
                                </div>
                                <img className="icon_img edit_icon" onClick={() => this.props.handleShowModalEdit(dataForEdit)} src="/static/images/edit_icon.png" data-html2canvas-ignore="true"/>
                                <img className="icon_img add_icon" onClick={() => this.props.handleShowModalAdd(dataForAdd)} src="/static/images/add_icon.png" data-html2canvas-ignore="true"/>
                                <img className="icon_img info_icon" onClick={() => this.props.handleShowInfo(dataForInfo)} src="/static/images/info_icon.png" data-html2canvas-ignore="true"/>
                                {( (data.couple_selected == null && data.other_couples.length <= 0) ? null :
                                    <img className="icon_img switch-icon" onClick={() => this.props.handleFetchData({method: 'GET', pairs: dictForSwitch})}
                                     src="/static/images/switch_icon.png" data-html2canvas-ignore="true"/>
                                )}
                            </div>

                            {this.createCouple(data)}

                            {this.createChildsDown()}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

class NodeUp extends React.Component{
    componentDidUpdate(){
        this.createToCoupleLines()
        this.createToTreesLines()
    }

    createToCoupleLines(){
        if(this.props.data.couple_selected != null){
            const c = document.getElementById("canvas");
            const cPos = $('#canvas').offset()
            const nPos = $('#'+this.props.data.id).offset()
            const ctx = c.getContext("2d");

            ctx.beginPath();
            ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
            ctx.lineTo(nPos.left + 270 - cPos.left, nPos.top + 40 - cPos.top);
            ctx.stroke();
        }
    }

    createToTreesLines(){
        const c = document.getElementById("canvas");
        const cPos = $('#canvas').offset()
        const nPos = $('#'+this.props.data.id).offset()
        const ctx = c.getContext("2d");

        ctx.beginPath();

        //Lines going to the childs
        if(this.props.data.couple_selected != null){
            ctx.moveTo(nPos.left + 177.5 - cPos.left, nPos.top + 40 - cPos.top);
            ctx.lineTo(nPos.left + 177.5 - cPos.left, nPos.top + 95 - cPos.top);
        }else{
            ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
            ctx.lineTo(nPos.left + 85 - cPos.left, nPos.top + 95 - cPos.top);
        }

        //Lines going to the parents
        if(this.props.data.childs.length > 0){
            if(this.props.data.couple_selected != null){
                ctx.moveTo(nPos.left + 177.5 - cPos.left, nPos.top + 40 - cPos.top);
                ctx.lineTo(nPos.left + 177.5 - cPos.left, nPos.top + (-15) - cPos.top);
            }else{
                ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
                ctx.lineTo(nPos.left + 85 - cPos.left, nPos.top + (-15) - cPos.top);
            }
        }

        ctx.stroke();
    }

    createChilds(){
        if(this.props.data.childs.length > 0){
            let addPreGhost = false
            let addPostGhost = false
            if( this.props.data.childs.length == 1 ){
                if(this.props.data.num_parents > 0){
                    addPostGhost = true
                }
                else{
                    addPreGhost = true
                }
            }

			return(
				<table>
                    <tbody>
                        <tr>
                            {!addPreGhost ? (null) : (
                                <td>
                                    <div className="node visibility-hidden"></div>
                                </td>
                            )}

                            {this.props.data.childs.map((child_data, index) => {
                                return(
                                    <NodeUp
                                        key={child_data.id}
                                        data={child_data}
                                        handleShowModalAdd={this.props.handleShowModalAdd}
                                        handleShowModalEdit={this.props.handleShowModalEdit}
                                        handleShowInfo={this.props.handleShowInfo}
                                        handleFetchData={this.props.handleFetchData}
                                    />
                                );
                            })}

                            {!addPostGhost ? (null) : (
                                <td>
                                    <div className="node visibility-hidden"></div>
                                </td>
                            )}
                        </tr>
                    </tbody>
				</table>
			);
		}
    }

    createCouple(){
        if (this.props.data.couple_selected == null) {
            return (null)
        } else {
            const dataForEdit = {
                id: this.props.data.couple_selected.id,
                gender: this.props.data.couple_selected.gender,
                name: this.props.data.couple_selected.name,
                surname: this.props.data.couple_selected.surname,
                email: this.props.data.couple_selected.email,
                notes: this.props.data.couple_selected.notes,
                birth: this.props.data.couple_selected.birth,
                death: this.props.data.couple_selected.death,
                timestamp: this.props.data.couple_selected.timestamp
            }
            const dataForAdd = {
                id: this.props.data.couple_selected.id,
                couple_id: this.props.data.id,
                name: this.props.data.couple_selected.name,
                num_parents: this.props.data.couple_selected.num_parents,
                timestamp: this.props.data.couple_selected.timestamp
            }

            dataForEdit.img_path = this.props.data.couple_selected.img_path
            dataForEdit.creator= this.props.data.couple_selected.creator
            const dataForInfo = dataForEdit

            const nameClassForGhost = ((this.props.data.couple_selected.ghost === true)
                ? " non-visible" : "");

            return (
                <div className="node">
                    <img className="person_photo" src={'/static/person_photos/' + this.props.data.couple_selected.img_path}
                        onClick={() => this.props.handleFetchData({method: 'GET', person_id: this.props.couple_selected.data.id})} alt=""/>
                    <div className="content">
                        {this.props.data.couple_selected.name + " " + this.props.data.couple_selected.surname}
                        <span className="node-date">{(this.props.data.couple_selected.birth.year == '' ? 'Desc' : this.props.data.couple_selected.birth.year) + " ‒ " + (this.props.data.couple_selected.death.year == '' ? 'Desc' : this.props.data.couple_selected.death.year)}</span>
                    </div>
                    <img className="icon_img edit_icon" onClick={() => this.props.handleShowModalEdit(dataForEdit)} src="/static/images/edit_icon.png" data-html2canvas-ignore="true"/>
                    <img className="icon_img add_icon" onClick={() => this.props.handleShowModalAdd(dataForAdd)} src="/static/images/add_icon.png" data-html2canvas-ignore="true"/>
                    <img className="icon_img info_icon" onClick={() => this.props.handleShowInfo(dataForInfo)} src="/static/images/info_icon.png" data-html2canvas-ignore="true"/>
                </div>
            );
        }
    }

    render() {
        const dataForEdit = {
                id: this.props.data.id,
                gender: this.props.data.gender,
                name: this.props.data.name,
                surname: this.props.data.surname,
                email: this.props.data.email,
                notes: this.props.data.notes,
                birth: this.props.data.birth,
                death: this.props.data.death,
                timestamp: this.props.data.timestamp
            }
        const dataForAdd = {
                id: this.props.data.id,
                name: this.props.data.name,
                num_parents: this.props.data.num_parents,
                timestamp: this.props.data.timestamp
            }

        if (this.props.data.couple_selected != null){
            dataForAdd.couple_id = this.props.data.couple_selected.id
        }else{
            dataForAdd.couple_id = 0
        }

        dataForEdit.img_path = this.props.data.img_path
        dataForEdit.creator= this.props.data.creator
        const dataForInfo = dataForEdit

        return (
            <td>
                {this.createChilds()}

                <div className="node" id={this.props.data.id}>
                    <img className="person_photo" src={'/static/person_photos/' + this.props.data.img_path}
                        onClick={() => this.props.handleFetchData({method: 'GET', person_id: this.props.data.id})} alt=""/>
                    <div className="content">
                        {this.props.data.name + " " + this.props.data.surname}
                        <span className="node-date">{(this.props.data.birth.year == '' ? 'Desc' : this.props.data.birth.year) + " ‒ " + (this.props.data.death.year == '' ? 'Desc' : this.props.data.death.year)}</span>
                    </div>
                    <img className="icon_img edit_icon" onClick={() => this.props.handleShowModalEdit(dataForEdit)} src="/static/images/edit_icon.png" data-html2canvas-ignore="true"/>
                    <img className="icon_img add_icon" onClick={() => this.props.handleShowModalAdd(dataForAdd)} src="/static/images/add_icon.png" data-html2canvas-ignore="true"/>
                    <img className="icon_img info_icon" onClick={() => this.props.handleShowInfo(dataForInfo)} src="/static/images/info_icon.png" data-html2canvas-ignore="true"/>
                </div>

                {this.createCouple()}
            </td>
        );
    }
}

class NodeDown extends React.Component{
    componentDidUpdate(){
        this.createToCoupleLines()
        this.createToTreesLines()
    }

    createToCoupleLines(){
        if(this.props.data.couple_selected != null){
            const c = document.getElementById("canvas");
            const cPos = $('#canvas').offset()
            const nPos = $('#'+this.props.data.id).offset()
            const ctx = c.getContext("2d");

            ctx.beginPath();
            ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
            ctx.lineTo(nPos.left + 270 - cPos.left, nPos.top + 40 - cPos.top);
            ctx.stroke();
        }
    }

    createToTreesLines(){
        const c = document.getElementById("canvas");
        const cPos = $('#canvas').offset()
        const nPos = $('#'+this.props.data.id).offset()
        const ctx = c.getContext("2d");

        ctx.beginPath();

        //Lines going to the childs
        if(this.props.data.childs.length > 0){
            if(this.props.data.couple_selected != null){
                ctx.moveTo(nPos.left + 177.5 - cPos.left, nPos.top + 40 - cPos.top);
                ctx.lineTo(nPos.left + 177.5 - cPos.left, nPos.top + 95 - cPos.top);
            }else{
                ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
                ctx.lineTo(nPos.left + 85 - cPos.left, nPos.top + 95 - cPos.top);
            }
        }

        //Lines going to the parents
        if(this.props.data.couple_selected != null){
            ctx.moveTo(nPos.left + 177.5 - cPos.left, nPos.top + 40 - cPos.top);
            ctx.lineTo(nPos.left + 177.5 - cPos.left, nPos.top + (-15) - cPos.top);
        }else{
            ctx.moveTo(nPos.left + 85 - cPos.left, nPos.top + 40 - cPos.top);
            ctx.lineTo(nPos.left + 85 - cPos.left, nPos.top + (-15) - cPos.top);
        }

        ctx.stroke();
    }

    computeNewCoupleIdAsString(){
        let result = this.props.data.other_couples.find((value) => {return value.id > ((this.props.data.couple_selected == null) ? (null) : (this.props.data.couple_selected.id))})
        if(result === undefined)
            return '0'

        return result.id.toString()
    }

    createCouple(){
        if (this.props.data.couple_selected == null) {
            return (null)
        } else {
            const dataForEdit = {
                id: this.props.data.couple_selected.id,
                gender: this.props.data.couple_selected.gender,
                name: this.props.data.couple_selected.name,
                surname: this.props.data.couple_selected.surname,
                email: this.props.data.couple_selected.email,
                notes: this.props.data.couple_selected.notes,
                birth: this.props.data.couple_selected.birth,
                death: this.props.data.couple_selected.death,
                timestamp: this.props.data.couple_selected.timestamp
            }
            const dataForAdd = {
                id: this.props.data.couple_selected.id,
                couple_id: this.props.data.id,
                name: this.props.data.couple_selected.name,
                num_parents: this.props.data.couple_selected.num_parents,
                timestamp: this.props.data.couple_selected.timestamp
            }

            dataForEdit.img_path = this.props.data.couple_selected.img_path
            dataForEdit.creator= this.props.data.couple_selected.creator
            const dataForInfo = dataForEdit

            const nameClassForGhost = ((this.props.data.couple_selected.ghost === true)
                ? " non-visible" : "");

            return (
                <div className="node">
                    <img className="person_photo" src={'/static/person_photos/' + this.props.data.couple_selected.img_path}
                        onClick={() => this.props.handleFetchData({method: 'GET', person_id: this.props.couple_selected.data.id})} alt=""/>
                    <div className="content">
                        {this.props.data.couple_selected.name + " " + this.props.data.couple_selected.surname}
                        <span className="node-date">{(this.props.data.couple_selected.birth.year == '' ? 'Desc' : this.props.data.couple_selected.birth.year) + " ‒ " + (this.props.data.couple_selected.death.year == '' ? 'Desc' : this.props.data.couple_selected.death.year)}</span>
                    </div>
                    <img className="icon_img edit_icon" onClick={() => this.props.handleShowModalEdit(dataForEdit)} src="/static/images/edit_icon.png" data-html2canvas-ignore="true"/>
                    <img className="icon_img add_icon" onClick={() => this.props.handleShowModalAdd(dataForAdd)} src="/static/images/add_icon.png" data-html2canvas-ignore="true"/>
                    <img className="icon_img info_icon" onClick={() => this.props.handleShowInfo(dataForInfo)} src="/static/images/info_icon.png" data-html2canvas-ignore="true"/>
                </div>
            );
        }
    }

    createChilds(){
        if(this.props.data.childs.length > 0){

			return(
				<table>
                    <tbody>
                        <tr>
                            {this.props.data.childs.map((child_data, index) => {
                                return(
                                    <NodeDown
                                        key={child_data.id}
                                        data={child_data}
                                        handleShowModalAdd={this.props.handleShowModalAdd}
                                        handleShowModalEdit={this.props.handleShowModalEdit}
                                        handleShowInfo={this.props.handleShowInfo}
                                        handleFetchData={this.props.handleFetchData}
                                    />
                                );
                            })}
                        </tr>
                    </tbody>
				</table>
			);
		}
    }

    render (){
        const dataForEdit = {
                id: this.props.data.id,
                gender: this.props.data.gender,
                name: this.props.data.name,
                surname: this.props.data.surname,
                email: this.props.data.email,
                notes: this.props.data.notes,
                birth: this.props.data.birth,
                death: this.props.data.death,
                timestamp: this.props.data.timestamp
            }
        const dataForAdd = {
                id: this.props.data.id,
                name: this.props.data.name,
                num_parents: this.props.data.num_parents,
                timestamp: this.props.data.timestamp
            }

        if (this.props.data.couple_selected != null){
            dataForAdd.couple_id = this.props.data.couple_selected.id
        }else{
            dataForAdd.couple_id = 0
        }

        dataForEdit.img_path = this.props.data.img_path
        dataForEdit.creator= this.props.data.creator
        const dataForInfo = dataForEdit

        const personId = this.props.data.id
        const newCoupleId = this.computeNewCoupleIdAsString()
        let dictForSwitch = {}
        dictForSwitch[personId.toString()] = newCoupleId

        return (
            <td>

                <div className="node" id={this.props.data.id}>
                    <img className="person_photo" src={'/static/person_photos/' + this.props.data.img_path}
                        onClick={() => this.props.handleFetchData({method: 'GET', person_id: this.props.data.id})} alt=""/>
                    <div className="content">
                        {this.props.data.name + " " + this.props.data.surname}
                        <span className="node-date">{(this.props.data.birth.year == '' ? 'Desc' : this.props.data.birth.year) + " ‒ " + (this.props.data.death.year == '' ? 'Desc' : this.props.data.death.year)}</span>
                    </div>
                    <img className="icon_img edit_icon" onClick={() => this.props.handleShowModalEdit(dataForEdit)} src="/static/images/edit_icon.png" data-html2canvas-ignore="true"/>
                    <img className="icon_img add_icon" onClick={() => this.props.handleShowModalAdd(dataForAdd)} src="/static/images/add_icon.png" data-html2canvas-ignore="true"/>
                    <img className="icon_img info_icon" onClick={() => this.props.handleShowInfo(dataForInfo)} src="/static/images/info_icon.png" data-html2canvas-ignore="true"/>
                    {( (this.props.data.couple_selected == null && this.props.data.other_couples.length <= 0) ? null :
                        <img className="icon_img switch-icon" onClick={() => this.props.handleFetchData({method: 'GET', pairs: dictForSwitch})}
                         src="/static/images/switch_icon.png" data-html2canvas-ignore="true"/>
                    )}
                </div>

                {this.createCouple()}

                {this.createChilds()}
            </td>
        );
    }
}


class EditorManager extends React.Component {
    constructor(props){
        super(props)

        this.state = {token: '', csrfToken: null,
            showModalAdd: false, dataModalAdd:null,
            showModalEdit: false, dataModalEdit:null,
            showInfo: false, dataInfo: null,
            nodesData: null,
            currentTreeId:0, currentGenerations:5, currentDir:'UD', currentPairs:{},
            loadingTree: false,
            reRenderConnectors: false,
        }

        //TODO manage setting currentTreeId generations and pairs the right way
        this.fetchData = this.fetchData.bind(this)
        this.handleChangeGenerations = this.handleChangeGenerations.bind(this);
        this.handleChangeDir = this.handleChangeDir.bind(this);
    }

    componentDidMount(){
        const link_id = parseInt(JSON.parse(document.getElementById('link_id-container').textContent))
        this.setState({currentTreeId: link_id, csrfToken: getCookie('csrftoken')})

        if(link_id > 0)
            this.fetchData({method: 'GET', person_id: link_id})
        else
            this.setError('Raíz del árbol no especificada o incorrecta, cree una nueva persona o vaya a la lista de personas para seleccionar una.')

        this.loadFunctions()

        /*$("#download-tree-button").click(function(){


            var element = document.querySelector("#tree-wrapper")
            html2canvas(element, {windowWidth: element.scrollWidth, windowHeight: element.scrollHeight, allowTaint: true}).then(canvas => {
                document.body.appendChild(canvas)
            });



        });*/
    }

    componentDidUpdate(){
        if(this.state.reRenderConnectors){
            this.drawConnectorLines()
            this.setState({reRenderConnectors: false})
        }
    }

    computeNodeIdsForConnectors(){
        if(this.state.nodesData != null){
            let idsUp = []
            let idsDown = []


            if(this.state.nodesData['up']){
                let queue = []
                queue.push(this.state.nodesData['up'])

                while (queue.length > 0){
                    let node = queue.shift()

                    if(node.childs.length > 0){
                        node.childs.forEach(function (child) {
                            queue.push(child)
                        })

                        idsUp.push({nodeId: node.id, firstChildId: node.childs[0].id, lastChildId: node.childs[node.childs.length-1].id,
                            nodeHasCouple: (node.couple_selected != null), fcHasCouple: (node.childs[0].couple_selected != null), lcHasCouple: (node.childs[node.childs.length-1].couple_selected != null)})
                    }
                }
            }

            if(this.state.nodesData['down']){
                let queue = []
                queue.push(this.state.nodesData['down'])

                while (queue.length > 0){
                    let node = queue.shift()

                    if(node.childs.length > 0){
                        node.childs.forEach(function (child) {
                            queue.push(child)
                        })

                        idsDown.push({nodeId: node.id, firstChildId: node.childs[0].id, lastChildId: node.childs[node.childs.length-1].id,
                            nodeHasCouple: (node.couple_selected != null), fcHasCouple: (node.childs[0].couple_selected != null), lcHasCouple: (node.childs[node.childs.length-1].couple_selected != null)})
                    }
                }
            }


            return {idsUp: idsUp, idsDown: idsDown}
        }
    }

    drawConnectorLines(){
        $("#tree-wrapper").css("transform","scale(1)");

        const ids = this.computeNodeIdsForConnectors()

        if(ids){
            const idsUp = ids.idsUp
            const idsDown = ids.idsDown

            const containerPos = $('#canvas').offset()
            let linesCoords = [] /*x1 y1 x2 y2*/

            idsUp.forEach(function (value) {
                let nodePos = $('#'+value.nodeId).offset()
                let firstChildPos = $('#'+value.firstChildId).offset()
                let lastChildPos = $('#'+value.lastChildId).offset()

                nodePos.top -= 15
                if(value.nodeHasCouple){
                    nodePos.left += 177.5
                }else{
                    nodePos.left += 85
                }

                if(value.fcHasCouple){
                    firstChildPos.left += 177.5
                }else{
                    firstChildPos.left += 85
                }

                if(value.lcHasCouple){
                    lastChildPos.left += 177.5
                }else{
                    lastChildPos.left += 85
                }

                linesCoords.push({x1: (nodePos.left - containerPos.left), y1: (nodePos.top - containerPos.top),
                        x2: (firstChildPos.left - containerPos.left), y2: (nodePos.top - containerPos.top)})
                linesCoords.push({x1: (nodePos.left - containerPos.left), y1: (nodePos.top - containerPos.top),
                        x2: (lastChildPos.left - containerPos.left), y2: (nodePos.top - containerPos.top)})
            })

            idsDown.forEach(function (value) {
                let nodePos = $('#'+value.nodeId).offset()
                let firstChildPos = $('#'+value.firstChildId).offset()
                let lastChildPos = $('#'+value.lastChildId).offset()

                nodePos.top += 80 + 15
                if(value.nodeHasCouple)
                    nodePos.left += 177.5
                else
                    nodePos.left += 85

                if(value.fcHasCouple)
                    firstChildPos.left += 177.5
                else
                    firstChildPos.left += 85

                if(value.lcHasCouple)
                    lastChildPos.left += 177.5
                else
                    lastChildPos.left += 85

                linesCoords.push({x1: nodePos.left - containerPos.left, y1: nodePos.top - containerPos.top,
                        x2: firstChildPos.left - containerPos.left, y2: nodePos.top - containerPos.top})
                linesCoords.push({x1: nodePos.left - containerPos.left, y1: nodePos.top - containerPos.top,
                        x2: lastChildPos.left - containerPos.left, y2: nodePos.top - containerPos.top})
            })

            const c = document.getElementById("canvas");
            const ctx = c.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.beginPath();

            linesCoords.forEach(function(coords, index){
                ctx.moveTo(coords.x1, coords.y1);
                ctx.lineTo(coords.x2, coords.y2);
            })

            ctx.stroke();
        }
    }

    handleChangeGenerations(event) {
        this.setState({[event.target.name]: event.target.value});
        this.fetchData({method: 'GET', generations: event.target.value})
    }

    handleChangeDir(event) {
        this.setState({[event.target.name]: event.target.value});
        this.fetchData({method: 'GET', dir: event.target.value})
    }

    setError(errorText) {
        let e = document.getElementById('error-container')
        const d = new Date()
        e.innerHTML= e.innerHTML + '<p>' + errorText + '<span style="float: right">' + d.getHours()+':'+d.getMinutes()+ '</span></p>'
        e.style.display='block'
    }

    fetchData({method='GET', person_id=this.state.currentTreeId, request_body={}, img_blob=null, pairs={},
                  generations=this.state.currentGenerations, dir=this.state.currentDir, tree_id=this.state.currentTreeId} = {}){
        pairs = Object.assign({}, this.state.currentPairs, pairs)
        this.setState({loadingTree: true, currentPairs: pairs})

        let url = location.origin + '/person/'
        let response_data = ''

        if(method === 'GET'){
            url = url + person_id + '?'
            if(typeof pairs === "object" && Object.keys(pairs).length > 0){
                url = url + '&pairs=' + JSON.stringify(pairs)
            }
            url = url + '&generations=' + generations
            url = url + '&dir=' + dir


            fetch(url, {
                method: method,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => response.json())
                .then(data => {
                    if(!('Error' in data)){
                        this.setState({nodesData: data, currentTreeId: person_id, currentGenerations: generations, currentPairs: pairs, loadingTree: false, reRenderConnectors: true})
                    }else{
                        this.setError(data['Error'])
                        if(data['Error'] == 'Raíz del árbol no especificada, seleccione una en la pantalla de personas') {
                            this.setState({loadingTree: false, nodesData: null, reRenderConnectors: true})
                        }else{
                            this.setState({loadingTree: false})
                        }
                    }
                }
            ).catch(err => {
                this.setError('Error inesperado del servidor, por favor, vuelva a cargar el editor.')
                this.setState({loadingTree: false})
            });

        }
        else if(method === 'PUT'){
            url = url + person_id + '/'
            request_body['tree_id'] = tree_id
            request_body['tree_generations'] = generations
            request_body['tree_dir'] = dir
            request_body['tree_pairs'] = pairs

            let body = new FormData()
            body.append('body', JSON.stringify(request_body))
            if(img_blob !== null){
                body.append('img', img_blob)
            }

            fetch(url, {
                method: method,
                credentials: 'include',
                headers: {
                    'X-CSRFToken': this.state.csrfToken
                },
                body: body
            }).then(response => response.json())
                .then(data => {
                    if(!('Error' in data)){
                        this.setState({nodesData: data, loadingTree: false, reRenderConnectors: true})
                    }else{
                        this.setError(data['Error'])
                        if(data['Error'] == 'Raíz del árbol no especificada, seleccione una en la pantalla de personas') {
                            this.setState({loadingTree: false, nodesData: null, reRenderConnectors: true})
                        }else{
                            this.setState({loadingTree: false})
                        }
                    }
                }
            ).catch(err => {
                this.setError('Error inesperado del servidor, por favor, vuelva a cargar el editor.')
                this.setState({loadingTree: false})
            });
        }
        else if(method === 'POST'){
            request_body['tree_id'] = tree_id
            request_body['tree_generations'] = generations
            request_body['tree_dir'] = dir
            request_body['tree_pairs'] = pairs

            let body = new FormData()
            body.append('body', JSON.stringify(request_body))
            if(img_blob !== null){
                body.append('img', img_blob)
            }


            fetch(url, {
                method: method,
                credentials: 'include',
                headers: {
                    'X-CSRFToken': this.state.csrfToken
                },
                body: body
            }).then(response => response.json())
                .then(data => {
                    if(!('Error' in data)){
                        this.setState({nodesData: data, loadingTree: false, reRenderConnectors: true})
                    }else{
                        this.setError(data['Error'])
                        if(data['Error'] == 'Raíz del árbol no especificada, seleccione una en la pantalla de personas') {
                            this.setState({loadingTree: false, nodesData: null, reRenderConnectors: true})
                        }else{
                            this.setState({loadingTree: false})
                        }
                    }
                }
            ).catch(err => {
                this.setError('Error inesperado del servidor, por favor, vuelva a cargar el editor.')
                this.setState({loadingTree: false})
            });
        }
        else if(method === 'DELETE'){
            url = url + person_id + '/'
            request_body['tree_id'] = tree_id
            request_body['tree_generations'] = generations
            request_body['tree_dir'] = dir
            request_body['tree_pairs'] = pairs

            fetch(url, {
                method: method,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.state.csrfToken
                },
                body: JSON.stringify(request_body)
            }).then(response => response.json())
                .then(data => {
                    if(!('Error' in data)){
                        this.setState({nodesData: data, loadingTree: false, reRenderConnectors: true})
                    }else{
                        this.setError(data['Error'])
                        if(data['Error'] == 'Raíz del árbol no especificada, seleccione una en la pantalla de personas') {
                            this.setState({loadingTree: false, nodesData: null, reRenderConnectors: true})
                        }else{
                            this.setState({loadingTree: false})
                        }
                    }
                }
            ).catch(err => {
                this.setError('Error inesperado del servidor, por favor, vuelva a cargar el editor.')
                this.setState({loadingTree: false})
            });
        }
    }

    loadFunctions(){
          $(".editor-menu-display").click(function(){
              $(".editor-menu").toggle(200);
              $("#editor-menu-display-arrow").css({'transform' : 'rotate('+ 180 +'deg)'});
          });

          $("#more-zoom").click(function(){
              const zoom = getCurrentTreeZoom();
              if(zoom <= 9.9){
                  $("#tree-wrapper").css("transform","scale("+(zoom+0.1).toString()+")");
              }
          });

          $("#less-zoom").click(function(){
              const zoom = getCurrentTreeZoom();
              if(zoom >= 0.2){
                  $("#tree-wrapper").css("transform","scale("+(zoom-0.1).toString()+")");
              }
          });

          $("#1-zoom").click(function(){
              $("#tree-wrapper").css("transform","scale(1)");
          });

          $('#download-tree-button').click(function(){

            html2canvas(document.getElementById('tree-wrapper')).then(canvas => {

                var ctx = canvas.getContext("2d");
                var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var compositeOperation = ctx.globalCompositeOperation;

                ctx.globalCompositeOperation = "destination-over";
                ctx.fillStyle = "#800000";
                ctx.fillRect(0,0,canvas.width,canvas.height);

                var tempCanvas = document.createElement("canvas"),
                tCtx = tempCanvas.getContext("2d");
                tempCanvas.width = $('#parent-tree').width();
                tempCanvas.height = $('#parent-tree').height();
                tCtx.drawImage(canvas,0,0);

                download(tempCanvas, 'MyTree.png')
                //document.body.appendChild(tempCanvas)
            });
          });

          //Make the DIV element draggagle:
          dragElement("tree-wrapper", "tree-draggable-background");
    }

    showModalAdd = (data) => {
        this.setState({ showModalAdd: true, dataModalAdd:data});
    };

    hideModalAdd = () => {
        this.setState({ showModalAdd: false });
    };

    showModalEdit = (data) => {
        this.setState({ showModalEdit: true, dataModalEdit:data});
    };

    hideModalEdit = () => {
        this.setState({ showModalEdit: false });
    };

    showInfo = (data) => {
        this.setState({ showInfo: true, dataInfo:data});
    };

    hideInfo = () => {
        this.setState({ showInfo: false});
    };

    render() {
        const dataForAddButton = {
                id: 0,
                couple_id: 0,
                name: '',
                num_parents: 0
            }

        return (
            <div className="editor-manager-class">
                <LoadingCircle show={this.state.loadingTree}/>
                <ModalAdd show={this.state.showModalAdd} handleHideModal={this.hideModalAdd} data={this.state.dataModalAdd} handleFetchData={this.fetchData}/>
                <ModalEdit show={this.state.showModalEdit} handleHideModal={this.hideModalEdit} data={this.state.dataModalEdit} handleFetchData={this.fetchData}/>

                <EditorMenu show={this.state.showInfo} data={this.state.dataInfo} handleHideInfo={this.hideInfo}/>

                <div className="selectors-menu">
                    <div className="zoom-tool">
                        <img id="more-zoom" height="20" width="20" src='/static/images/add_icon.png' alt=""/>
                        <img id="1-zoom" height="30" width="30" src='/static/images/magnifiyingglass_icon.png' alt=""/>
                        <img id="less-zoom" height="20" width="20" src='/static/images/less_icon.png' alt=""/>
                    </div>
                    <div className="gen-selector">
                        <label>
                                Generaciones: <br/>
                                <input
                                    name="currentGenerations"
                                    type="number"
                                    value={this.state.currentGenerations}
                                    onChange={this.handleChangeGenerations}
                                    min="0"
                                    max="7"
                                />
                        </label>
                    </div>
                    <div className="dir-selector">
                        <label>
                                Mostrar hacia: <br/>
                                <select name="currentDir" value={this.state.currentDir} onChange={this.handleChangeDir}>
                                    <option value="U">Arriba</option>
                                    <option value="D">Abajo</option>
                                    <option value="UD">Arriba y abajo</option>
                                </select>
                        </label>
                    </div>

                    <button id="new-person-button" onClick={() => this.showModalAdd(dataForAddButton)}>Añadir persona sin parientes.</button>
                    <button id="download-tree-button">Descargar imagen del árbol.</button>
                </div>

                <div className="tree-draggable-background">
                    <div id="tree-wrapper">

                        <canvas id="canvas" width="3000" height="3000">
                        </canvas>

                        {this.state.nodesData === null ? ('') :
                            <NodeRoot data={this.state.nodesData} handleShowModalAdd={this.showModalAdd} handleShowModalEdit={this.showModalEdit} handleShowInfo={this.showInfo}
                                           handleFetchData={this.fetchData}/>
                        }

                    </div>
                </div>

            </div>
        );
    }
}

//*************************************************
//*************************************************

ReactDOM.render( <EditorManager /> , document.getElementById('root'));