import { DateTime } from 'luxon';

/**
 * @param date {Date}
 * @returns {string}
 */
function getLogTimeString(date: Date): string {
  return DateTime.fromJSDate(date).toFormat('TT');
}

/**
 * @param level {number}
 * @returns {string}
 */
function getLogLevelString(level: number): string {
  switch (level) {
    case 0:
      return 'VBOS';
    case 1:
      return 'DBUG';
    case 2:
      return 'INFO';
    case 3:
      return 'WARN';
    case 4:
      return 'ERRR';
    case 5:
      return 'FTAL';
    default:
      return 'UKNN';
  }
}

/**
 * @param level {number}
 * @returns {string}
 */
function getLogLevelConsoleStyle1(level: number): string {
  let style = 'color: white; background: ';
  switch (level) {
    case 0:
      style += 'darkgray';
      break;

    case 1:
      style += 'gray';
      break;

    case 2:
      style += 'green';
      break;

    case 3:
      style += 'orange';
      break;

    case 4:
      style += 'white; background-color: orangered';
      break;

    case 5:
      style += 'white; background-color: red';
      break;

    default:
      style += 'white; background-color: black';
      break;
  }

  return style;
}

/**
 * @param level {number}
 * @returns {string}
 */
function getLogLevelConsoleStyle2(level: number): string {
  let style = 'color: ';
  switch (level) {
    case 0:
      style += 'darkgray';
      break;

    case 1:
      style += 'gray';
      break;

    case 2:
      style += 'green';
      break;

    case 3:
      style += 'orange';
      break;

    case 4:
      style += 'white; background-color: orangered';
      break;

    case 5:
      style += 'white; background-color: red';
      break;

    default:
      style += 'white; background-color: black';
      break;
  }

  return style;
}

/**
 * @param level {number}
 * @param log {string}
 * @returns {void}
 */
function logToConsole(level: number, log: string): void {
  console.log(
    `%c ${getLogLevelString(level)} %c ${getLogTimeString(new Date())} - ${log}`,
    getLogLevelConsoleStyle1(level),
    getLogLevelConsoleStyle2(level),
  );
}

export default class Logger {
  constructor(level: number) {
    this.level = level;
  }

  public level: number;

  public trace(log: string) {
    this.log(0, log);
  }

  public debug(log: string) {
    this.log(1, log);
  }

  public info(log: string) {
    this.log(2, log);
  }

  public warn(log: string) {
    this.log(3, log);
  }

  public error(log: string) {
    this.log(4, log);
  }

  public fatal(log: string) {
    this.log(5, log);
  }

  public obj(name: string, obj: any) {
    if (2 < this.level) {
      return;
    }

    logToConsole(2, `Inspecting ${name}:`);
    console.log(obj);
  }

  public log(level: number, log: string) {
    if (level < this.level) {
      return;
    }

    logToConsole(level, log);
  }
}
