import {HttpStatus, Injectable} from "@nestjs/common";
import {instanceToPlain} from "class-transformer";

@Injectable()
export class BaseService<T> {
    constructor(protected readonly repository) {}

    // create
    async actionPreCreate(dto: Partial<T>, option?: object) {
        return dto;
    }

    async actionPostCreate(record: T, option?: object) {
        return record;
    }

    async create(dto: Partial<T>, option?: object) {
        const handleDto =await this.actionPreCreate(dto, option);

        const record = await this.repository.save(handleDto);

        const element = await this.actionPostCreate(record, option);

        return {
            "success": true,
            "statusCode": HttpStatus.CREATED,
            "message": "Resource created successfully",
            "data": instanceToPlain(element)
        };
    }

    // read
    async actionPreFindAll(dto: Partial<T>, option?: object) {
        return dto;
    }

    async actionGetFindAll(records: T[], option?: object) {
        return records;
    }

    async findAll(dto: Partial<T>, option?: object) {
        const handleDto = await this.actionPreFindAll(dto, option);

        const records = await this.repository.find({where: {...handleDto}});

        const array = await this.actionGetFindAll(records, option);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved successfully",
            "data": instanceToPlain(array)
        }
    }

    // read detail
    async actionPreFindOne(id: any, option?: object) {
        return id;
    }

    async actionGetFindOne(record: T, option?: object) {
        return record;
    }

    async findOne(id: any, option?: object) {
        const handleFind = await this.actionPreFindOne(id, option);

        const record = await this.repository.findOne({where: handleFind});

        const element = await this.actionGetFindOne(record, option);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Data retrieved successfully",
            "data": instanceToPlain(element)
        }
    }

    // update
    async actionPreUpdate(dto: Partial<T>, option?: object) {
        return dto;
    }

    async actionPatchUpdate(record: T, option?: object) {
        return record;
    }

    async update(id: any, dto: Partial<T>, option?: object) {
        const handleDto = await this.actionPreUpdate(dto, option);

        const record = await this.repository.update({id: id}, handleDto);

        await this.actionPatchUpdate(record, option);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Resource updated successfully"
        }
    }

    // delete
    async actionPreDelete(id: any, option?: object) {
        return id;
    }

    async actionDelete(option?: object) {
    }

    async delete(id: any, option?: object) {
        const handleId = await this.actionPreDelete(id, option);

        await this.repository.delete(handleId);

        await this.actionDelete(option);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Resource deleted successfully"
        }
    }
}