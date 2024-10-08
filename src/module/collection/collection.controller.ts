import {Controller, ParseIntPipe, Post, UploadedFiles, UseGuards, UseInterceptors} from "@nestjs/common";
import {FilesInterceptor} from "@nestjs/platform-express";
import {CollectionService} from "@/module/collection/collection.service";
import {CloudinaryService} from "@/cloudinary/cloudinary.service";
import {AuthGuard} from "@nestjs/passport";
import {UserDecorator} from "@/module/user/decorator/user.decorator";
import {ImageValidatePipe} from "../../../validate/image.validate";

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/collection')
export class CollectionController {
    constructor(
        private readonly collectionService: CollectionService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Post('upload/images')
    @UseInterceptors(FilesInterceptor('images'))
    async uploadMultiImage(@UserDecorator('id', ParseIntPipe) idUser: number, @UploadedFiles(ImageValidatePipe) images: Express.Multer.File[]) {
        let urls: string[] = [];
        for(let image of images) {
           const url = await this.cloudinaryService.uploadImage(image);
           urls.push(url);
        }

        return this.collectionService.uploadMultiImage(idUser, urls);
    }
}