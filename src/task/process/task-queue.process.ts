import {OnQueueActive, Process, Processor} from "@nestjs/bull";
import {Job} from "bull";
import {MailService} from "@/common/mail/mail.service";

/** Phải import vào provider của module tương ứng */

@Processor('task')
export class TaskProcessor {
    constructor(private mailService: MailService) {
    }

    @Process()                                          // không truyền gì vào decorator thì xử lý tất cả các job không tên (__default__)
    async arbitraryName(job: Job) {
        const {task, email} = job.data;
        const subject = '[TASK] Nhắc nhở nhiệm vụ';
        const html = `
                    <b>[Nhắc nhở]: </b> ${task.title} 
                    <hr>
                    Email này được gửi tự động. Xin đừng trả lời email này.
                    <br>
Chúng tôi vừa cập nhật địa chỉ email của chúng tôi, vui lòng thêm info@newsletter.vn vào danh bạ email
                    <br>
của bạn để đảm bảo nhận được các email của chúng tôi trong hộp thư đến của bạn.
                    <hr>
            `;

        console.log(html);
        // await this.mailService.sendMail(email, subject, html);
    }

    // @Process('name job')                                // có thể truyền name của job vào decorator để xử lý job cùng tên
    // async testFunction(job: Job) {
    //     console.log(job.data);
    // }
    //
    // @OnQueueActive()                                    // nếu không truyền name thì mặc định xử lý tất cả các job trong hàng đợi khi chạy
    // onActive(job: Job) {
    //     console.log(
    //         `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    //     );
    // }
}