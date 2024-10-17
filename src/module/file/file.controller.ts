import {Controller, Get, Post, Res, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiTags} from "@nestjs/swagger";
import {FileService} from "@/module/file/file.service";
import {Response} from "express";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('api/v1/file')
@ApiBearerAuth()
@ApiTags('File')
@UseGuards(AuthGuard('jwt'))
export class FileController {
    constructor(private fileService: FileService) {
    }

    @Get('/export/excel')
    exportExcel(@Res() res: Response) {
        return this.fileService.exportExcel(res);
    }

    @UseInterceptors(FileInterceptor('excel'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'File excel',
        schema: {
            type: 'object',
            properties: {
                excel: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    @Post('/import/excel')
    importExcel(@UploadedFile() file: any) {
        return this.fileService.importExcel(file);
    }
}