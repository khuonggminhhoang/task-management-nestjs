import {Controller, ParseIntPipe, Post, UploadedFiles, UseGuards, UseInterceptors} from "@nestjs/common";
import {FilesInterceptor} from "@nestjs/platform-express";
import {CollectionService} from "@/module/collection/collection.service";
import {CloudinaryService} from "@/cloudinary/cloudinary.service";
import {AuthGuard} from "@nestjs/passport";
import {UserDecorator} from "@/module/user/decorator/user.decorator";
import {ImageValidatePipe} from "../../../validate/image.validate";
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiTags} from "@nestjs/swagger";

@Controller('api/v1/collection')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Collection')
@ApiBearerAuth()
export class CollectionController {
    constructor(
        private readonly collectionService: CollectionService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Post('upload/images')
    @UseInterceptors(FilesInterceptor('images'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'List of images',
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            }
        }
    })
    async uploadMultiImage(@UserDecorator('id', ParseIntPipe) idUser: number, @UploadedFiles(ImageValidatePipe) images: Express.Multer.File[]) {
        let urls: string[] = [];
        for(let image of images) {
           const url = await this.cloudinaryService.uploadImage(image);
           urls.push(url);
        }

        return this.collectionService.uploadMultiImage(idUser, urls);
    }
}