import React from 'react'
import * as PIXI from 'pixi.js'
import className from 'style/common/piegraph/piegraph.css'
import {autobind} from 'utils'
import cs from 'classnames'
class PieGraph extends React.Component {
    constructor(props) {
        super(props)
        // auto bind finc
        autobind([
            'createValueAnimation',
            'renderValueCircleUpdate',
            'renderValueCircle',
            'renderBaseCircle',
            'deleteValueAnimation',
            'rendeText',
            'initAnimationFrames',
            'initCanvas',
            'initTextStyle',
            'removeOldText'
        ],this)
        this.state = {
            value: this.props.value,
        }
        this.radius = this.props.radius * 2;
        this.initCanvas()
        this.initTextStyle()
        this.initAnimationFrames()
    }
    componentDidMount() {
        this.canvas.appendChild(this.renderer.view)
        this.renderBaseCircle()
        this.renderValueCircle(this.frames[this.finalFrame])
        this.rendeText()
    }
    componentWillReceiveProps() {
        if (this.state.value != this.props.value) {
            this.deleteValueAnimation()
            this.baseFrame = this.upDateFrame
            this.finalFrame = this.props.value * 5
            this.setState({
                value: this.props.value,
            })
            this.removeOldText()
            this.rendeText()
            this.createValueAnimation()
        }
    }
    /**
     * init canvas
     */
    initCanvas() {
        let regExp=new RegExp(/#([a-z0-9]+$)/i)
        this.backgroundColor =  Number('0x'+this.props.backgroundColor.match(regExp)[1])
        //Setup PIXI Canvas in componentDidMount
        this.renderer =  new PIXI.Application(
            2*this.radius,
            2*this.radius,
            {
                backgroundColor: this.backgroundColor,
                antialias: true
            })
        this.graphics = new PIXI.Graphics()
        // create an array of textureures from an image path
    }
    /**
     * init animation frames array and other variable
     */
    initAnimationFrames() {
        this.frames = []
        for (let i = 0; i <= 500; i++) {
            let val = 1.5 - (i / 500 * 1.5)
            // magically works since the spritesheet was loaded with the pixi loader
            this.frames.push(val)
        }
        this.finalFrame = this.props.value * 5
        this.upDateFrame = this.finalFrame
        this.baseFrame = this.finalFrame
    }
    /**
     * create animation
     */
    createValueAnimation() {
        requestAnimationFrame(this.renderValueCircleUpdate)
    }
    /**
     * delete animation
     */
    deleteValueAnimation() {
        cancelAnimationFrame(this.renderValueCircleUpdate)
    }
    renderValueCircleUpdate() {
        if(this.finalFrame > this.baseFrame) {
            this.upDateFrame += this.props.speed
            if (this.upDateFrame <= this.finalFrame) {
                this.graphics.clear()
                this.renderBaseCircle()
                this.renderValueCircle(this.frames[this.upDateFrame])
                requestAnimationFrame(this.renderValueCircleUpdate)
            }
            else {
                this.renderValueCircle(this.frames[this.finalFrame])
                this.upDateFrame = this.finalFrame
                cancelAnimationFrame(this.renderValueCircleUpdate)
            }
        }
        else if (this.finalFrame < this.baseFrame) {
            this.upDateFrame -= this.props.speed
            if (this.upDateFrame >= this.finalFrame) {
                this.graphics.clear()
                this.renderBaseCircle()
                this.renderValueCircle(this.frames[this.upDateFrame])
                requestAnimationFrame(this.renderValueCircleUpdate)
            }
            else {
                this.renderValueCircle(this.frames[this.finalFrame])
                this.upDateFrame = this.finalFrame
                cancelAnimationFrame(this.renderValueCircleUpdate)
            }
        }
    }
    /**
     * render value circle
     */
    renderValueCircle(value) {
        this.graphics.lineStyle(12, 0x39BBE9, 1)
        this.graphics.moveTo(this.radius, 24);
        this.graphics.arc(this.radius,this.radius,this.radius-24,1.5*Math.PI,value*Math.PI, true)
        this.renderer.stage.addChild(this.graphics)
    }
    /**
     * render base circle
     */
    renderBaseCircle() {
        this.graphics.lineStyle(6, 0x343339, 1)
        this.graphics.drawCircle(this.radius, this.radius,this.radius-3)
        this.graphics.lineStyle(6, 0x39BBE9, 1)
        this.graphics.arc(this.radius, this.radius,this.radius-15, 1.5*Math.PI,0, true)
        this.renderer.stage.addChild(this.graphics)
    }
    /**
     * init text style
     */
    initTextStyle() {
        this.basicTextstyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: this.props.valueFontSize,
            fontStyle: 'italic',
            fill: '#BBBCC1', // gradient
            stroke: '#BBBCC1',
            strokeThickness: 1,
            wordWrap: true,
            wordWrapWidth: 440,
            align: 'center'
        })
        let percentTextstyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: this.props.percentFontSize,
            fontStyle: 'italic',
            fill: '#BBBCC1', // gradient
            stroke: '#BBBCC1',
            strokeThickness: 1,
            wordWrap: true,
            wordWrapWidth: 440,
            align: 'center'
        })
        this.percentText = new PIXI.Text('%', percentTextstyle)
        this.percentText.x = this.radius + this.props.percentOffSetX
        this.percentText.y = this.radius + this.props.percentOffSetY
        this.percentText.anchor.set(0.5, 0.5)
        this.renderer.stage.addChild(this.percentText)
    }
    /**
     * remove old text
     */
    removeOldText() {
        this.renderer.stage.removeChild(this.basicText)
    }
    /**
     * render new text
     */
    rendeText() {
        this.basicText = new PIXI.Text(this.props.value, this.basicTextstyle)
        this.basicText.x = this.radius
        this.basicText.y = this.radius
        this.basicText.anchor.set(0.5, 0.5)
        this.renderer.stage.addChild(this.basicText)
    }
    render() {
        return(
            <div
                className={cs(className.container, this.props.className)}
                style={{
                    width:this.radius * 2,
                    height: this.radius * 2
                }}
                ref={(node) => this.canvas = node}>
            </div>
        )
    }
}

PieGraph.propTypes = {
    className: React.PropTypes.string,
    radius: React.PropTypes.number,
    value: React.PropTypes.number,
    speed: React.PropTypes.number,
    backgroundColor: React.PropTypes.string,
    valueFontSize: React.PropTypes.number,
    percentFontSize: React.PropTypes.number,
    percentOffSetX: React.PropTypes.number,
    percentOffSetY: React.PropTypes.number,
}
PieGraph.defaultProps = {
    className: null,
    radius: 50,
    value: 50,
    speed: 5,
    backgroundColor: '#29292D',
    valueFontSize: 36,
    percentFontSize: 20,
    percentOffSetX: 45,
    percentOffSetY: -5,
}

export default PieGraph
