import { apiOptions } from "@/lib/api-v1";

export function OPTIONS() {
  return apiOptions();
}

export function GET(request: Request) {
  const origin = new URL(request.url).origin;

  return Response.json({
    openapi: "3.1.0",
    info: {
      title: "Bình An App API",
      version: "1.0.0",
      description: "Versioned REST API for the Bình An mobile application."
    },
    servers: [{ url: `${origin}/api/v1` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    paths: {
      "/config": { get: { summary: "Get public application configuration" } },
      "/auth/register": { post: { summary: "Register with email and password" } },
      "/auth/login": { post: { summary: "Login with email and password" } },
      "/auth/google": { post: { summary: "Login with a Google ID token" } },
      "/auth/refresh": { post: { summary: "Refresh an access token" } },
      "/auth/logout": { post: { summary: "Revoke the current session", security: [{ bearerAuth: [] }] } },
      "/auth/me": { get: { summary: "Get the authenticated user", security: [{ bearerAuth: [] }] } },
      "/auth/forgot-password": { post: { summary: "Send password recovery email" } },
      "/auth/password": { patch: { summary: "Update password", security: [{ bearerAuth: [] }] } },
      "/profile": {
        get: { summary: "Get profile", security: [{ bearerAuth: [] }] },
        patch: { summary: "Update profile", security: [{ bearerAuth: [] }] }
      },
      "/profile/avatar": { post: { summary: "Upload avatar", security: [{ bearerAuth: [] }] } },
      "/daily-messages/today": { get: { summary: "Get today's message; Bearer token is optional" } },
      "/prayers": {
        get: { summary: "List public prayers" },
        post: { summary: "Create a prayer", security: [{ bearerAuth: [] }] }
      },
      "/prayers/{id}": {
        get: { summary: "Get prayer detail" },
        patch: { summary: "Update owned prayer", security: [{ bearerAuth: [] }] },
        delete: { summary: "Soft-delete owned prayer", security: [{ bearerAuth: [] }] }
      },
      "/prayers/{id}/reactions": {
        post: { summary: "Add reaction", security: [{ bearerAuth: [] }] },
        delete: { summary: "Remove reaction", security: [{ bearerAuth: [] }] }
      },
      "/reports": { post: { summary: "Report content", security: [{ bearerAuth: [] }] } }
      ,
      "/gratitude": {
        get: { summary: "List gratitude entries", security: [{ bearerAuth: [] }] },
        post: { summary: "Create gratitude entry", security: [{ bearerAuth: [] }] }
      },
      "/gratitude/{id}": {
        patch: { summary: "Update gratitude entry", security: [{ bearerAuth: [] }] },
        delete: { summary: "Delete gratitude entry", security: [{ bearerAuth: [] }] }
      },
      "/letters": {
        get: { summary: "List future letters", security: [{ bearerAuth: [] }] },
        post: { summary: "Create future letter", security: [{ bearerAuth: [] }] }
      },
      "/letters/{id}": {
        get: { summary: "Open future letter when unlocked", security: [{ bearerAuth: [] }] },
        delete: { summary: "Delete future letter", security: [{ bearerAuth: [] }] }
      },
      "/memorials": {
        get: { summary: "List owned memorials", security: [{ bearerAuth: [] }] },
        post: { summary: "Create memorial", security: [{ bearerAuth: [] }] }
      },
      "/memorials/{id}": {
        get: { summary: "Get visible memorial" },
        patch: { summary: "Update owned memorial", security: [{ bearerAuth: [] }] },
        delete: { summary: "Delete owned memorial", security: [{ bearerAuth: [] }] }
      },
      "/memorials/{id}/candles": {
        post: { summary: "Light a memorial candle", security: [{ bearerAuth: [] }] }
      },
      "/notifications": {
        get: { summary: "Get account notifications", security: [{ bearerAuth: [] }] }
      }
    }
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  });
}
