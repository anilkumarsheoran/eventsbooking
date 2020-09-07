import React from 'react';
import './Modal.css';


const Modal = (props) => {
    return (
        <div className="modal">
            <div className="modal--header">{props.title}</div>
            <div className="modal--content">
                {props.children}
            </div>
        </div>
    )
}

export default Modal;