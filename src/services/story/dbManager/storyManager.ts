import {Story} from "../entity/story";
import {CommonDbManager} from "../../../common/commonDbManager";
import {CommonErrorMessages} from "../../../common/commonError";

export class StoryManager extends CommonDbManager<Story> {
    public async getStories(start: number, size: number) {
        return await this.repository.find({skip: start, take: size});
    };

    public async getStory(id:string) {
        const story =  await this.repository.findOne(id);
        if (story) {
            return story;
        }

        throw Error(CommonErrorMessages.INVALID_STORY_UUID);
    };

    public async createStory(body:any) {
        const story = await this.repository.create(body);
        return await this.repository.save(story);
    };

    public async updateStory(id:string, body:any) {
        const story =  await this.repository.findOne(id);
        if (story) {
            await this.repository.merge(story, body);
            return await this.repository.save(story);
        }

        throw Error(CommonErrorMessages.INVALID_STORY_UUID);
    };

    public async deleteStory(id:string) {
        return await this.repository.delete(id);
    }
}