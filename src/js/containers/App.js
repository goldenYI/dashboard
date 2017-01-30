'use strict';

import React from 'react';
import Menu from 'components/common/menu/Menu'
import className from 'style/containers/app.css'
import Panel from 'containers/Panel'
class App extends React.Component {
    constructor(props) {
        super(props);
        // 定义 state
        this.state = {};
    }
    // 生命周期方法
    componentWillMount() {}
    componentDidMount() {}
    componentWillUnmount() {}

    render() {
        return(
            <div className={className.container}>
                <Menu />
                <Panel />
            </div>
        );
    }
}

export default App;
