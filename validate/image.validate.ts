import {ArgumentMetadata, HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {AvatarValidatePipe} from "./avatar.validate";

@Injectable()
export class ImageValidatePipe {
    transform(file: any, metadata: ArgumentMetadata): any {
        this.validateImage(file);
        return file;
    }

    // overloading
    validateImage(file: Express.Multer.File) :void;

    validateImage(files: Express.Multer.File[]): void;

    validateImage(fileOrFiles: Express.Multer.File | Express.Multer.File[]) {
        if(Array.isArray(fileOrFiles)) {
            if(fileOrFiles.length > 5) throw new HttpException("files is must be less than 5", HttpStatus.BAD_REQUEST);
            fileOrFiles.forEach(file => this.validateSingleImage(file));
        }
        else {
            this.validateSingleImage(fileOrFiles);
        }
    }

    validateSingleImage(file: Express.Multer.File) {
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