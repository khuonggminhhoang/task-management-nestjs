import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    full_name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsBoolean()
    gender: boolean;

    @IsOptional()
    @IsBoolean()
    deleted: boolean;
    
    @IsOptional()
    @Transform(({value}) => value ? new Date(value) : undefined)
    @IsDate()
    createdAt: Date;
    
    @IsOptional()
    @IsDate()
    @Transform(({value}) => value ? new Date(value) : undefined)
    updatedAt: Date;
}