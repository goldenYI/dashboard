import React from 'react'
import className from 'style/common/login/login.css'
class Login extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return(
            <div className={className.container}>
                <div className={className.title}>
                    SIGN IN
                </div>
                <div className={className.userPortrait}><img src={require('assets/common/user.jpg')}/></div>
                <from className={className.fromField}>
                    <input type="text" placeholder="Username"/>
                    <input type="text" placeholder="Password"/>
                    <a onClick={this.props.closeModal}>SUBMIT</a>
                </from>
            </div>
        )
    }
}

Login.propTypes = {
    closeModal: React.PropTypes.func,
}

export default Login
