import { NextResponse } from 'next/server';
import { RedtypeClient } from '../../../../../redtype/redtype';

const REDTYPE_URL = process.env.REDTYPE_URL || 'http://sg4os4okwcs00s8sowww0wco.138.2.151.42.sslip.io';
const client = new RedtypeClient(REDTYPE_URL, '/schema', '/parse');
export async function POST(request: Request) {
  try {
    const textToParse = await request.text();

    if (!textToParse || typeof textToParse !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid text to parse' }, { status: 400 });
    }

    // Construct the command for the Redtype server
    // Assuming the command format is PARSE <text>

    console.log("Sending command to Redtype:", textToParse);
    const response = await client.runCommand(textToParse);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing parse request:', error);
    // Distinguish between client errors and internal server errors if possible
    const errorMessage = error instanceof Error ? error.message : 'Failed to process parse request';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 