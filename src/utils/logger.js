// tslint:disable: no-console
import safeStringify from 'fast-safe-stringify';

function prepareLog(meta, output) {
  return (...args) => {
    const logObj = args.reduce((acc, log, index) => {
      acc[`log${index || ''}`] = log;

      return acc;
    }, {});

    output(safeStringify({ ...meta, ...logObj }));
  };
}

export function createLogger(meta = {}, initialLoger = console) {
  const loggerMeta = { ...meta };

  return {
    debug: prepareLog(loggerMeta, initialLoger.debug),
    error: prepareLog(loggerMeta, initialLoger.error),
    info: prepareLog(loggerMeta, initialLoger.info),
    warn: prepareLog(loggerMeta, initialLoger.warn),
    extend(extendedMeta) {
      return createLogger({ ...loggerMeta, extendedMeta }, initialLoger);
    },
  };
}

export default createLogger();
