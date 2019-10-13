import {CommonDbManager} from "../../../common/commonDbManager";
import {Favourites} from "../entity/favourites";

export class FavouritesManager extends CommonDbManager<Favourites> {
    public async getFav(user_uuid:string) {
        return await this.repository.find({where: {user_id: user_uuid}});
    }

    public async createFav(user_uuid:string, story_uuid:string) {
        const fav_data = {
            user_id: user_uuid,
            story_id: story_uuid
        };

        const fav = await this.repository.create(fav_data);
        return await this.repository.save(fav);
    }

    public async deleteFav(id:string) {
        return await this.repository.delete(id);
    }
}