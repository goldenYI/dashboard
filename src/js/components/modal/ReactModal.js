import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'components/modal/Modal'

class ReactModal extends React.Component {
    constructor(props) {
        super(props)
        this.renderModal = this.renderModal.bind(this)
        this.createModalDOM = this.createModalDOM.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.open) {
            console.log('open');
            this.createModalDOM()
        } else {
            console.log('close');
        }
    }
    renderModal() {
        return (<Modal {...this.props}>{this.props.children}</Modal>)
    }
    removeBlur() {
        var others = document.querySelectorAll('body > *');
        [].forEach.call(others, function(elem){
            if(elem.nodeName != 'SCRIPT'){
               //去除模糊效果
               elem.style.webkitFilter = '';
            }
        });
    }
    createBlur() {
        const others = document.querySelectorAll('body > *:not('+className.modalBody+')');
        //遍历nodeList, 如果该元素不是script, 则给该元素添加滤镜
        [].forEach.call(others, function(elem){
            if(elem.nodeName != 'SCRIPT'){
                elem.style.webkitFilter = 'blur(6px)';
            }
        })
    }
    createModalDOM() {
        let modalDiv = document.createElement('div')
        modalDiv.id = 'reactModal'
        document.body.appendChild(modalDiv)
        ReactDOM.render(
            this.renderModal(),
            document.getElementById('reactModal')
        )
    }
    render() {
        return null
    }
}
export default ReactModal
