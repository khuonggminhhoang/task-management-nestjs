import {ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform} from "@nestjs/common";

@Injectable()
export class AvatarValidatePipe implements PipeTransform {
    transform(file: any, metadata: ArgumentMetadata) {
        this.validateImage(file);
        return file;
    }

    validateImage(file: Express.Multer.File) {
        if(!file) {
            throw new HttpException('Not file to upload', HttpStatus.BAD_REQUEST);
        }

        if(file.size > 5 * 1024 * 1024) {
            throw new HttpException("File must be less than 5MB", HttpStatus.BAD_REQUEST);
        }

        if(!file.mimetype.match('image/*')) {               // check file ảnh
            throw new HttpException("File must be ext is .png|.jpeg|.jpg", HttpStatus.BAD_REQUEST);
        }
    }

}