import type { NextApiRequest, NextApiResponse } from 'next';

// Full URL of the Azure backend, e.g. https://<app>.azurewebsites.net/api/subscribe
const SUBSCRIBE_URL = process.env.SUBSCRIBE_URL as string;
// Must match SUBSCRIBE_API_KEY in the Azure App Service
const SUBSCRIBE_API_KEY = process.env.SUBSCRIBE_API_KEY as string;

/**
 * Receives the User Information form submission, logs it, and forwards
 * the same form data to the external subscribe API.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!SUBSCRIBE_URL || !SUBSCRIBE_API_KEY) {
    console.error('SUBSCRIBE_URL or SUBSCRIBE_API_KEY is not configured');
    return res.status(500).json({ message: 'Server not configured' });
  }

  const { name, email, companyName, emirate } = req.body ?? {};
  const payload = { name, email, companyName, emirate };

  console.log('User information received:', payload);

  try {
    const response = await fetch(SUBSCRIBE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SUBSCRIBE_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Subscribe API responded with status', response.status);
      return res.status(502).json({ message: 'Subscribe API request failed' });
    }

    return res.status(200).json({ message: 'Received' });
  } catch (error) {
    console.error('Subscribe API request error:', error);
    return res.status(502).json({ message: 'Subscribe API unreachable' });
  }
}