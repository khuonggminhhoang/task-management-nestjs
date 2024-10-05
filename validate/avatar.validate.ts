import {ArgumentMetadata, Injectable, PipeTransform} from "@nestjs/common";

@Injectable()
export class AvatarValidatePipe implements PipeTransform {
    transform(file: any, metadata: ArgumentMetadata) {
        if(!file) {
            throw new Error('Not file to upload');
        }

        if(file.size > 5 * 1024 * 1024) {
            throw new Error("File must be less than 5MB");
        }

        if(!file.mimetype.match('image/*')) {               // check file ảnh
            throw new Error("File must be ext is .png|.jpeg|.jpg");
        }

        return file;
    }
}