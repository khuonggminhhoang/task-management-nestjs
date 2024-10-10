import {Injectable, LoggerService} from "@nestjs/common";
import * as log4js from "log4js";

@Injectable()
export class LoggingService implements LoggerService {
    private logger: log4js.Logger;

    constructor() {
        log4js.configure({
           appenders: {
               out: { type: "stdout"},
               app: { type: "file", filename: "./log/app.log"}
           },
            categories: {
               default: { appenders: ["out", "app"], level: "debug"}
            }
        });

        this.logger = log4js.getLogger();

    }

    log(message: any, ...optionalParams: any[]) {
        this.logger.log(message, optionalParams);
    }

    error(message: any, trace: string, ...optionalParams: any[]) {
        this.logger.error(message, trace, optionalParams);
    }

    warn(message: any, ...optionalParams: any[]) {
        this.logger.warn(message, ...optionalParams);
    }

    debug?(message: any, ...optionalParams: any[]) {
        this.logger.debug(message, ...optionalParams);
    }

    verbose?(message: any, ...optionalParams: any[]) {
        this.logger.info(message, ...optionalParams);
    }

    fatal?(message: any, ...optionalParams: any[]) {
        this.logger.fatal(message, ...optionalParams);
    }

    // setLogLevels?(levels: LogLevel[]) {
    //     // throw new Error("Method not implemented.");
    // }

}