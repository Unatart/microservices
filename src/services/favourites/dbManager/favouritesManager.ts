import {CommonDbManager} from "../../../common/commonDbManager";
import {Favourites} from "../entity/favourites";

export class FavouritesManager extends CommonDbManager<Favourites> {
    public async getFav(user_uuid:string, start:number, size:number) {
        return await this.repository.find({where: {user_id: user_uuid}, skip: start, take: size});
    }

    public async createFav(user_uuid:string, story_uuid:string) {
        const fav_data = {
            user_id: user_uuid,
            story_id: story_uuid
        };

        const fav = await this.repository.create(fav_data);
        return await this.repository.save(fav);
    }

    public async deleteFav(user_id:string, story_id:string) {
        const result = await this.repository.findOne({where: {user_id: user_id, story_id: story_id}});

        return await this.repository.delete(result);
    }

    public async deleteFavStories(story_id:string) {
        return await this.repository
            .createQueryBuilder()
            .delete()
            .from(Favourites)
            .where({story_id: story_id})
            .execute();
    }
}