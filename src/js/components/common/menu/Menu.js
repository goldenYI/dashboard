import React from 'react'

import className from 'style/common/menu/menu.css'
import {autobind} from 'utils'
class Menu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            marginTop: 0
        }
        autobind([
            'handleSelect'
        ],this)
    }
    handleSelect(num) {
        this.setState({
            marginTop: num * 80
        })
    }
    render() {
        return(
            <div className={className.container}>
                <div
                    className={className.fixbox}
                    style={{marginTop: this.state.marginTop}}
                    ></div>
                <div className={className.portrait}><img src={require('assets/common/user.jpg')}/></div>
                <ul className={className.ul}>
                    <li onClick={this.handleSelect.bind(this,0)}><img src={require('assets/home.svg')} /></li>
                    <li onClick={this.handleSelect.bind(this,1)}><img src={require('assets/home.svg')} /></li>
                    <li onClick={this.handleSelect.bind(this,2)}><img src={require('assets/home.svg')} /></li>
                    <li onClick={this.handleSelect.bind(this,3)}><img src={require('assets/home.svg')} /></li>
                    <li onClick={this.handleSelect.bind(this,4)}><img src={require('assets/home.svg')} /></li>
                </ul>

            </div>
        )
    }
}


export default Menu
