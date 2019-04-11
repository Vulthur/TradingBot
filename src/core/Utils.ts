export const Utils = {
    convertFormColorToHexColor: function(color: string): number {       
        if (!color.toUpperCase().match(/^#[0-9A-F]{6}$/))
            throw "Incorrect color";

        return parseInt(color.replace("#", "0x"), 16);
    },
    convertHexColorToFormColor: function(color: number): string {
        return "#" + color.toString(16).toUpperCase();
    },
    dateToString: function(date: Date): string {
        return(
             date.getFullYear() + "-" +
            (date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" +
            (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " +
            (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" +
            (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
        );
    },
    round: function(number: number): string {
        return number.toFixed(10);
    }
}