import { NextResponse } from 'next/server';
import { RedtypeClient } from '../../../../../redtype/redtype';

const REDTYPE_URL = process.env.REDTYPE_URL || 'http://sg4os4okwcs00s8sowww0wco.138.2.151.42.sslip.io';
const client = new RedtypeClient(REDTYPE_URL, '/schema', '/parse');

export async function POST(request: Request) {
  try {
    const schemaToApply = await request.text();

    // Add validation for the schema format if needed
    if (!schemaToApply || typeof schemaToApply !== 'object') {
      return NextResponse.json({ error: 'Missing or invalid schema to apply' }, { status: 400 });
    }

    // Construct the command for the Redtype server
    // Assuming the command format is APPLYSCHEMA <json_stringified_schema>
    const command = `APPLYSCHEMA ${JSON.stringify(schemaToApply)}`;

    console.log("Sending command to Redtype:", command);
    const response = await client.applySchema(schemaToApply);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing applySchema request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process applySchema request';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 