// API route for running a scan on a given URL
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from 'lib/prisma';

interface ScanRequest {
  url: string;
}

interface ScanResult {
  success: boolean;
  https?: boolean;
  headers?: Record<string, string>;
  error?: string;
}

// Handles POST requests to scan a site
export async function POST(request: Request) {
  try {
    // Parse and validate input
    const body: ScanRequest = await request.json();
    const { url } = body;
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid URL' }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Malformed URL' }, { status: 400 });
    }

    // Only allow http/https
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return NextResponse.json({ success: false, error: 'URL must start with http:// or https://' }, { status: 400 });
    }

    // Fetch headers with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s
    let resp: Response;
    try {
      resp = await fetch(url, { method: 'HEAD', signal: controller.signal });
    } catch (e: any) {
      if (e.name === 'AbortError') {
        // Timed out
        return NextResponse.json({ success: false, error: 'Scan timed out. The site may be slow or unresponsive. Please try again later.' }, { status: 504 });
      }
      return NextResponse.json({ success: false, error: 'Failed to fetch site.' }, { status: 502 });
    } finally {
      clearTimeout(timeout);
    }

    // Lowercase all header keys
    const headers: Record<string, string> = {};
    resp.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const result: ScanResult = {
      success: true,
      https: parsed.protocol === 'https:',
      headers,
    };

    // Save scan to history if logged in
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        await prisma.scan.create({
          data: {
            url,
            result: JSON.stringify(result),
            userId: session.user.id as string,
          },
        });
      }
    } catch (e) {
      // Not critical if this fails
      console.error('failed to save scan history', e);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    // Catch-all for unexpected errors
    console.error('scan error', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
