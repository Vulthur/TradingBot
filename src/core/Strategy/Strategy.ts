import { Action } from "../Action/Action";
import { Graph } from "../Graph";

export interface StrategyJSON {
    name: string,
    leverage: number,
    stopLoss: number,
    pot: number,
    alias: string,
    extended: {}
}

export abstract class Strategy {

    protected name: string;
    protected alias: string;
    protected leverage: number;
    protected stopLoss: number;
    protected pot: number;
    protected resultPot: number;
    protected actions: Array<Action>;
    protected rentability: number;
    protected successRate: number;
    protected graphs: { [name: string]: Graph; };

    constructor($name: string, $leverage: number, $stopLoss: number, $pot: number, $alias: string) {
		this.name = $name;
		this.leverage = $leverage;
		this.stopLoss = $stopLoss;
        this.pot = $pot;
        this.resultPot = $pot;
        this.alias = $alias;
		
        this.actions = [];
		this.graphs = {};
        this.rentability = 0;
        this.successRate = 0;
	}

    public abstract calculate(data: Graph) : boolean;
    public abstract reset() : void;
    public abstract toJsonExtend(): StrategyJSON;
    protected toJson(): StrategyJSON {
        return({
            "name": this.name,
            "leverage": this.leverage,
            "stopLoss": this.stopLoss,
            "pot": this.pot,
            "alias": this.alias,
            "extended": {}
        });
    }

    /**
     * Getter $name
     * @return {string}
     */
	public get $name(): string {
		return this.name;
	}

    /**
     * Getter $alias
     * @return {string}
     */
	public get $alias(): string {
		return this.alias;
	}

    /**
     * Getter $leverage
     * @return {number}
     */
	public get $leverage(): number {
		return this.leverage;
	}

    /**
     * Getter $stopLoss
     * @return {number}
     */
	public get $stopLoss(): number {
		return this.stopLoss;
	}

    /**
     * Getter $pot
     * @return {number}
     */
	public get $pot(): number {
		return this.pot;
	}
    
    /**
     * Getter $resultPot
     * @return {number}
     */
	public get $resultPot(): number {
		return this.resultPot;
	}

    /**
     * Getter $actions
     * @return {Array<Action>}
     */
	public get $actions(): Array<Action> {
		return this.actions;
	}

    /**
     * Getter $rentability
     * @return {number}
     */
	public get $rentability(): number {
		return this.rentability;
	}

    /**
     * Getter $successRate
     * @return {number}
     */
	public get $successRate(): number {
		return this.successRate;
	}
    
    /**
     * Getter $rentability
     * @return {{ [name: string]: Graph; }}
     */
    public get $graphs(): { [name: string]: Graph; } {
		return this.graphs;
	}

    /**
     * Setter $name
     * @param {string} value
     */
	public set $name(value: string) {
		this.name = value;
	}

    /**
     * Setter $alias
     * @param {string} value
     */
	public set $alias(value: string) {
		this.alias = value;
	}

    /**
     * Setter $leverage
     * @param {number} value
     */
	public set $leverage(value: number) {
		this.leverage = value;
	}

    /**
     * Setter $stopLoss
     * @param {number} value
     */
	public set $stopLoss(value: number) {
		this.stopLoss = value;
	}

    /**
     * Setter $pot
     * @param {number} value
     */
	public set $pot(value: number) {
		this.pot = value;
	}

    /**
     * Setter $resultPot
     * @param {number} value
     */
	public set $resultPot(value: number) {
		this.resultPot = value;
	}

    /**
     * Setter $actions
     * @param {Array<Action>} value
     */
	public set $actions(value: Array<Action>) {
		this.actions = value;
	}

    /**
     * Setter $rentability
     * @param {number} value
     */
	public set $rentability(value: number) {
		this.rentability = value;
	}
    
    /**
     * Setter $successRate
     * @param {number} value
     */
	public set $successRate(value: number) {
		this.successRate = value;
	}

    /**
     * Setter $rentability
     * @param {{ [name: string]: Graph; }} graphs
     */
    public set $graphs(graphs: { [name: string]: Graph; }) {
        this.graphs = graphs;
	}

    
}