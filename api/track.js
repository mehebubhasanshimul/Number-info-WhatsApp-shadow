export default async function handler(req, res) {
    // CORS হেডার সেট করা যাতে কোনো ব্লকিং না হয়
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ error: 'Phone number required' });
        }

        // Vercel সার্ভার থেকে সরাসরি RapidAPI গেটওয়েতে নিরাপদ রিকোয়েস্ট
        const apiResponse = await fetch('https://whatsapp-osint.p.rapidapi.com/bizos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': 'whatsapp-osint.p.rapidapi.com',
                'x-rapidapi-key': 'b3ad11e41cmshb18121f061df58ep1b5c61jsnd7a63dda9d56'
            },
            body: JSON.stringify({ phone })
        });

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({ error: `RapidAPI Error Status: ${apiResponse.status}` });
        }

        const data = await apiResponse.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
