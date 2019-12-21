export const enum CommonErrorMessages {
    USER_NAME_EXIST = 'User with such name is already exist',
    UUID_INCORRECT = "Incorrect uuid",
    INVALID_PASSWORD = "Invalid password",
    INVALID_TOKEN = 'Invalid token',
    INVALID_USER_UUID = "No user with such id",
    INVALID_STORY_UUID = "No story with such uuid",
    USER_NO_EMAIL = "No email field in this user instance",
    USER_NO_PHONE = "No phone field in this user instance",
    USER_NO_SETTINGS = "User should have email or phone to add notifications"
}

export function createError(msg) {
    return JSON.stringify({error: msg});
}