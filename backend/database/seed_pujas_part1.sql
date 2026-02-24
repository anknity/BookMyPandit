-- Seed Part 1: Pujas 1-24 (Mantra Jaap, Sanskar, Graha Puja, Home)
INSERT INTO services (name, name_hi, description, description_hi, category, base_price, duration, duration_hours, image_url, is_active, mantra_count, pandits_required, samagri_available, items_included, benefits) VALUES

-- MANTRA JAAP
('Rahu Vedic Mantra Jaap', 'राहु वैदिक मन्त्र जाप', 'Powerful Vedic mantra jaap to pacify Rahu and reduce its malefic effects on career, health, and relationships.', 'राहु ग्रह की शांति के लिए वैदिक मन्त्र जाप। करियर, स्वास्थ्य और संबंधों पर राहु के अशुभ प्रभावों को कम करता है।', 'Mantra Jaap', 5100, '2-3 Hours', '2-3', NULL, TRUE, '18,000', 1, TRUE,
  ARRAY['Experienced Vedic Pandit', 'Rahu Yantra Energization', 'Havan Samagri', 'Prasad Distribution'],
  ARRAY['Career growth', 'Mental peace', 'Protection from negativity', 'Rahu dosh remedy']),

('Ketu Vedic Mantra Jaap', 'केतु वैदिक मन्त्र जाप', 'Sacred Vedic mantra jaap for Ketu shanti, bringing spiritual growth and removal of obstacles.', 'केतु ग्रह की शांति के लिए वैदिक मन्त्र जाप। आध्यात्मिक विकास और बाधाओं के निवारण हेतु।', 'Mantra Jaap', 5100, '2-3 Hours', '2-3', NULL, TRUE, '17,000', 1, TRUE,
  ARRAY['Experienced Vedic Pandit', 'Ketu Yantra Energization', 'Havan Samagri', 'Prasad Distribution'],
  ARRAY['Spiritual growth', 'Obstacle removal', 'Moksha blessings', 'Ketu dosh remedy']),

('Maha Mrityunjaya Mantra Jaap', 'महामृत्युंजय मन्त्र जाप', 'The most powerful life-saving mantra jaap of Lord Shiva for health, longevity, and protection from untimely death.', 'भगवान शिव का सबसे शक्तिशाली मंत्र जाप — स्वास्थ्य, दीर्घायु और अकाल मृत्यु से रक्षा हेतु।', 'Mantra Jaap', 11000, '3 Days', '72', NULL, TRUE, '1,25,000', 2, TRUE,
  ARRAY['2 Experienced Vedic Pandits', 'Rudraksha Mala', 'Bilva Patra', 'Havan with Ghee', 'Prasad & Bhandara'],
  ARRAY['Health & longevity', 'Protection from diseases', 'Victory over fear', 'Divine blessings of Shiva']),

('Katyayani Mantra Jaap', 'कात्यायनी जाप', 'Sacred jaap of Goddess Katyayani for marriage obstacles removal, relationship harmony, and fulfilling matrimonial wishes.', 'माँ कात्यायनी का पवित्र जाप — विवाह में आ रही बाधाओं के निवारण और शुभ वैवाहिक जीवन हेतु।', 'Mantra Jaap', 7500, '1-2 Days', '24', NULL, TRUE, '41,000', 1, TRUE,
  ARRAY['Experienced Vedic Pandit', 'Katyayani Yantra', 'Red Flowers & Chunri', 'Havan Samagri'],
  ARRAY['Marriage obstacle removal', 'Relationship harmony', 'Marital bliss', 'Manglik dosh remedy']),

-- PATH & STOTRA
('Durga Saptashati Paath (Samput)', 'दुर्गा सप्तसती पाठ सम्पूट', 'Complete recitation of Durga Saptashati with specific samput mantras for intensified divine protection and wish fulfillment.', 'विशेष सम्पूट मन्त्रों के साथ दुर्गा सप्तसती का सम्पूर्ण पाठ — दिव्य सुरक्षा और मनोकामना पूर्ति हेतु।', 'Path & Stotra', 5500, '4-5 Hours', '4-5', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Durga Saptashati Book', 'Havan Samagri', 'Red Flowers & Chunri'],
  ARRAY['Divine protection', 'Wish fulfillment', 'Enemy protection', 'Goddess Durga blessings']),

('Durga Saptashati Paath (Complete)', 'दुर्गा सप्तसती पाठ सम्पूर्ण', 'Full recitation of all 700 shlokas of Durga Saptashati for supreme blessings of Goddess Durga.', 'माँ दुर्गा की कृपा प्राप्ति हेतु दुर्गा सप्तसती के सम्पूर्ण 700 श्लोकों का पाठ।', 'Path & Stotra', 3100, '3-4 Hours', '3-4', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Durga Saptashati Book', 'Incense & Flowers', 'Prasad'],
  ARRAY['Courage & strength', 'Negativity removal', 'Success in endeavors', 'Family protection']),

-- SANSKAR
('Yagyopavit Sanskar (Janeu)', 'यज्ञोपवित संस्कार (जनेऊ)', 'Sacred thread ceremony marking the spiritual initiation of a boy into Vedic learning and responsibilities.', 'बालक के वैदिक शिक्षा और कर्तव्यों में दीक्षा का पवित्र उपनयन संस्कार।', 'Sanskar', 5100, '3-4 Hours', '3-4', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Experienced Vedic Pandit', 'Sacred Thread (Janeu)', 'Havan Samagri', 'Ganesh & Kalash Sthapana'],
  ARRAY['Spiritual initiation', 'Vedic education blessing', 'Character development', 'Family tradition']),

('Karn Vedh Sanskar', 'कर्ण वेध संस्कार', 'Traditional ear-piercing ceremony performed with Vedic mantras for the well-being and longevity of the child.', 'बालक/बालिका की दीर्घायु और कल्याण हेतु वैदिक मन्त्रों के साथ कर्ण छेदन संस्कार।', 'Sanskar', 2100, '1-2 Hours', '1-2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Gold/Silver Needle', 'Havan Samagri', 'Prasad'],
  ARRAY['Child well-being', 'Longevity', 'Traditional blessing', 'Health benefits']),

('Mundan Sanskar Puja', 'मुंडन संस्कार पूजा', 'First head-shaving ceremony of a child with full Vedic rituals for purification and good fortune.', 'बालक के प्रथम मुंडन का पवित्र संस्कार — शुद्धि और शुभ भाग्य हेतु वैदिक विधि-विधान के साथ।', 'Sanskar', 3100, '2-3 Hours', '2-3', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Havan Samagri', 'Ganesh Puja', 'Navagraha Puja', 'Prasad & Bhandara'],
  ARRAY['Purification', 'Good fortune', 'Healthy hair growth', 'Positive energy']),

-- HOME & BUSINESS
('Griha Pravesh Puja', 'गृह प्रवेश पूजा', 'Essential rituals for entering a new house with divine blessings for prosperity, peace, and protection.', 'नए घर में प्रवेश के लिए आवश्यक पूजा — समृद्धि, शांति और सुरक्षा हेतु दिव्य आशीर्वाद।', 'Home & Business', 5100, '3-4 Hours', '3-4', NULL, TRUE, NULL, 2, TRUE,
  ARRAY['2 Experienced Pandits', 'Ganesh & Kalash Sthapana', 'Vastu Puja', 'Navagraha Puja', 'Havan with Ghee', 'Prasad'],
  ARRAY['Prosperity', 'Peace & harmony', 'Vastu dosh removal', 'Divine protection']),

('Bhumi Pujan', 'भूमि पूजन', 'Ground-breaking ceremony with Vedic rituals before construction to seek divine blessings for the land.', 'निर्माण कार्य प्रारंभ से पूर्व भूमि पूजन — भूमि पर दिव्य आशीर्वाद प्राप्ति हेतु।', 'Home & Business', 5100, '2-3 Hours', '2-3', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Bhumi Puja Samagri', 'Nariyal & Kalash', 'Havan Samagri'],
  ARRAY['Auspicious beginning', 'Vastu harmony', 'Obstacle-free construction', 'Prosperity']),

-- DAAN
('Grahan Daan', 'ग्रहण दान', 'Sacred charity during solar or lunar eclipse to neutralize negative effects and gain spiritual merit.', 'सूर्य या चंद्र ग्रहण के समय नकारात्मक प्रभावों को दूर करने और पुण्य लाभ हेतु पवित्र दान।', 'Daan & Charity', 2100, '1 Hour', '1', NULL, TRUE, NULL, 1, FALSE,
  ARRAY['Vedic Pandit', 'Daan Items (as per requirement)', 'Mantra Chanting'],
  ARRAY['Negative effect removal', 'Spiritual merit', 'Planetary pacification', 'Good karma']),

-- GRAHA PUJA
('Shani Puja', 'शनि पूजा', 'Dedicated puja to Lord Shani for relief from Sade Sati, Shani Dhaiya, and other Saturn-related afflictions.', 'शनि देव की पूजा — साढ़ेसाती, शनि ढैय्या और शनि संबंधित कष्टों से राहत हेतु।', 'Graha Puja', 3100, '2-3 Hours', '2-3', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Shani Yantra', 'Black Sesame & Mustard Oil', 'Iron Items', 'Havan Samagri'],
  ARRAY['Sade Sati relief', 'Career stability', 'Justice & discipline', 'Saturn blessings']),

('Shukra Puja / Santoshi Mata / Vaibhav Lakshmi', 'शुक्र पूजा, संतोषी माता, वैभव लक्ष्मी पूजा', 'Combined Venus puja with Santoshi Mata and Vaibhav Lakshmi worship for wealth, happiness, and marital harmony.', 'धन, सुख और वैवाहिक सामंजस्य हेतु शुक्र पूजा, संतोषी माता और वैभव लक्ष्मी पूजा।', 'Graha Puja', 3100, '2-3 Hours', '2-3', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'White Flowers & Sweets', 'Lakshmi Yantra', 'Havan Samagri'],
  ARRAY['Wealth & prosperity', 'Marital harmony', 'Happiness', 'Venus blessings']),

('Guru Puja / Brihaspati Puja', 'गुरु पूजा, गुरु पूर्णिमा, बृहस्पति पूजा', 'Jupiter worship for wisdom, education, financial growth, and spiritual advancement.', 'ज्ञान, शिक्षा, आर्थिक विकास और आध्यात्मिक उन्नति हेतु गुरु/बृहस्पति पूजा।', 'Graha Puja', 3100, '2-3 Hours', '2-3', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Yellow Flowers & Turmeric', 'Guru Yantra', 'Havan Samagri'],
  ARRAY['Wisdom & knowledge', 'Educational success', 'Financial growth', 'Jupiter blessings']),

('Budh Puja', 'बुध पूजा', 'Mercury worship for enhanced communication, intellect, business acumen, and analytical abilities.', 'बुद्धि, वाणी, व्यापार कौशल और विश्लेषणात्मक क्षमता वृद्धि हेतु बुध ग्रह पूजा।', 'Graha Puja', 2500, '2 Hours', '2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Green Items & Moong Dal', 'Budh Yantra', 'Havan Samagri'],
  ARRAY['Sharp intellect', 'Business success', 'Communication skills', 'Mercury blessings']),

('Hanuman Dhwaja Rohan Puja', 'हनुमान ध्वजा रोपण पूजा', 'Installation of Hanuman flag with full Vedic rituals for protection, courage, and removal of evil forces.', 'हनुमान जी के ध्वज स्थापना पूजा — सुरक्षा, साहस और बुरी शक्तियों से रक्षा हेतु।', 'Special Puja', 3500, '2-3 Hours', '2-3', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Hanuman Dhwaja (Flag)', 'Sindoor & Oil', 'Havan Samagri', 'Prasad'],
  ARRAY['Protection from evil', 'Courage & strength', 'Home protection', 'Hanuman blessings']),

('Chandra Puja', 'चंद्र पूजा', 'Moon worship for emotional balance, mental peace, and prosperity. Especially beneficial for Chandra dosh.', 'चंद्र ग्रह की पूजा — भावनात्मक संतुलन, मानसिक शांति और समृद्धि हेतु। चंद्र दोष में विशेष लाभकारी।', 'Graha Puja', 2500, '2 Hours', '2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'White Flowers & Rice', 'Chandra Yantra', 'Havan Samagri'],
  ARRAY['Mental peace', 'Emotional balance', 'Prosperity', 'Moon blessings']),

('Mangal Puja', 'मंगल पूजा', 'Mars worship for courage, property matters, marital harmony, and Manglik dosh remedy.', 'मंगल ग्रह की पूजा — साहस, संपत्ति संबंधी मामले, वैवाहिक सामंजस्य और मांगलिक दोष निवारण हेतु।', 'Graha Puja', 2500, '2 Hours', '2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Red Flowers & Masoor Dal', 'Mangal Yantra', 'Havan Samagri'],
  ARRAY['Courage & confidence', 'Property success', 'Manglik remedy', 'Mars blessings']),

-- MORE PATH
('Durga Saptashati Paath (Chhuta)', 'दुर्गा सप्तसती पाठ (छूटा)', 'Selected chapters of Durga Saptashati for quick divine intervention and protection.', 'त्वरित दिव्य हस्तक्षेप और सुरक्षा हेतु दुर्गा सप्तसती के चुनिंदा अध्यायों का पाठ।', 'Path & Stotra', 1500, '1-2 Hours', '1-2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Durga Saptashati Book', 'Incense & Flowers'],
  ARRAY['Quick protection', 'Negativity removal', 'Courage', 'Goddess blessings']),

('Sundar Kand Paath', 'सुंदर कांड पाठ', 'Recitation of Sundar Kand from Ramcharitmanas for removing obstacles and bringing good fortune.', 'रामचरितमानस के सुंदर कांड का पाठ — बाधाओं के निवारण और शुभ भाग्य हेतु।', 'Path & Stotra', 2100, '2-3 Hours', '2-3', NULL, TRUE, NULL, 1, FALSE,
  ARRAY['Vedic Pandit', 'Ramcharitmanas', 'Flowers & Incense', 'Prasad'],
  ARRAY['Obstacle removal', 'Good fortune', 'Hanuman blessings', 'Family harmony']),

('Chalisa Paath', 'चालीसा पाठ', 'Recitation of sacred Chalisa (Hanuman/Durga/Shiv) for specific divine blessings and protection.', 'विशेष दिव्य आशीर्वाद और सुरक्षा हेतु पवित्र चालीसा (हनुमान/दुर्गा/शिव) का पाठ।', 'Path & Stotra', 1100, '1 Hour', '1', NULL, TRUE, NULL, 1, FALSE,
  ARRAY['Vedic Pandit', 'Chalisa Book', 'Flowers & Incense'],
  ARRAY['Divine protection', 'Wish fulfillment', 'Spiritual upliftment', 'Peace of mind']),

('Vishnu Sahasranaam', 'विष्णु सहस्रनाम', 'Recitation of 1000 names of Lord Vishnu for prosperity, protection, and liberation.', 'भगवान विष्णु के 1000 नामों का पाठ — समृद्धि, सुरक्षा और मोक्ष प्राप्ति हेतु।', 'Path & Stotra', 2100, '2 Hours', '2', NULL, TRUE, NULL, 1, FALSE,
  ARRAY['Vedic Pandit', 'Vishnu Sahasranaam Book', 'Tulsi Leaves & Flowers'],
  ARRAY['Prosperity', 'Divine protection', 'Moksha path', 'Vishnu blessings']),

('Business Inauguration Puja', 'बिजनेस उद्घाटन पूजा', 'Auspicious puja for new business/shop/office inauguration with Ganesh Puja, Lakshmi Puja, and Havan.', 'नए व्यवसाय/दुकान/कार्यालय के शुभ उद्घाटन हेतु गणेश पूजा, लक्ष्मी पूजा और हवन।', 'Home & Business', 5100, '2-3 Hours', '2-3', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Ganesh & Lakshmi Murti', 'Kalash Sthapana', 'Havan Samagri', 'Nariyal & Flowers'],
  ARRAY['Business prosperity', 'Customer attraction', 'Obstacle removal', 'Financial growth']);
