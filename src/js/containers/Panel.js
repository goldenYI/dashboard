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
    }
    render() {
        return(
            <div
                onClick={this.handleOnClick.bind(this)}
                className={className.container}>
                <PieGraph
                    speed={7}
                    value={this.state.value}/>
                <PieGraph
                    speed={1}
                    value={this.state.value}/>
            </div>
        )
    }
}

export default Panel
