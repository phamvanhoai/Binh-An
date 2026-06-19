import { apiOptions, apiResponse } from "@/lib/api-v1";

export function OPTIONS() {
  return apiOptions();
}

export function GET() {
  return apiResponse({
    name: "Bình An App API",
    version: "v1",
    authentication: "Bearer access token",
    documentation: "/api/v1/openapi",
    endpoints: {
      auth: "/api/v1/auth",
      profile: "/api/v1/profile",
      today: "/api/v1/daily-messages/today",
      prayers: "/api/v1/prayers",
      gratitude: "/api/v1/gratitude",
      letters: "/api/v1/letters",
      memorials: "/api/v1/memorials",
      notifications: "/api/v1/notifications"
    }
  });
}
