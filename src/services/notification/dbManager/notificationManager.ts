import {CommonDbManager} from "../../../common/commonDbManager";
import {Notification} from "../entity/notification";

export class NotificationManager extends CommonDbManager<Notification> {
    public async getNotify(user_uuid:string) {
        await this.createNotify(user_uuid, false, false);
        return await this.repository.findOne({where: {user_id: user_uuid}});
    }

    public async createNotify(user_uuid:string, email:boolean, phone:boolean) {
        const existed_notification = await this.repository.findOne({where: { user_id: user_uuid}});
        if (existed_notification) {
            return existed_notification;
        }

        const notify_data = {
            user_id: user_uuid,
            email: email,
            phone: phone
        };

        const notification = await this.repository.create(notify_data);
        return await this.repository.save(notification);
    }

    public async updateNotify(user_uuid:string, email:boolean, phone:boolean) {
        const notify_data = {
            email: email,
            phone: phone
        };

        const notification = await this.repository.findOne({where: {user_id: user_uuid}});

        await this.repository.merge(notification, notify_data);
        return await this.repository.save(notification);
    }

    public async deleteNotify(user_uuid:string) {
        const notification = await this.repository.findOne({where: {user_id: user_uuid}});
        return await this.repository.delete(notification.id);
    }
}