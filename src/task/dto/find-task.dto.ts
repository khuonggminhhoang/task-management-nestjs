import { IsIn, IsOptional, IsString} from "class-validator";

export class FindTaskDto {
    @IsOptional()
    @IsString()
    keyword ?: string;

    @IsOptional()
    @IsIn(['title', 'time_start', 'time_finish', 'createdAt'], {message: 'sort by must be title | time_start | time_finish | createdAt.'})
    sortBy ?: 'title' | 'time_start' | 'time_finish' | 'createdAt';
    
    @IsOptional()
    @IsIn(['ASC', 'DESC'], {message: 'order must be ASC or DESC.'})
    order ?: 'ASC' | 'DESC';
}