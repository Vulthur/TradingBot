<template>
    <div id="graph-main">
        <button 
            id="reset"
            @click='drawAll'>
            &#8635;
        </button>
        <canvas 
            @wheel.exact="zoomX"
            @wheel.shift.exact="zoomY"
            @mousedown="mousedownDrag"
            @mouseup="mouseupDrag"
            @mouseleave="mouseupDrag"
            ref="renderCanvas">
        </canvas>
    </div>
</template>

<style scoped>
    canvas {
        width:100%;
        height:100%;
        display: block;
    }
    #graph-main {
        cursor: crosshair;
        width: 78%;
        height: 100%;
        background: #313131;
    }
    #reset {
        position: absolute;
        top: 10px;
        left: 10px;
        color: rgb(252, 252, 252);
        width: 25px;
    }
</style>

<script lang="ts">
    import Vue from "vue";
    import { Graph } from "../../core/Graph";
    import { Point } from "../../core/Point";
    import { Strategy } from "../../core/Strategy/Strategy";
    import { Utils } from "../../core/Utils";
    import { Action } from "../../core/Action/Action";
    import { ActionBuy } from "../../core/Action/ActionBuy";
    import * as PIXI from 'pixi.js';

    export default Vue.extend({
        props : {
            // TODO waiting for commit PropTypes Vue JS
            datas: Object as () => Graph,
            strategys: Array as () => Array<Strategy>,
            hidedStrategy: Array as () => Array<Strategy>,
            currentStrategy: Object as () => Strategy,
            currentAction: Object as () => Action,
        },
        methods: {
            mousedownDrag: function(e: MouseEvent) {
                this.dragging = true;
                this.resetCursor()
                this.clickDragPosition = {
                    x: e.clientX,
                    y: e.clientY,                    
                }
            },
            mouseupDrag: function() {
                this.dragging = false;
            },
            zoomX: function(event: WheelEvent){
                if(this.datas.$points.length > 0){
                    const deltaY = event.deltaY;
                    let flag = false; 
                    
                    if(deltaY < 0){                    
                        this.zoomValX += this.zoomPas;
                        flag = true;
                    } else if (this.zoomValX > this.zoomPas * 2)  {
                        this.zoomValX -= this.zoomPas;
                        flag = true;
                    }
                    if(this.timeOutZoom === -1 && flag){
                        this.resetCursor();
                        this.timeOutZoom = window.setTimeout(() => {
                            this.initDraw();
                            this.drawData();       
                            this.drawStrategys();
                            this.drawCurrentAction();
                            this.timeOutZoom = -1;
                        }, this.timerZoom);      
                    }
                    
                }
            },
            zoomY: function(event: WheelEvent){
                if(this.datas.$points.length > 0){
                    let deltaY = event.deltaY;
                    let flag = false; 
                    if(deltaY > 0){                          
                        this.zoomValY += this.zoomPas;
                        flag = true;
                    } else if(this.zoomValY > -this.ratioY + 0.2){
                        this.zoomValY -= this.zoomPas;
                        flag = true;
                    }
                    if(this.timeOutZoom === -1 && flag){
                        this.resetCursor();
                        this.timeOutZoom = window.setTimeout(() => {
                            this.initDraw();
                            this.drawData();       
                            this.drawStrategys();
                            this.drawCurrentAction();
                            this.timeOutZoom = -1;
                        }, this.timerZoom);      
                    }
                }     
            },
            initDraw(){
                let points: Array<Point> = this.datas.$points;

                let minData = points[0].$y;
                let maxData = points[0].$y

                for (let i = 0; i < points.length; i++) {
                    if (points[i].$y > maxData)
                        maxData = points[i].$y;
                    if (points[i].$y < minData)
                        minData = points[i].$y;
                }
                let rangeData = maxData - minData;
                this.stepX = (this.width / points.length) * this.zoomValX;
                this.offSetRatio = this.height * ((1 - (this.ratioY + this.zoomValY)) / 2);
                this.stepY = (this.height / rangeData);
                this.minValPas = minData * this.stepY;         
            },
            drawAll: function(){
                this.reset();
                this.initDraw();
                if(this.strategys.length){
                    this.drawStrategys();
                }
                this.drawData();
                this.drawCurrentAction();
            },
            reset: function(){
                this.containerMoving.position.x = 0;
                this.containerMoving.position.y = 0;

                this.zoomValX = 1;
                this.zoomValY = 0;
                
                this.resetCursor();
            },
            setCursor(x: number, y: number, textX: string, textY: string){
                this.containerLegend.visible = true;
                this.currentPoint.legendX.text = textX;

                this.currentPoint.legendX.position.set(x + this.containerMoving.position.x, this.height);
                this.currentPoint.bgLengendX.position.set(x + this.containerMoving.position.x, this.height);
                this.currentPoint.lineLegendX.position.set(0, y + this.containerMoving.position.y);
                this.currentPoint.bgLengendX.width = this.currentPoint.legendX.width + 20;
                this.currentPoint.bgLengendX.height = this.currentPoint.legendX.height + 4;

                this.currentPoint.legendY.text = textY;
                this.currentPoint.legendY.position.set(this.width, y + this.containerMoving.position.y);
                this.currentPoint.bgLengendY.position.set(this.width, y + this.containerMoving.position.y);
                this.currentPoint.lineLegendY.position.set(x + this.containerMoving.position.x, 0);
                this.currentPoint.bgLengendY.width = this.currentPoint.legendY.width + 20;
                this.currentPoint.bgLengendY.height = this.currentPoint.legendY.height + 4;
            },
            resetCursor: function() {
                
                this.currentPoint.legendX.text = "";
                this.currentPoint.bgLengendX.width = 0;
                this.currentPoint.lineLegendX;
                this.currentPoint.legendY.text = "";
                this.currentPoint.bgLengendY.width = 0;
                this.currentPoint.lineLegendY;

                this.containerLegend.visible = false;
            },
            drawData: function(){
                this.containerGraph.children = [];

                // Draw Main Graph
                this.drawGraph(this.datas, this.containerGraph, true)

            },
            drawGraph(graph: Graph, container: PIXI.Container, showValue: boolean){

                let points: Array<Point> = graph.$points;

                let curve = new PIXI.Graphics();            
                curve.lineStyle(1, graph.$color, 1);
                curve.moveTo((0 + graph.$offset) * this.stepX, points[0].$y);
                curve.moveTo((0 + graph.$offset) * this.stepX, 
                        ((this.height - (this.stepY * points[0].$y) + this.minValPas) * 
                        (this.ratioY + this.zoomValY) + this.offSetRatio));

                for (let i = 1; i < points.length; i++) {
                    let y = ((this.height - (this.stepY * points[i].$y) + this.minValPas) *
                            (this.ratioY + this.zoomValY) + this.offSetRatio);
                    let x = (i + graph.$offset) * this.stepX;

                    curve.lineStyle(1, graph.$color, 1);
                    curve.lineTo(x, y);

                    if(showValue){

                        let circle = new PIXI.Sprite(this.circleTexture);
                        circle.anchor.set(0.5)
                        circle.hitArea = new PIXI.Circle(0, 0, 2);
                        circle.position.set(x, y);
                        circle.interactive = true;

                        circle.on('mouseover', (e: PIXI.interaction.InteractionEvent) => {
                            if(!this.dragging) {                          
                                let date = new Date(points[i].$x)
                                this.setCursor(x, y, Utils.dateToString(date), points[i].$y.toString())
                                e.currentTarget.scale.set(2)
                            }
                        });
                        circle.on('mouseout', (e: PIXI.interaction.InteractionEvent) => {
                             e.currentTarget.scale.set(1)                         
                        });
                        container.addChild(circle);
                    }
                }
                container.addChild(curve);
            },
            drawStrategys() {
                this.$emit('loading');          
                this.PIXIApp.stop();

                // TODO pixi loop interfering with nextTick function. 
                setTimeout(() => {
                    this.containerStrategy.children = [];
                    this.mapStrategyContainer.clear();

                    // Draw Strategy Graphs
                    for (let i = 0; i < this.strategys.length; i++) {
                        this.strategys[i].reset();
                        this.strategys[i].calculate(this.datas);
                        
                        // Don't draw hided strat !
                        if(this.hidedStrategy.indexOf(this.strategys[i]) === -1){

                            let containerStrat = new PIXI.Container();

                            for (let j = 0; j < this.strategys[i].$actions.length; j++) {
                                if(this.strategys[i].$actions[j] instanceof ActionBuy){

                                    let actionBuy = this.strategys[i].$actions[j] as ActionBuy;
                                    let rectangle = new PIXI.Sprite(this.rectangleTexture);
                                    rectangle.anchor.set(0.5)
                                    
                                    if(actionBuy.$isUpTrend){
                                        rectangle.tint = 0x00EE00;
                                        rectangle.position.set(
                                            actionBuy.$index * this.stepX,
                                            ((this.height - (this.stepY * actionBuy.$price) + this.minValPas) *
                                            (this.ratioY + this.zoomValY) + this.offSetRatio) + 30
                                        );
                                    } else {
                                        rectangle.tint = 0xEE0000;
                                        rectangle.position.set(
                                            actionBuy.$index * this.stepX,
                                            ((this.height - (this.stepY * actionBuy.$price) + this.minValPas) *
                                            (this.ratioY + this.zoomValY) + this.offSetRatio) - 30
                                        );
                                    }
                                    containerStrat.addChild(rectangle);
                                }
                            }
                        
                            for(let strat in this.strategys[i].$graphs){             
                                this.drawGraph(this.strategys[i].$graphs[strat], containerStrat, false);
                            }

                            if(this.currentStrategy === this.strategys[i]){
                                containerStrat.alpha = 1;
                            } else {
                                containerStrat.alpha = 0.25;
                            }

                            this.containerStrategy.addChild(containerStrat);
                            this.mapStrategyContainer.set(this.strategys[i], containerStrat);
                        }
                    }
                    
                    this.PIXIApp.start();    
                    this.$emit('endLoading');
                }, 0); 
            },
            drawCurrentAction() {
                this.containerAction.children = [];
                
                if(this.currentAction instanceof Action){
                    let y = ((this.height - (this.stepY * this.currentAction.$price) + this.minValPas) *
                            (this.ratioY + this.zoomValY) + this.offSetRatio);
                    let x = (this.currentAction.$index + this.datas.$offset) * this.stepX;

                    let circle = new PIXI.Sprite(this.circleTexture);
                    circle.anchor.set(0.5);            
                    circle.tint = 0x0494FB;
                    circle.position.set(x, y);
                    circle.scale.set(2)
                    this.containerAction.addChild(circle);
                }
            }
        },
        data() {
            return { 
                zoomValX: 1,
                zoomValY: 0,
                zoomPas: 0.1,
                timeOutZoom: -1,
                timerZoom: 300,
                clickDragPosition: {x: 0, y: 0},
                PIXIApp: {} as PIXI.Application,
                width: 0,
                height: 0,
                ratioY: 0.9,
                dragging: false,
                currentPoint: {
                    legendX: new PIXI.Text("") as PIXI.Text,
                    bgLengendX: new PIXI.Sprite(PIXI.Texture.WHITE) as PIXI.Sprite,
                    lineLegendX: new PIXI.Sprite(PIXI.Texture.WHITE) as PIXI.Sprite,
                    legendY: new PIXI.Text("") as PIXI.Text,
                    bgLengendY: new PIXI.Sprite(PIXI.Texture.WHITE) as PIXI.Sprite,
                    lineLegendY: new PIXI.Sprite(PIXI.Texture.WHITE) as PIXI.Sprite,
                }, 
                containerGraph: new PIXI.Container() as PIXI.Container,
                containerStrategy: new PIXI.Container() as PIXI.Container,
                containerMoving: new PIXI.Container() as PIXI.Container,
                containerLegend: new PIXI.Container() as PIXI.Container,
                containerAction: new PIXI.Container() as PIXI.Container,
                styleText: new PIXI.TextStyle({
                    fontFamily: 'Calibri',
                    fontSize: 11,
                    fill: ['#FCFCFC'],
                    stroke: '#FCFCFC',
                }) as PIXI.TextStyle,
                strategysBeforeChange: [] as Array<Strategy>,
                stepX: 0,
                stepY: 0,
                offSetRatio: 0,
                minValPas: 0,
                circleTexture: {} as PIXI.Texture,
                rectangleTexture: {} as PIXI.Texture,
                mapStrategyContainer: new Map(),
            }
        },
        mounted() {

            // CANVAS
            const renderCanvas = <HTMLCanvasElement> this.$refs.renderCanvas;

            this.width = renderCanvas.offsetWidth;
            this.height = renderCanvas.offsetHeight;

            // Create a new PIXI app.
            this.PIXIApp = new PIXI.Application(
                this.width,
                this.height, {
                    view: renderCanvas,
                    backgroundColor: 0x313131,
                    antialias: true,
                }
            );
            this.PIXIApp.stage.pivot = new PIXI.Point(this.width / 2, this.height / 2);
            this.PIXIApp.stage.position = new PIXI.Point(this.width / 2, this.height / 2);
   
            // Moving with the mouse
            this.containerMoving.interactive = true;
            this.containerMoving.on('mousemove', (e: PIXI.interaction.InteractionEvent) => {
                if(this.dragging){
                    
                    var clickPosition = e.data.getLocalPosition(this.PIXIApp.stage);
                    let x = clickPosition.x - this.clickDragPosition.x
                    let y = clickPosition.y - this.clickDragPosition.y
                    
                    this.containerMoving.position.x += x;
                    this.containerMoving.position.y += y;

                    this.clickDragPosition.x = clickPosition.x;
                    this.clickDragPosition.y = clickPosition.y;
                }
            });

            // Generating texture 
            let circle = new PIXI.Graphics();
            circle.lineStyle(0);
            circle.beginFill(0xFFFFFF);
            circle.drawCircle(0, 0, 2);
            circle.endFill();
            this.circleTexture = this.PIXIApp.renderer.generateTexture(circle);

            let rectangle = new PIXI.Graphics();
            rectangle.lineStyle(0);
            rectangle.beginFill(0xFFFFFF);
            rectangle.drawRect(0, 0, 2, 30);
            rectangle.endFill();
            this.rectangleTexture = this.PIXIApp.renderer.generateTexture(rectangle);

            // Init legend
            this.currentPoint.legendX.style = this.styleText;
            this.currentPoint.legendX.anchor.set(0.5, 1.2);
            this.currentPoint.bgLengendX.anchor.set(0.5, 1);
            this.currentPoint.bgLengendX.tint = 0x1E1E1E;
            this.currentPoint.lineLegendX.height = 1;
            this.currentPoint.lineLegendX.width = this.width;
            this.currentPoint.lineLegendX.alpha = 0.4;

            this.currentPoint.legendY.style = this.styleText;
            this.currentPoint.legendY.anchor.set(1.2, 0.5);
            this.currentPoint.bgLengendY.anchor.set(1, 0.5);
            this.currentPoint.bgLengendY.tint = 0x1E1E1E;
            this.currentPoint.lineLegendY.height = this.height;
            this.currentPoint.lineLegendY.width = 1;
            this.currentPoint.lineLegendY.alpha = 0.4;

            this.containerLegend.visible = false;

            // Container managing
            this.containerLegend.addChild(this.currentPoint.lineLegendY);
            this.containerLegend.addChild(this.currentPoint.lineLegendX);
            
            this.containerLegend.addChild(this.currentPoint.bgLengendX);
            this.containerLegend.addChild(this.currentPoint.bgLengendY);

            this.containerLegend.addChild(this.currentPoint.legendX);
            this.containerLegend.addChild(this.currentPoint.legendY);
            
            this.containerMoving.addChild(this.containerStrategy);
            this.containerMoving.addChild(this.containerGraph);
            this.containerMoving.addChild(this.containerAction);
            this.PIXIApp.stage.addChild(this.containerMoving);
            this.PIXIApp.stage.addChild(this.containerLegend);
        },
        watch: {
            datas: { 
                handler() {
                    this.drawAll();
                },
                deep: true
            },
            strategys: {
                handler() {

                    // TODO only redraw the good strat
                    //console.log(this.strategysBeforeChange, newStrategys);     
                    // if(this.strategysBeforeChange[1] && newStrategys[1]){
                    //     // console.log(this.strategysBeforeChange[0] === newStrategys[0]);
                    //     // console.log(this.strategysBeforeChange[1] === newStrategys[1]);
                    // }
                    // this.strategysBeforeChange = newStrategys.slice();
                    if(this.datas.$points.length !== 0){
                        this.drawStrategys();
                    }
                },
            },
            hidedStrategy: {
                handler() {
                    for (let i = 0; i < this.strategys.length; i++) {
                        let container = this.mapStrategyContainer.get(this.strategys[i]);
                        if(container){
                            if(this.hidedStrategy.indexOf(this.strategys[i]) === -1){
                                container.visible = true;
                            } else {
                                container.visible = false;
                            }
                        }
                    }
                }
            },
            currentStrategy: {
                handler(strategy: Strategy) {                    
                    for (let i = 0; i < this.strategys.length; i++) {
                        let container = this.mapStrategyContainer.get(this.strategys[i]);
                        if(container){
                            if(strategy === this.strategys[i]){
                                container.alpha = 1;
                            } else {
                                container.alpha = 0.25;
                            }
                        }
                    }            
                }
            },
            currentAction: {
                handler(action: Action) {                    
                    this.drawCurrentAction();
                },
            }
        }
    });
</script>

