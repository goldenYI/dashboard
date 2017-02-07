import React from 'react'
import ReactModal from 'components/modal/ReactModal'
import Login from 'components/login/Login'
import className from 'style/common/menu/menu.css'
import {autobind} from 'utils'

class Menu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            marginTop: 0,
            modalOpen: false
        }
        autobind([
            'handleModalOpen',
            'handleModalClose'
        ],this)
    }
    handleSelect(num) {
        this.setState({
            marginTop: num * 80,
        })
    }
    handleModalOpen() {
        this.setState({
            modalOpen: true
        })
    }
    handleModalClose() {
        this.setState({
            modalOpen: false
        })
    }
    render() {
        return(
            <div className={className.container}>
                <div
                    className={className.fixbox}
                    style={{marginTop: this.state.marginTop}}
                    ></div>
                <div onClick={this.handleModalOpen} className={className.portrait}><img src={require('assets/common/user.jpg')}/></div>
                <ul className={className.ul}>
                    <li onClick={this.handleSelect.bind(this,0)}><img src={require('assets/home.svg')} /></li>
                    <li onClick={this.handleSelect.bind(this,1)}><img src={require('assets/home.svg')} /></li>
                    <li onClick={this.handleSelect.bind(this,2)}><img src={require('assets/home.svg')} /></li>
                    <li onClick={this.handleSelect.bind(this,3)}><img src={require('assets/home.svg')} /></li>
                    <li onClick={this.handleSelect.bind(this,4)}><img src={require('assets/home.svg')} /></li>
                </ul>
                <ReactModal
                    width={'300px'}
                    height={'400px'}
                    open={this.state.modalOpen}>
                    <Login closeModal={this.handleModalClose}/>
                </ReactModal>
            </div>
        )
    }
}


export default Menu
