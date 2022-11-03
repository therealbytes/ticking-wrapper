export declare type Logger = {
    info: (...args: any[]) => void;
    warning: (...args: any[]) => void;
    error: (...args: any[]) => void;
};
export declare function createLogger(logPrefix?: string | null, muteList?: string[]): Logger;
