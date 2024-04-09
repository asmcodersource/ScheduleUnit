import React from 'react';
import './Dialog.css'

const Dialog = ({ isOpen,  children }) => {
    if (!isOpen) return null;

   
    return (
        <div className="dialog-wrapper">
            <div className="dialog">
                    {children}
            </div>
        </div>
    );
};

export default Dialog;
