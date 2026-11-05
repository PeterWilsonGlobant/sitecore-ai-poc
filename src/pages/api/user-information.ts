import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Receives the User Information form submission and logs it on the server.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, accountNumber, companyName, emirate } = req.body ?? {};

  console.log('User information received:', { name, accountNumber, companyName, emirate });

  return res.status(200).json({ message: 'Received' });
}
