import { Router } from 'express';
import { getHoroscope, getDailyTarot, calculateNumerology, getMuhurat, askAstrologerAI } from '../controllers/astrologyController.js';

const router = Router();

// Note: /horoscope/all needs to be defined BEFORE /horoscope/:period/:sign to avoid 'all' being captured as a period
router.get('/horoscope/all', async (req, res) => {
    // For now we will return a mock subset or make parallel calls if required.
    // The previous implementation assumed an all endpoint existed. Let's create a quick proxy for all.
    // Since horoscope-app-api doesn't have an "all" endpoint natively, we'll return a mock for the slider
    // or we'd have to make 12 requests which is slow.
    const lang = req.query.lang as string || 'en';

    if (lang === 'hi') {
        res.json({
            success: true,
            data: {
                Aries: "आज अपने करियर पर ध्यान दें। एक आश्चर्यजनक अवसर आ सकता है।",
                Taurus: "आर्थिक स्थिति स्थिर दिख रही है, लेकिन बिना सोचे-समझे खरीदारी से बचें।",
                Gemini: "संचार आज आपका मजबूत पक्ष है। पुराने दोस्तों से संपर्क करें।",
                Cancer: "आत्म-देखभाल के लिए समय निकालें। आपकी भावनात्मक ऊर्जा को फिर से भरने की आवश्यकता है।",
                Leo: "आपका स्वाभाविक नेतृत्व चमक रहा है। उस लंबित प्रोजेक्ट की जिम्मेदारी लें।",
                Virgo: "बारीकियों पर ध्यान दें। एक छोटी सी गलती देरी का कारण बन सकती है।",
                Libra: "आज संतुलन महत्वपूर्ण है। कोई भी निर्णय लेने से पहले सभी विकल्पों पर विचार करें।",
                Scorpio: "आपकी अंतर्ज्ञान शक्ति बढ़ी हुई है। अपनी सहज भावनाओं पर भरोसा करें।",
                Sagittarius: "साहसिक कार्य आपको बुला रहे हैं! दिनचर्या में एक छोटा सा बदलाव भी आपका मूड बेहतर करेगा।",
                Capricorn: "कड़ी मेहनत रंग लाती है। आपको जल्द ही पहचान मिलने वाली है।",
                Aquarius: "अपने अनूठे विचारों को अपनाएं। कोई आपके दृष्टिकोण की ही तलाश में है।",
                Pisces: "आज रचनात्मकता आसानी से बह रही है। इसे किसी पसंदीदा प्रोजेक्ट में लगाएं।"
            }
        });
        return;
    }

    res.json({
        success: true,
        data: {
            Aries: "Focus on your career today. A surprising opportunity might arise.",
            Taurus: "Finances look stable, but avoid impulse buys.",
            Gemini: "Communication is your strong suit today. Reach out to old friends.",
            Cancer: "Take time for self-care. Your emotional energy needs replenishing.",
            Leo: "Your natural leadership shines. Take charge of that pending project.",
            Virgo: "Pay attention to the details. A minor error could cause delays.",
            Libra: "Balance is key today. Weigh all options before making a decision.",
            Scorpio: "Your intuition is heightened. Trust your gut feelings.",
            Sagittarius: "Adventure calls! Even a small change in routine will boost your mood.",
            Capricorn: "Hard work pays off. Recognition is coming your way.",
            Aquarius: "Embrace your unique ideas. Someone is looking for exactly your perspective.",
            Pisces: "Creativity flows easily today. Channel it into a passion project."
        }
    });
});

router.get('/horoscope/:period/:sign', getHoroscope);
router.get('/tarot/daily', getDailyTarot);
router.post('/numerology', calculateNumerology);
router.get('/muhurat', getMuhurat);

// AI Astrologer Route
router.post('/chat', askAstrologerAI);

export default router;
