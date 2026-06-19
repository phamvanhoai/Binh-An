import { apiOptions, apiResponse, requireAppAuth } from "@/lib/api-v1";

export function OPTIONS() {
  return apiOptions();
}

export async function GET(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  return apiResponse(auth.user);
}
