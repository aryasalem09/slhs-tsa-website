import { NextResponse } from "next/server";

export class RequestBodyTooLargeError extends Error {
  constructor() {
    super("Request body is too large");
    this.name = "RequestBodyTooLargeError";
  }
}

export function rejectCrossOrigin(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;
  if (fetchSite === "cross-site" || (origin && origin !== expectedOrigin)) {
    return NextResponse.json({ error: "Cross-origin Studio requests are not allowed" }, { status: 403 });
  }
  return null;
}

export async function readBodyWithLimit(request: Request, maximumBytes: number): Promise<Uint8Array> {
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    const declaredLength = Number(contentLength);
    if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) throw new RequestBodyTooLargeError();
  }
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maximumBytes) {
        await reader.cancel();
        throw new RequestBodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function readJsonWithLimit(request: Request, maximumBytes: number): Promise<unknown> {
  const body = await readBodyWithLimit(request, maximumBytes);
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
}
