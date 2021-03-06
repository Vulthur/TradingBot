import { Point } from "../Point";
import { Action } from "../Action/Action";
import { Strategy, StrategyJSON } from "./Strategy";

export interface StrategyJSONTest {
    "test": string
}
export const aliasTest: string = "Test";
export function jsonToStrategyTest($json: StrategyJSON): StrategyTest {
    let extended = $json.extended as StrategyJSONTest
    return (
        new StrategyTest(
            $json.name,
            $json.leverage,
            $json.stopLoss,
            $json.pot,
            extended.test,
        )
    )
};

export class StrategyTest extends Strategy {

    private test: string;

    constructor($name: string, $leverage: number, $stopLoss: number, $pot: number, $test: string) {
        super($name, $leverage, $stopLoss, $pot, aliasTest, 10);
        this.test = $test;
    }

    public reset(): void {
    }

    public simulate(data: Array<Point>): boolean {
        return true;
    }
    
    public calculate(data: Array<Point>, nbNewData: number): Array<Action> | null {
        return null;
    }

    public toJsonExtend(): StrategyJSON {
        let json = this.toJson();
        let extented: StrategyJSONTest;
        extented = {
            "test": this.test,
        }
        json.extended = extented;
        return (json);
    }

    /**
     * Getter $test
     * @return {string}
     */
	public get $test(): string {
		return this.test;
	}

    /**
     * Setter $test
     * @param {string} value
     */
	public set $test(value: string) {
		this.test = value;
	}
}