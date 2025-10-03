import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";

export function getAuthUser(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  return decoded;
}

export function requireAuth(request: NextRequest) {
  const user = getAuthUser(request);

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return user;
}

