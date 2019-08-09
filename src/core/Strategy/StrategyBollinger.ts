import { Graph } from "../Graph";
import { Point } from "../Point";
import { Strategy, StrategyJSON } from "./Strategy";
import { Action } from "../Action/Action";
import { ActionBuy } from "../Action/ActionBuy";
import { ActionSell } from "../Action/ActionSell";

export class StrategyBollinger extends Strategy {

    private SMAlength: number;
    private factorStandardDeviation: number;
    private colorBB: number;
    private colorSMA: number;

    constructor($name: string, $leverage: number, $stopLoss: number, $pot: number, $SMAlength: number,
            $factorStandardDeviation: number, $colorSMA?: number, $colorBB?: number) {

        super($name, $leverage, $stopLoss, $pot, aliasBollinger, $SMAlength);
        
        this.SMAlength = $SMAlength;
        this.factorStandardDeviation = $factorStandardDeviation;
        this.colorSMA = $colorSMA ? $colorSMA : 0x000000;
        this.colorBB = $colorBB ? $colorBB : 0xFFFFFF;

        this.graphs['GraphSma'] = new Graph("Graph SMA", new Array<Point>(), this.colorSMA, this.SMAlength - 1);
        this.graphs['GraphBollingerTop'] = new Graph("Graph Bollinger Top", new Array<Point>(), this.colorBB, this.SMAlength - 1);
        this.graphs['GraphBollingerBot'] = new Graph("Graph Bollinger Bot", new Array<Point>(), this.colorBB, this.SMAlength - 1);
	}

    public reset(): void {
        this.graphs['GraphSma'] = new Graph("Graph SMA", new Array<Point>(), this.colorSMA, this.SMAlength - 1);
        this.graphs['GraphBollingerTop'] = new Graph("Graph Bollinger Top", new Array<Point>(), this.colorBB, this.SMAlength - 1);
        this.graphs['GraphBollingerBot'] = new Graph("Graph Bollinger Bot", new Array<Point>(), this.colorBB, this.SMAlength - 1);
        this.actions = [];
        this.resultPot = this.pot;
        this.trade = 0;
        this.tradeWon = 0;
    }

    public simulate(data: Array<Point>) : boolean {
        if (data.length < this.SMAlength){
            return false;
        }

        let lastTrend = null;
        let lastStopLoss = 0;

        // Loop through data
        for (let i = this.SMAlength - 1; i < data.length; i++) {
            
            let sumSMA = 0;
            for (var j = i - (this.SMAlength - 1); j <= i; j++) {
                sumSMA += data[j].$y;
            }
            let sma = sumSMA / this.SMAlength;

            // Ecart type
            let sumStandardDev = 0;
            for (var j = i - (this.SMAlength - 1); j <= i; j++) {
                sumStandardDev += Math.pow((data[j].$y - sma), 2);
            }

            // Variance
            let variance = Math.sqrt(sumStandardDev / this.SMAlength);
       
            let valueBBBot = sma - variance * this.factorStandardDeviation;
            let valueBBTop = sma + variance * this.factorStandardDeviation;
            
            this.graphs['GraphSma'].$points.push(new Point(data[i].$x, sma));
            this.graphs['GraphBollingerTop'].$points.push(new Point(data[i].$x, valueBBTop));
            this.graphs['GraphBollingerBot'].$points.push(new Point(data[i].$x, valueBBBot));

            // - ACTIONS -
            // StopLoss
            if ((lastTrend === false && lastStopLoss < data[i].$y) ||
                    (lastTrend === true && lastStopLoss > data[i].$y)) {

                this.addStopLoss(data[i], lastStopLoss, i);
                lastTrend = null;
            }

            // DownTrend
            if (data[i].$y < valueBBBot && (lastTrend === true || lastTrend === null)) {

                this.trade++;
                let date = new Date(data[i].$x);
                lastStopLoss = data[i].$y * (1 + (this.$stopLoss / 100))

                // First buy
                if (lastTrend === null) {
                    let actionBuy = new ActionBuy("Buy", date, data[i].$y, i, lastStopLoss, false);
                    this.actions.push(actionBuy);
                } else {

                    let factor = data[i].$y / this.actions[this.actions.length - 1].$price;
                    this.resultPot = this.resultPot * (this.leverage * (factor - 1) + 1)

                    let isWin = false;
                    if (factor > 1) {
                        isWin = true;
                        this.tradeWon++;
                    }

                    // Selling
                    let actionSell = new ActionSell("Sell", date, data[i].$y, i, factor, isWin);
                    this.actions.push(actionSell);

                    // Directly go with a upTrend
                    let actionBuy = new ActionBuy("Buy", date, data[i].$y, i, lastStopLoss, false);
                    this.actions.push(actionBuy);
                }
                lastTrend = false;
            }

            // UpTrend
            if (data[i].$y > valueBBTop && (lastTrend === false || lastTrend === null)) {

                this.trade++;
                let date = new Date(data[i].$x);
                lastStopLoss = data[i].$y * (1 - (this.$stopLoss / 100));

                // First buy
                if (lastTrend === null) {
                    let actionBuy = new ActionBuy("Buy", date, data[i].$y, i, lastStopLoss, true);
                    this.actions.push(actionBuy);
                } else {

                    let factor = 1 / (data[i].$y / this.actions[this.actions.length - 1].$price);
                    this.resultPot = this.resultPot * (this.leverage * (factor - 1) + 1);

                    let isWin = false;
                    if (factor > 1) {
                        isWin = true;
                        this.tradeWon++;
                    }

                    // Selling
                    let actionSell = new ActionSell("Sell", date, data[i].$y, i, factor, isWin);
                    this.actions.push(actionSell);

                    // Directly go with a downTrend
                    let actionBuy = new ActionBuy("Buy", date, data[i].$y, i, lastStopLoss, true);
                    this.actions.push(actionBuy);
                }
                lastTrend = true;
            }
        }

        // Calculate end process
        this.rentability = (this.resultPot - this.pot) / this.pot * 100;
        this.successRate = (this.tradeWon / this.trade) * 100;

        // Strategy finished
        return true;
    }

    public calculate(data: Array<Point>, nbNewData: number): Array<Action> | null {
        // Controls
        if (data.length < this.SMAlength || nbNewData <= 0) {
            return null;
        }

        let lastIndex = data.length - nbNewData;

        // Define last trend
        let lastTrend = null;
        let lastAction: Action = this.actions[this.actions.length - 1];
        if (lastAction !== undefined || (lastAction as Action) instanceof ActionBuy) {
            lastTrend = (lastAction as ActionBuy).$isUpTrend;
        }

        let newAction: Array<Action> = [];

        // Loop through data
        for (let i = lastIndex; i < data.length; i++) {

            let sumSMA = 0;
            for (var j = i - (this.SMAlength - 1); j <= i; j++) {
                sumSMA += data[j].$y;
            }
            let sma = sumSMA / this.SMAlength;

            // Ecart type
            let sumStandardDev = 0;
            for (var j = i - (this.SMAlength - 1); j <= i; j++) {
                sumStandardDev += Math.pow((data[j].$y - sma), 2);
            }

            // Variance
            let variance = Math.sqrt(sumStandardDev / this.SMAlength);

            let valueBBBot = sma - variance * this.factorStandardDeviation;
            let valueBBTop = sma + variance * this.factorStandardDeviation;

            this.graphs['GraphSma'].$points.push(new Point(data[i].$x, sma));
            this.graphs['GraphBollingerTop'].$points.push(new Point(data[i].$x, valueBBTop));
            this.graphs['GraphBollingerBot'].$points.push(new Point(data[i].$x, valueBBBot));

            // - ACTIONS -
            // DownTrend
            if (data[i].$y < valueBBBot && (lastTrend === true || lastTrend === null)) {

                this.trade++;
                let date = new Date(data[i].$x);
                let lastStopLoss = data[i].$y * (1 + (this.$stopLoss / 100))

                // First buy
                if (lastTrend === null) {
                    let actionBuy = new ActionBuy("Buy", date, data[i].$y, i, lastStopLoss, false);
                    this.actions.push(actionBuy);
                    newAction.push(actionBuy);
                } else {

                    let factor = data[i].$y / this.actions[this.actions.length - 1].$price;
                    this.resultPot = this.resultPot * (this.leverage * (factor - 1) + 1)

                    let isWin = false;
                    if (factor > 1) {
                        isWin = true;
                        this.tradeWon++;
                    }

                    // Selling
                    let actionSell = new ActionSell("Sell", date, data[i].$y, i, factor, isWin);
                    this.actions.push(actionSell);
                    newAction.push(actionSell);

                    // Directly go with a upTrend
                    let actionBuy = new ActionBuy("Buy", date, data[i].$y, i, lastStopLoss, false);
                    this.actions.push(actionBuy);
                    newAction.push(actionBuy);
                }
                lastTrend = false;
            }

            // UpTrend
            if (data[i].$y > valueBBTop && (lastTrend === false || lastTrend === null)) {

                this.trade++;
                let date = new Date(data[i].$x);
                let lastStopLoss = data[i].$y * (1 - (this.$stopLoss / 100));

                // First buy
                if (lastTrend === null) {
                    let actionBuy = new ActionBuy("Buy", date, data[i].$y, i, lastStopLoss, true);
                    this.actions.push(actionBuy);
                    newAction.push(actionBuy);
                } else {

                    let factor = 1 / (data[i].$y / this.actions[this.actions.length - 1].$price);
                    this.resultPot = this.resultPot * (this.leverage * (factor - 1) + 1);

                    let isWin = false;
                    if (factor > 1) {
                        isWin = true;
                        this.tradeWon++;
                    }

                    // Selling
                    let actionSell = new ActionSell("Sell", date, data[i].$y, i, factor, isWin);
                    this.actions.push(actionSell);
                    newAction.push(actionSell);

                    // Directly go with a downTrend
                    let actionBuy = new ActionBuy("Buy", date, data[i].$y, i, lastStopLoss, true);
                    this.actions.push(actionBuy);
                    newAction.push(actionBuy);
                }
                lastTrend = true;
            }
        }

        // Calculate end process
        this.rentability = (this.resultPot - this.pot) / this.pot * 100;
        this.successRate = (this.tradeWon / this.trade) * 100;

        return (newAction);
    }

    public addStopLoss(point: Point, valueSL: number, index: number){

        if (this.actions[this.actions.length - 1] === undefined ||
                this.actions[this.actions.length - 1] instanceof ActionSell){
            return
        }

        let lastAction = this.actions[this.actions.length - 1] as ActionBuy;
        let date = new Date(point.$x);
        let factor;

        if (lastAction.$isUpTrend === false) {
            // StopLoss Up
            factor = 1 / (valueSL / lastAction.$price);
        } else {
            // StopLoss Down
            factor = valueSL / this.actions[this.actions.length - 1].$price;
        }

        // Selling
        let actionSell = new ActionSell("Sell SL", date, point.$y, index, factor, false);
        this.actions.push(actionSell);
        this.resultPot = this.resultPot * (this.leverage * (factor - 1) + 1)
    }

    public toJsonExtend(): StrategyJSON {
        let json = this.toJson();
        let extended: StrategyJSONBollinger = {
            "SMAlength": this.SMAlength,
            "factorStandardDeviation": this.factorStandardDeviation,
            "colorSMA": this.colorSMA,
            "colorBB": this.colorBB,
        }
        json.extended = extended;
        return (json);
    }

    /**
     * Getter $SMAlength
     * @return {number}
     */
	public get $SMAlength(): number {
		return this.SMAlength;
	}

    /**
     * Getter $factorStandardDeviation
     * @return {number}
     */
	public get $factorStandardDeviation(): number {
		return this.factorStandardDeviation;
	}

    /**
     * Getter $colorBB
     * @return {number}
     */
	public get $colorBB(): number {
		return this.colorBB;
	}

    /**
     * Getter $colorSMA
     * @return {number}
     */
	public get $colorSMA(): number {
		return this.colorSMA;
	}

    /**
     * Setter $SMAlength
     * @param {number} value
     */
	public set $SMAlength(value: number) {
		this.SMAlength = value;
	}

    /**
     * Setter $factorStandardDeviation
     * @param {number} value
     */
	public set $factorStandardDeviation(value: number) {
		this.factorStandardDeviation = value;
	}

    /**
     * Setter $colorBB
     * @param {number} value
     */
	public set $colorBB(value: number) {
		this.colorBB = value;
	}

    /**
     * Setter $colorSMA
     * @param {number} value
     */
	public set $colorSMA(value: number) {
		this.colorSMA = value;
	}

}

export const aliasBollinger: string = "BollingerBand";
export interface StrategyJSONBollinger {
    SMAlength: number,
    factorStandardDeviation: number,
    colorSMA: number,
    colorBB: number
};
export function jsonToStrategyBollinger($json: StrategyJSON): StrategyBollinger {
    let extended = $json.extended as StrategyJSONBollinger
    return (
        new StrategyBollinger(
            $json.name,
            $json.leverage,
            $json.stopLoss,
            $json.pot,
            extended.SMAlength,
            extended.factorStandardDeviation,
            extended.colorSMA,
            extended.colorBB
        )
    )
};