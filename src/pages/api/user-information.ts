import type { NextApiRequest, NextApiResponse } from 'next';

const SUBSCRIBE_URL =
  process.env.SUBSCRIBE_API_URL ??
  'http://sitecoreai-api-demo-gpebh4gudbcfaxbb.westus3-01.azurewebsites.net/api/subscribe';

/**
 * Receives the User Information form submission, logs it, and forwards
 * the same form data to the external subscribe API.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, accountNumber, companyName, emirate } = req.body ?? {};
  const payload = { name, accountNumber, companyName, emirate };

  console.log('User information received:', payload);

  try {
    const response = await fetch(SUBSCRIBE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
