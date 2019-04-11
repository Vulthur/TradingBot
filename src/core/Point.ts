export interface PointJSON {
    x: number,
    y: number
}

export class Point {

    private x: number;
    private y: number;

    constructor($x: number, $y: number) {
        this.x = $x;
        this.y = $y;
    }

    public toJson(): PointJSON {
        return ({
            x: this.x,
            y: this.y
        });
    }

    /**
     * Getter $x
     * @return {number}
     */
	public get $x(): number {
		return this.x;
	}
    /**
     * Getter $y
     * @return {number}
     */
	public get $y(): number {
		return this.y;
	}
    /**
     * Setter $x
     * @param {number} value
     */
	public set $x(value: number) {
		this.x = value;
	}
    /**
     * Setter $y
     * @param {number} value
     */
	public set $y(value: number) {
		this.y = value;
    }   
}