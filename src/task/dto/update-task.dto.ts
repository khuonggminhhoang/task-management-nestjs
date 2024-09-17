import { Transform } from "class-transformer";
import { IsArray, IsDate, IsNumber, IsOptional } from "class-validator";

export class UpdateTaskDto {
    @IsOptional()
    title: string;

    @IsOptional()
    status: string;

    @IsOptional()
    content: string;

    @IsOptional()
    @IsDate()
    @Transform(({value}) => value ? new Date(value): undefined)
    time_start: Date;

    @IsOptional()
    @IsDate()
    @Transform(({value}) => value ? new Date(value): undefined)
    time_finish: Date;

    @IsOptional()
    @IsNumber()
    parentTaskId: number;

    @IsOptional()
    @IsArray()
    @IsNumber({}, {each: true})
    assigned_to: number[];

    @IsOptional()
    @IsArray()
    @IsNumber({}, {each: true})
    removed_from: number[];
} 