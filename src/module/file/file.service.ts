import {HttpStatus, Injectable} from "@nestjs/common";
import {User} from "@/module/user/entities/user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {instanceToInstance} from "class-transformer";
import * as XLSX from "xlsx";
import {Response} from "express";
import {WorkBook} from "xlsx";
import {UserService} from "@/module/user/user.service";

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private userService: UserService
    ) {}

    async exportExcel(res: Response): Promise<any> {
        const users: User[] = await this.userRepository.find({where: {deleted: false}});
        const rows = instanceToInstance(users);

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet", true);
        // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1", true);
        // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet", true);

        // lưu
        XLSX.writeFile(workbook, "xlsx/user.xlsx");
        const buffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'buffer'});

        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'users.xlsx',
        );
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }

    async importExcel(file: any) {
        const wb: WorkBook= XLSX.read(file.buffer);
        const ws = wb.Sheets[wb.SheetNames[0]];

        const aoa = XLSX.utils.sheet_to_json(ws);

        for(let infoUser of aoa) {
            const password = await this.userService.hashPassword(infoUser['Password'] + "");

            const dto = {
                full_name: infoUser['FullName'],
                email: infoUser['Email'],
                gender: (infoUser['Gender'] === 1 ? true : false),
                password: password
            };

            await this.userService.create(dto);
        }

        return {
            success: true,
            statusCode: HttpStatus.CREATED,
            message: "import excel file successfully"
        }

    }
}
