import { Request, Response } from 'express';
import axios from 'axios';
import { FULL_TAROT_DECK } from '../data/tarotDeck.js';
import { generateAstrologyResponse } from '../services/aiService.js';
// https://github.com/cbmgit/horoscope-api
const BASE_URL = 'https://horoscope-app-api.vercel.app/api/v1/get-horoscope';

export async function getHoroscope(req: Request, res: Response) {
    try {
        const { sign, period } = req.params; // period can be 'daily', 'weekly', 'monthly'
        const { day = 'today', lang = 'en' } = req.query; // only applicable for daily

        // Sanitize period to match API
        const periodParam = Array.isArray(period) ? period[0] : period;
        const validPeriods = ['daily', 'weekly', 'monthly'];
        const actualPeriod = validPeriods.includes(periodParam as string) ? periodParam : 'daily';

        const endpoint = `${BASE_URL}/${actualPeriod}`;
        const params = actualPeriod === 'daily' ? { sign, day } : { sign };

        const response = await axios.get(endpoint, { params });

        if (response.data.data) {
            let horoscopeText = response.data.data.horoscope_data;

            // Translate to Hindi using AI if requested
            if (lang === 'hi') {
                try {
                    const translationPrompt = [
                        { role: "system", content: "You are a professional English to Hindi translator. Translate the following astrological horoscope reading accurately into natural-sounding, respectful Hindi suitable for an astrology app. Return ONLY the translated Hindi text, nothing else." },
                        { role: "user", content: horoscopeText }
                    ];
                    const translatedText = await generateAstrologyResponse(translationPrompt);
                    if (translatedText) {
                        horoscopeText = translatedText;
                    }
                } catch (e) {
                    console.error("Translation failed, falling back to English", e);
                }
            }

            res.json({
                ...response.data.data,
                horoscope_data: horoscopeText,
                language: lang
            });
        } else {
            res.status(404).json({ error: 'Horoscope not found' });
        }
    } catch (error: any) {
        console.error('Horoscope API error:', error.message);
        res.status(500).json({ error: 'Failed to fetch horoscope' });
    }
}

// Tarot Data is now imported from ../data/tarotDeck.js

export async function getDailyTarot(req: Request, res: Response) {
    try {
        const today = new Date();

        // Shuffle and pick 3 unique cards completely at random for maximum variance
        const deckCopy = [...FULL_TAROT_DECK];

        // Fisher-Yates shuffle
        for (let i = deckCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deckCopy[i], deckCopy[j]] = [deckCopy[j], deckCopy[i]];
        }

        const card1 = deckCopy[0];
        const card2 = deckCopy[1];
        const card3 = deckCopy[2];

        res.json({
            success: true,
            data: [
                {
                    position: "Past",
                    date: today.toISOString().split('T')[0],
                    card: card1.name,
                    meaning: card1.meaning,
                    image: `https://api.dicebear.com/7.x/identicon/svg?seed=${card1.name}&backgroundColor=fff`
                },
                {
                    position: "Present",
                    date: today.toISOString().split('T')[0],
                    card: card2.name,
                    meaning: card2.meaning,
                    image: `https://api.dicebear.com/7.x/identicon/svg?seed=${card2.name}&backgroundColor=fff`
                },
                {
                    position: "Future",
                    date: today.toISOString().split('T')[0],
                    card: card3.name,
                    meaning: card3.meaning,
                    image: `https://api.dicebear.com/7.x/identicon/svg?seed=${card3.name}&backgroundColor=fff`
                }
            ]
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to draw tarot card' });
    }
}

function calculateSingleDigit(num: number): number {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) { // Master numbers
        num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return num;
}

export async function calculateNumerology(req: Request, res: Response) {
    try {
        const { dob, name } = req.body; // dob format: YYYY-MM-DD

        if (!dob) {
            return res.status(400).json({ error: 'Date of birth is required' });
        }

        // Calculate Life Path Number
        const parts = dob.split('-'); // [YYYY, MM, DD]
        const yearSum = calculateSingleDigit(parseInt(parts[0], 10));
        const monthSum = calculateSingleDigit(parseInt(parts[1], 10));
        const daySum = calculateSingleDigit(parseInt(parts[2], 10));

        const lifePathNumber = calculateSingleDigit(yearSum + monthSum + daySum);

        let meanings: Record<number, string> = {
            1: "The Leader: Independent, pioneering, and fiercely individualistic.",
            2: "The Peacemaker: Diplomatic, sensitive, and cooperative.",
            3: "The Communicator: Expressive, creative, and sociable.",
            4: "The Builder: Practical, hardworking, and disciplined.",
            5: "The Adventurer: Freedom-loving, versatile, and dynamic.",
            6: "The Nurturer: Responsible, caring, and protective.",
            7: "The Seeker: Analytical, spiritual, and intellectual.",
            8: "The Powerhouse: Ambitious, authoritative, and goal-oriented.",
            9: "The Humanitarian: Compassionate, generous, and idealistic.",
            11: "The Intuitive: A master number associated with spiritual insight and inspiration.",
            22: "The Master Builder: A master number capable of turning dreams into reality.",
            33: "The Master Teacher: A rare master number symbolizing pure love and guidance."
        };

        res.json({
            success: true,
            data: {
                lifePathNumber,
                meaning: meanings[lifePathNumber] || "Unknown",
                name
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate numerology' });
    }
}

// Authentic Vedic Muhurat Calculation using live Sunrise/Sunset API
export async function getMuhurat(req: Request, res: Response) {
    try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];

        // Fetch live sunrise/sunset for New Delhi (approximate center for IST)
        const lat = 28.6139;
        const lng = 77.2090;
        const response = await axios.get(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`);
        const { sunrise, sunset, solar_noon } = response.data.results;

        const sunriseTime = new Date(sunrise).getTime();
        const sunsetTime = new Date(sunset).getTime();
        const noonTime = new Date(solar_noon).getTime();

        // Calculate Day Duration in milliseconds
        const dayDurationMs = sunsetTime - sunriseTime;

        // Abhijit Muhurat: 1/15th of the day length, centered strictly around solar noon
        const abhijitDurationMs = dayDurationMs / 15;
        const abhijitStart = new Date(noonTime - (abhijitDurationMs / 2));
        const abhijitEnd = new Date(noonTime + (abhijitDurationMs / 2));

        // Rahu Kaal: 1/8th of the day length. Part varies by day of the week (Sun=0 to Sat=6)
        const rahuDurationMs = dayDurationMs / 8;
        const rahuParts = [7, 1, 6, 4, 5, 3, 2];
        const dayOfWeek = today.getDay();
        const rahuStart = new Date(sunriseTime + (rahuParts[dayOfWeek] * rahuDurationMs));
        const rahuEnd = new Date(rahuStart.getTime() + rahuDurationMs);

        const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        res.json({
            success: true,
            data: {
                date: dateStr,
                muhurats: [
                    {
                        name: "Abhijit Muhurat",
                        time: `${formatTime(abhijitStart)} - ${formatTime(abhijitEnd)}`,
                        type: "auspicious",
                        description: "Extremely auspicious time for starting any new endeavor."
                    },
                    {
                        name: "Rahu Kaal",
                        time: `${formatTime(rahuStart)} - ${formatTime(rahuEnd)}`,
                        type: "inauspicious",
                        description: "Inauspicious time of the day. Avoid starting important tasks."
                    }
                ]
            }
        });
    } catch (error) {
        console.error("Muhurat calculation failed:", error);
        res.status(500).json({ error: 'Failed to calculate muhurat' });
    }
}

/**
 * AI Astrologer Chat Endpoint
 */
export async function askAstrologerAI(req: Request, res: Response) {
    try {
        const { message, history = [], userSign } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        // Base context for the AI
        const systemPrompt = {
            role: "system",
            content: `You are an expert Vedic astrologer named Panditji AI. Your goal is to guide users with wisdom, warmth, and astrological insight based on Vedic traditions.
            
            FORMATTING RULES (CRITICAL):
            1. NEVER write a single solid wall of text.
            2. ALWAYS use clear paragraphs with double line breaks between them.
            3. Whenever providing multiple points of advice, remedies, or insights, ALWAYS use Markdown bullet points (hyphens '-') or numbered lists.
            4. Bold important keywords using **Markdown**.
            
            CONTENT RULES:
            1. Keep responses clear and concise unless asked for a deep reading.
            2. If the user asks about their horoscope or future, incorporate typical Vedic advice (remedies, auspicious colors).
            3. If the user provides their zodiac sign, tailor the reading to that sign.
            4. You can speak English or Hindi seamlessly. If the user types in Hindi, ALWAYS respond in natural, fluent Hindi.
            
            Current User Sign: ${userSign || 'Unknown'}`
        };

        const formattedHistory = history.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        const messages = [
            systemPrompt,
            ...formattedHistory,
            { role: "user", content: message }
        ];

        const aiResponse = await generateAstrologyResponse(messages);

        res.json({
            success: true,
            data: {
                reply: aiResponse
            }
        });

    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ success: false, error: 'Failed to communicate with AI Astrologer.' });
    }
}
