import {IsIn, IsNumber, IsOptional, IsString, Max, Min} from "class-validator";
import {Transform} from "class-transformer";

export class OptionTaskDto {
    @IsOptional()
    @IsString()
    keyword ?: string;

    @IsOptional()
    @IsIn(['title', 'time_start', 'time_finish', 'createdAt'], {message: 'sort by must be title | time_start | time_finish | createdAt.'})
    sortBy ?: 'title' | 'time_start' | 'time_finish' | 'createdAt';
    
    @IsOptional()
    @IsIn(['ASC', 'DESC'], {message: 'order must be ASC or DESC.'})
    order ?: 'ASC' | 'DESC';

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