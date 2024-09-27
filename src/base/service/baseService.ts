import {HttpStatus, Injectable} from "@nestjs/common";
import {instanceToPlain} from "class-transformer";

@Injectable()
export class BaseService<T> {
    constructor(protected readonly repository) {}

    // create
    async actionPreCreate(dto: Partial<T>) {
        return dto;
    }

    async actionPostCreate(record: T) {
        return record;
    }

    async create(dto: Partial<T>) {
        const handleDto =await this.actionPreCreate(dto);

        const record = await this.repository.save(handleDto);

        const element = await this.actionPostCreate(record);

        return {
            "success": true,
            "statusCode": HttpStatus.CREATED,
            "message": "Resource created successfully",
            "data": instanceToPlain(element)
        };
    }

    // read
    async actionPreFindAll(dto: Partial<T>) {
        return dto;
    }

    async actionGetFindAll(records: T[]) {
        return records;
    }

    async findAll(dto: Partial<T>) {
        const handleDto = await this.actionPreFindAll(dto);

        const records = await this.repository.find({...handleDto, deleted: false});

        const array = await this.actionGetFindAll(records);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved successfully",
            "data": instanceToPlain(array)
        }
    }

    // read detail
    async actionPreFindOne(id: any) {
        return id;
    }

    async actionGetFindOne(record: T) {
        return record;
    }

    async findOne(id: any) {
        const handleId = await this.actionPreFindOne(id);

        const record = await this.repository.findOne({where: {id: handleId, deleted: false}});

        const element = await this.actionGetFindOne(record);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved successfully",
            "data": instanceToPlain(element)
        }
    }

    // update
    async actionPreUpdate(dto: Partial<T>) {
        return dto;
    }

    async actionPatchUpdate(record: T) {
        return record;
    }

    async update(id: any, dto: Partial<T>) {
        const handleDto = await this.actionPreUpdate(dto);

        const record = await this.repository.update({id: id}, handleDto);

        await this.actionPatchUpdate(record);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Resource updated successfully"
        }
    }

    // delete
    async actionPreDelete(id: any) {
        return id;
    }

    async actionDelete() {
    }

    async delete(id: any) {
        const handleId = await this.actionPreDelete(id);

        await this.repository.delete(handleId);

        await this.actionDelete();

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Resource deleted successfully"
        }
    }
}