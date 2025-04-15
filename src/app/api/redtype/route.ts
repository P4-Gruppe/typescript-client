import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required and must be a string' }, { status: 400 });
    }

    console.log(`Received prompt: ${prompt}`);

    // Implement logic to send the prompt to the Redtype service
    const redtypeUrl = 'http://sg4os4okwcs00s8sowww0wco.138.2.151.42.sslip.io/parse'; // Assuming Redtype runs here

    try {
      const redtypeRes = await fetch(redtypeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: prompt,
      });

      if (!redtypeRes.ok) {
        let errorBody = 'Unknown error from Redtype service';
        try {
          errorBody = await redtypeRes.text();
        } catch {}
        throw new Error(`Redtype service error! status: ${redtypeRes.status}, body: ${errorBody}`);
      }

      const redtypeResponse = await redtypeRes.text();

      return NextResponse.json({ response: redtypeResponse });

    } catch (fetchError) {
      console.error(`Error communicating with Redtype service at ${redtypeUrl}:`, fetchError);
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Failed to connect to Redtype service';
      // Return a 502 Bad Gateway error if communication failed
      return NextResponse.json({ error: 'Bad Gateway', details: errorMessage }, { status: 502 });
    }

  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
} 