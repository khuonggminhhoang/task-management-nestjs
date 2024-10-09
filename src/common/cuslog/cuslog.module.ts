import {Logger, Module} from "@nestjs/common";
import {CuslogService} from "@/common/cuslog/cuslog.service";

@Module({
    // imports: [Logger],
    providers: [CuslogService],
    exports: [CuslogService]
})

export class CuslogModule {}