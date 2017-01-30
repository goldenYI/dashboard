import React from 'react'
import className from 'style/common/piegraph/piegraph.css'
class PieGraph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isClick: false,
            value: 50
        }
        this.baseValue = this.props.defaultValue
        this.updateValue = this.props.defaultValue
        this.animation = null
    }

    componentDidMount() {

        this.canvas = this.pieGraphCanvas
        this.ctx = this.canvas.getContext('2d')
        this.renderBasePieGraphCanvas()
        this.renderPieGraphCanvas(1.5 - (this.props.defaultValue / 100 * 1.5))
    }
    componentWillReceiveProps() {
        this.renderPieGraphCanvasInterval(this.props.value)
    }
    renderBasePieGraphCanvas() {
        this.ctx.strokeStyle="#343339"
        this.ctx.lineWidth = 6
        this.ctx.beginPath()
        this.ctx.arc(this.props.radius,this.props.radius,this.props.radius-3,0,2*Math.PI)
        this.ctx.stroke()
        this.ctx.strokeStyle="#39BBE9"
        this.ctx.beginPath()
        this.ctx.arc(this.props.radius,this.props.radius,this.props.radius-15,0,1.5*Math.PI)
        this.ctx.stroke()
    }
    renderPieGraphCanvas(value) {
        this.ctx.lineWidth = 14
        this.ctx.strokeStyle="#39BBE9"
        this.ctx.beginPath()
        this.ctx.arc(this.props.radius,this.props.radius,this.props.radius-24,1.5*Math.PI,value*Math.PI, true)
        this.ctx.stroke()
        // 绘制数字
        this.ctx.lineWidth = 3
        let text = this.state.value
        this.ctx.strokeStyle="#BBBCC1"
        this.ctx.fillStyle = '#BBBCC1';
        this.ctx.font = '40px Helvetica';
        this.ctx.textBaseline = 'middle';//设置文本的垂直对齐方式
        this.ctx.textAlign = 'center'; //设置文本的水平对对齐方式
        let textMetrics = this.ctx.measureText(text);
        this.ctx.fillText(text, this.props.radius, this.props.radius)
        this.ctx.strokeText(text, this.props.radius, this.props.radius)
        this.ctx.fillStyle = '#737479';
        this.ctx.font="30px Georgia"
        this.ctx.fillText("%",this.props.radius+40,this.props.radius)
    }
    renderPieGraphCanvasInterval(value) {
        if(!this.state.isClick) {
            this.baseValue = this.state.value
            this.updateValue = this.baseValue
            this.setState({
                isClick: true,
                value: value
            })
            this.animation = setInterval(() => this.renderPieGraphCanvasUpdate(value), 10)
        }
    }
    renderPieGraphCanvasUpdate(value) {
        if(value > this.baseValue) {
            if(this.updateValue < value) {
                this.updateValue += this.props.speed
                this.ctx.clearRect(0,0,this.canvas.width,this.canvas.width);
                this.renderBasePieGraphCanvas()
                this.renderPieGraphCanvas(1.5 - (this.updateValue / 100 * 1.5))
            }
            else {
                clearInterval(this.animation)
                this.setState({
                    isClick: false
                })
            }
        }
        else if(value < this.baseValue) {
            if(this.updateValue > value) {
                this.updateValue -= this.props.speed
                this.ctx.clearRect(0,0,this.canvas.width,this.canvas.width);
                this.renderBasePieGraphCanvas()
                this.renderPieGraphCanvas(1.5 - (this.updateValue / 100 * 1.5))
            }
            else {
                clearInterval(this.animation)
                this.setState({
                    isClick: false
                })
            }
        }
        else {
            clearInterval(this.animation)
            this.setState({
                isClick: false
            })
        }
    }
    render() {
        return(
            <div className={className.container}>
                <canvas
                    width={this.props.radius*2} height={this.props.radius*2}
                    ref={node => this.pieGraphCanvas = node} />
            </div>
        )
    }
}

PieGraph.propTypes = {
    radius: React.PropTypes.number,
    value: React.PropTypes.number,
    speed: React.PropTypes.number,
    defaultValue: React.PropTypes.number,
}
PieGraph.defaultProps = {
    radius: 100,
    defaultValue: 50,
    value: 50,
    speed: 1
}

export default PieGraph
