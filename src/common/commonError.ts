export const enum CommonErrorMessages {
    USER_NAME_EXIST = 'User with such name is already exist',
    UUID_INCORRECT = "Incorrect uuid",
    INVALID_PASSWORD = "Invalid data",
    INVALID_USER_UUID = "No user with such id",
    INVALID_STORY_UUID = "No story with such uuid",
}

export function createError(msg) {
    return JSON.stringify({error: msg});
}