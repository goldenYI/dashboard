import React from 'react'
import PieGraph from 'components/piegraph/PieGraph'
import className from 'style/containers/panel.css'

import lodash from 'lodash'
class Panel extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            value: 50
        }
    }
    handleOnClick() {
        this.setState({
            value: lodash.random(0,100)
        })
        console.log(this.state.value);
    }
    render() {
        return(
            <div
                onClick={this.handleOnClick.bind(this)}
                className={className.container}>
                <PieGraph
                    value={this.state.value}/>
            </div>
        )
    }
}

export default Panel
