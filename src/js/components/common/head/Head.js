'use strict';

import React from 'react';
import styles from 'style/common/head/index.css'

class CommonHead extends React.Component {
    constructor(props) {
        super(props)
        // 定义 state
        this.state = {};
    }
    // 生命周期方法
    componentWillMount() {}
    componentDidMount() {}
    componentWillUnmount() {}
    onClickSubmit() {
        console.log(123);
    }
    render() {
        return(
            <div className={styles.container}>
                <div className={styles.left}>
                    <img
                        className={styles.logoImg}
                        src={require('assets/common/logo.png')} />
                </div>
                <div className={styles.middle}>
                    <form
                        action=""
                        method="post"
                        id="searchForm"
                        className={styles.formFiled} >
				        <div className={styles.inputFiled} >
					        <input
                                className={styles.searchField}
                                type="text"
                                placeholder="Type to search..."
                                name="search" />
					        <img
                                className={styles.searchImg}
                                src={require('assets/common/search.svg')}
                                onClick={this.onClickSubmit()} />
				        </div>
			        </form>
                    <div className={styles.fillField}></div>
                </div>
                <div className={styles.right}>
                    <img className={styles.userImg} src={require('assets/common/user.jpg')} />
                </div>
            </div>
        );
    }
}

export default CommonHead;
