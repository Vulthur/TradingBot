import { Point } from "./Point";

export class Graph {

    private name: string;
    private points: Array<Point>;
    private color: number;
    private offset: number;

    constructor($name: string, $points: Array<Point>, $color: number, $offset: number) {
		this.name = $name;
		this.points = $points;
		this.color = $color;
        this.offset = $offset;
	}

    /**
     * Getter $name
     * @return {string}
     */
	public get $name(): string {
		return this.name;
	}

    /**
     * Getter $points
     * @return {Array<Point>}
     */
	public get $points(): Array<Point> {
		return this.points;
	}

    /**
     * Getter $color
     * @return {number}
     */
    public get $color(): number {
		return this.color;
	}

    /**
     * Getter $offset
     * @return {number}
     */
    public get $offset(): number {
        return this.offset;
    }

    /**
     * Setter $name
     * @param {string} value
     */
	public set $name(value: string) {
		this.name = value;
	}

    /**
     * Setter $points
     * @param {Array<Point>} value
     */
	public set $points(value: Array<Point>) {
		this.points = value;
	}

    /**
     * Setter $color
     * @param {number} value
     */
	public set $color(value: number) {
		this.color = value;
	}

    /**
     * Setter $offset
     * @param {number} value
     */
	public set $offset(value: number) {
		this.offset = value;
	}

}