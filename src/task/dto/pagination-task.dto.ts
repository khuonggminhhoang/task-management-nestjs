import { Transform } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class PaginationTaskDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({value}) => value ? parseInt(value) : undefined)
    page ?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(20)
    @Transform(({value}) => value ? parseInt(value) : undefined)
    limit ?: number
}