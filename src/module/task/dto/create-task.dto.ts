import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "helper/status-enum.helper";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    @IsEnum(Status)
    status: string;

    @IsString()
    content: string;

    @IsDate()
    @Transform(({value}) => value ? new Date(value): undefined)
    time_start: Date;

    @IsDate()
    @Transform(({value}) => value ? new Date(value): undefined)
    time_finish: Date;

    @IsOptional()
    @IsNumber()
    parentTaskId: number;

    @IsOptional()
    @IsBoolean()
    deleted: boolean;

    @IsOptional()
    @IsArray()
    @IsNumber({}, {each: true})
    assigned_to: number[];

    @IsOptional()
    @Transform(({value}) => value ? new Date(value): undefined)
    @IsDate()
    createdAt: Date;

    @IsOptional()
    @Transform(({value}) => value ? new Date(value): undefined)
    @IsDate()
    updatedAt: Date;
}