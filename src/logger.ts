export type Logger = {
  info: (...args: any[]) => void;
  warning: (...args: any[]) => void;
  error: (...args: any[]) => void;
};

export function createLogger(logPrefix: string | null = "[tick-wrap]"): Logger {
  if (logPrefix === null) {
    return {
      info: console.log,
      warning: console.warn,
      error: console.error,
    };
  }
  return {
    info: (...args: any[]) => {
      console.log(logPrefix, ...args);
    },
    warning: (...args: any[]) => {
      console.warn(logPrefix, ...args);
    },
    error: (...args: any[]) => {
      console.error(logPrefix, ...args);
    },
  };
}
