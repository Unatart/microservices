## RSOI lab 2 Miroservices

### Entities

##### User
 [uuid, name, password, email, phone]
##### Stories
 [uuid, theme, article, author(user_uuid)]
##### Favourites
 [uuid, user_uuid, story_uuid]
##### Notifications
 [uuid, user_uuid, email(on/off), phone(on,off)]

### GATEWAY routes:

- GET /stories **paginated**
- GET /stories/:id
- POST /user/auth
- PATCH /user/:id
- POST /user/:id/stories
- PATCH /user/:id/stories/:story_id
- DELETE /user/:id/stories/:story_id
- GET /user/:id/favourites **paginated**
- POST /user/:id/stories/:story_id/favourites
- DELETE /user/:id/stories/:story_id/favourites
- GET /user/:id/notifications
- PATCH /user/:id/notifications


