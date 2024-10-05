import {Injectable} from "@nestjs/common";
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from "streamifier";

@Injectable()
export class CloudinaryService {
    private streamUpload(file: Express.Multer.File): Promise<any> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if(error) return reject(error);
                    resolve(result);
                }
            )

            streamifier.createReadStream(file.buffer).pipe(stream);
        });
    }

    async uploadImage(file: Express.Multer.File) {
        const result = await this.streamUpload(file);
        return result.secure_url;
    }
}