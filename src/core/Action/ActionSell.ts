import { Action } from "./Action";

export class ActionSell extends Action {

    private factor: number;
    private isWin: boolean;

    constructor($name: string, $date: Date, $price: number, $index: number, $factor: number, $isWin: boolean) {
        super($name, $date, $price, $index);
		this.factor = $factor;
        this.isWin = $isWin;
	}

    /**
     * Getter $factor
     * @return {number}
     */
	public get $factor(): number {
		return this.factor;
	}
    /**
     * Getter $isWin
     * @return {boolean}
     */
	public get $isWin(): boolean {
		return this.isWin;
	}

    /**
     * Setter $factor
     * @param {number} value
     */
	public set $factor(value: number) {
		this.factor = value;
	}
    /**
     * Setter $isWin
     * @param {boolean} value
     */
	public set $isWin(value: boolean) {
		this.isWin = value;
	}

}