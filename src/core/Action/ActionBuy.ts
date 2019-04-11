import { Action } from "./Action";

export class ActionBuy extends Action {

    private stopLoss: number;
    private isUpTrend: boolean;

    constructor($name: string, $date: Date, $price: number, $index: number, $stopLoss: number, $isUpTrend: boolean) {
        super($name, $date, $price, $index);
		this.stopLoss = $stopLoss;
		this.isUpTrend = $isUpTrend;
	}

    /**
     * Getter $stopLoss
     * @return {number}
     */
	public get $stopLoss(): number {
		return this.stopLoss;
	}
    /**
     * Getter $isUpTrend
     * @return {boolean}
     */
	public get $isUpTrend(): boolean {
		return this.isUpTrend;
	}

    /**
     * Setter $stopLoss
     * @param {number} value
     */
	public set $stopLoss(value: number) {
		this.stopLoss = value;
	}
    /**
     * Setter $isUpTrend
     * @param {boolean} value
     */
	public set $isUpTrend(value: boolean) {
		this.isUpTrend = value;
	}

}