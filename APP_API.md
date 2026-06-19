# Binh An App API v1

Base URL local:

```text
http://localhost:3000/api/v1
```

Production uses the website domain with the same `/api/v1` prefix.

## Authentication

Private endpoints require:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

Store both `access_token` and `refresh_token` securely. On a `401`
`AUTH_TOKEN_INVALID` response, call `/auth/refresh`, store the new tokens, then retry.

## Response format

Success:

```json
{
  "success": true,
  "data": {},
  "meta": {},
  "request_id": "uuid"
}
```

Failure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data."
  },
  "request_id": "uuid"
}
```

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/google`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `PATCH /auth/password`

Register:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "display_name": "Nguyen An"
}
```

Login:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Google:

```json
{
  "id_token": "google-id-token"
}
```

Refresh:

```json
{
  "refresh_token": "refresh-token"
}
```

Password recovery:

```json
{
  "email": "user@example.com",
  "redirect_to": "binhan://reset-password"
}
```

The deep link must be configured in Supabase Authentication Redirect URLs.

## Config

`GET /config`

Returns registration status, community status, default page size, and support email.
Admin can manage API availability, maintenance mode, CORS origins, and per-minute
rate limits from `/admin/settings`.

## Profile

- `GET /profile`
- `PATCH /profile`
- `POST /profile/avatar` using `multipart/form-data`, file field: `avatar`

## Daily message

`GET /daily-messages/today`

Bearer token is optional. With a token, the daily opening is stored for the user.

## Prayers

- `GET /prayers?page=1&limit=20&type=peace`
- `POST /prayers`
- `GET /prayers/:id`
- `PATCH /prayers/:id`
- `DELETE /prayers/:id`
- `POST /prayers/:id/reactions`
- `DELETE /prayers/:id/reactions`

Create:

```json
{
  "content": "Mong gia dinh luon binh an.",
  "type": "peace",
  "visibility": "public_anonymous",
  "allow_reactions": true
}
```

Reaction:

```json
{
  "reaction_type": "pray"
}
```

## Reports

`POST /reports`

```json
{
  "target_type": "prayer",
  "target_id": "uuid",
  "reason": "Noi dung khong phu hop"
}
```

## Gratitude

- `GET /gratitude?month=6&year=2026`
- `POST /gratitude`
- `PATCH /gratitude/:id`
- `DELETE /gratitude/:id`

## Future letters

- `GET /letters`
- `POST /letters`
- `GET /letters/:id`
- `DELETE /letters/:id`

## Memorials

- `GET /memorials`
- `POST /memorials`
- `GET /memorials/:id`
- `PATCH /memorials/:id`
- `DELETE /memorials/:id`
- `POST /memorials/:id/candles`

## Notifications

`GET /notifications`

## OpenAPI

```text
GET /api/v1/openapi
```
