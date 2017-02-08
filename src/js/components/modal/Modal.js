import React from 'react'
import className from 'style/common/modal/modal.css'
class Modal extends React.Component  {
    constructor(props) {
        super(props)
        this.modalLeaveAnimation = this.modalLeaveAnimation.bind(this)
    }
    modalLeaveAnimation() {
        this.modalBody.className += ' ' + className.modalLeaveAnimation
    }
    render() {
        return(
            <div
                className={className.container}>
                <div
                    ref = {(node)=> this.modalBody = node}
                    className={className.modalBody}
                    style={{width:this.props.width, height:this.props.height}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

Modal.propTypes = {
    children: React.PropTypes.object,
    width: React.PropTypes.string,
    height: React.PropTypes.string,
}
Modal.defaultProps = {
    children: null,
    width: '500px',
    height: '400px',
}


export default Modal
