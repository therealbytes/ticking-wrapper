export type Logger = {
  info: (...args: any[]) => void;
  warning: (...args: any[]) => void;
  error: (...args: any[]) => void;
};

function createFilterFunc(muteList: string[]): (...args: any[]) => boolean {
  return (...args: any[]) => {
    if (!args || args.length == 0) {
      return false;
    }
    // return !args.some((arg) => muteList.includes(arg));
    return !muteList.some((muteWord) => args[0].startsWith(muteWord));
  };
}

function createLogFunc(
  logPrefix: string | null,
  consoleFunc: (...args: any[]) => void
): (...args: any[]) => void {
  const logPrefixArray = logPrefix ? [logPrefix] : [];
  return (...args: any[]) => {
    consoleFunc(...logPrefixArray, ...args);
  };
}

function createFilteredLogFunc(
  filterFunc: (...args: any[]) => boolean,
  logFunc: (...args: any[]) => void
) {
  return (...args: any[]) => {
    if (filterFunc(...args)) {
      logFunc(...args);
    }
  };
}

export function createLogger(
  logPrefix: string | null = null,
  muteList: string[] = []
): Logger {
  const filterFunc = createFilterFunc(muteList);
  return {
    info: createFilteredLogFunc(
      filterFunc,
      createLogFunc(logPrefix, console.info)
    ),
    warning: createFilteredLogFunc(
      filterFunc,
      createLogFunc(logPrefix, console.warn)
    ),
    error: createFilteredLogFunc(
      filterFunc,
      createLogFunc(logPrefix, console.error)
    ),
  };
}
