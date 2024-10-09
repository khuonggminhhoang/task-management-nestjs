import {Injectable, Logger, LoggerService} from "@nestjs/common";
import * as log4js from "log4js";

@Injectable()
export class CuslogService implements LoggerService {
    private logger: log4js.Logger;

    constructor() {
        log4js.configure({
           appenders: {
               out: { type: "stdout"},
               app: { type: "file", filename: "application.log"}
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

    error(message: any, ...optionalParams: any[]) {
        // throw new Error("Method not implemented.");
    }

    warn(message: any, ...optionalParams: any[]) {
        // throw new Error("Method not implemented.");
    }

    debug?(message: any, ...optionalParams: any[]) {
        // throw new Error("Method not implemented.");
    }

    verbose?(message: any, ...optionalParams: any[]) {
        // throw new Error("Method not implemented.");
    }

    fatal?(message: any, ...optionalParams: any[]) {
        // throw new Error("Method not implemented.");
    }

    // setLogLevels?(levels: LogLevel[]) {
    //     // throw new Error("Method not implemented.");
    // }

}