import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @ApiProperty()  
    @IsOptional()
    @IsString()
    full_name?: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    gender?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    deleted?: boolean;

}