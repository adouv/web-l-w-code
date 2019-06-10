export enum SoleColor {
    INFO = "#5aa3ff",
    ERROR = "#ff3c21",
    WARN = "#ffdc4f",
}

export class LwConsole {

    static out(str, status: SoleColor = SoleColor.INFO): void {
        // console.info('%c' + str, 'color:' + status);
    }
}
