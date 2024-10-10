import {Module} from "@nestjs/common";
import {LoggingService} from "@/common/logging/logging.service";

@Module({
    providers: [LoggingService],
    exports: [LoggingService]
})

export class LoggingModule {}