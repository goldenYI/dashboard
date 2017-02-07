import React from 'react'
import className from 'style/common/modal/modal.css'
import animation from 'style/common/modal/animation.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class Modal extends React.Component  {
    constructor(props) {
        super(props)
        this.state = {
            modal: this.modal,
            display: this.props.open ? 'flex' : 'none'
        }
        this.modal = (<div
            className={className.modalBody}
            style={{width:this.props.width, height:this.props.height}}>
            {this.props.children}
        </div>)
    }
    
    renderModal() {
        return (
            <div
                className={className.modalBody}
                style={{width:this.props.width, height:this.props.height}}>
                {this.props.children}
            </div>
        )
    }
    render() {
        return(
            <div
                className={className.container}>
                <ReactCSSTransitionGroup
                    className={className.modalBodyField}
                    style={{width:this.props.width, height:this.props.height}}
                    transitionAppear={false}
                    transitionLeave={true}
                    transitionAppearTimeout={1300}
                    transitionEnterTimeout={1300}
                    transitionLeaveTimeout={1200}
                    transitionName={{
                        enter: animation.enter,
                        enterActive: animation.enterActive,
                        leave: animation.leave,
                        leaveActive: animation.leaveActive,
                        appear: animation.appear,
                        appearActive: animation.appearActive,
                    }}>
                    <div
                        className={className.modalBody}
                        style={{width:this.props.width, height:this.props.height}}>
                        {this.props.children}
                    </div>
                </ReactCSSTransitionGroup>
                <div className={className.backGround}></div>
            </div>
        )
    }
}

Modal.propTypes = {
    open: React.PropTypes.bool,
    children: React.PropTypes.object,
    width: React.PropTypes.string,
    height: React.PropTypes.string,
}
Modal.defaultProps = {
    open: true,
    children: null,
    width: '500px',
    height: '400px',
}


export default Modal
