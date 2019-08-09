export class Action {

    private name: string;
    private date: Date;
    private index: number;
    private price: number;

	constructor($name: string, $date: Date, $price: number, $index: number) {
		this.name = $name;
		this.date = $date;
		this.price = $price;
		this.index = $index;
	}

    /**
     * Getter $name
     * @return {string}
     */
	public get $name(): string {
		return this.name;
	}

    /**
     * Getter $date
     * @return {Date}
     */
	public get $date(): Date {
		return this.date;
	}

    /**
     * Getter $price
     * @return {number}
     */
	public get $price(): number {
		return this.price;
	}

    /**
     * Getter $index
     * @return {number}
     */
    public get $index(): number {
        return this.index;
    }

    /**
     * Setter $name
     * @param {string} value
     */
	public set $name(value: string) {
		this.name = value;
	}

    /**
     * Setter $date
     * @param {Date} value
     */
	public set $date(value: Date) {
		this.date = value;
	}

    /**
     * Setter $price
     * @param {number} value
     */
	public set $price(value: number) {
		this.price = value;
	}

    /**
     * Setter $index
     * @param {number} value
     */
	public set $index(value: number) {
		this.index = value;
	}
}