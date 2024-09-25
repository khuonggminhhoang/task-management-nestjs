import {Injectable} from "@nestjs/common";

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

        return this.actionPostCreate(record);
    }

    // read
    async actionPreFindAll(dto: any) {
        return dto;
    }

    async actionGetFindAll(records: T[]) {
        return records;
    }

    async findAll(dto: any) {
        const handleDto = await this.actionPreFindAll(dto);

        const records = await this.repository.find({...handleDto, deleted: false});

        return this.actionGetFindAll(records);
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

        return this.actionGetFindOne(record);
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

        return this.actionPatchUpdate(record);
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

        return this.actionDelete();
    }
}