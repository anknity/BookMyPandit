-- Seed Part 2: Pujas 25-48
INSERT INTO services (name, name_hi, description, description_hi, category, base_price, duration, duration_hours, image_url, is_active, mantra_count, pandits_required, samagri_available, items_included, benefits) VALUES

('Ram Raksha Stotra', 'राम रक्षा स्तोत्र', 'Powerful protective hymn of Lord Ram for shielding from all dangers and negative energies.', 'सभी खतरों और नकारात्मक ऊर्जाओं से सुरक्षा हेतु भगवान राम का शक्तिशाली रक्षा स्तोत्र।', 'Path & Stotra', 1500, '1 Hour', '1', NULL, TRUE, NULL, 1, FALSE,
  ARRAY['Vedic Pandit', 'Ram Raksha Stotra Book', 'Flowers & Incense'],
  ARRAY['Protection', 'Courage', 'Negative energy removal', 'Ram blessings']),

('Ramayan Paath', 'रामायण पाठ', 'Complete or Akhand recitation of Ramcharitmanas for familial harmony, righteousness, and divine grace.', 'पारिवारिक सामंजस्य, धर्म और दिव्य कृपा हेतु रामचरितमानस का सम्पूर्ण या अखंड पाठ।', 'Path & Stotra', 5100, '1-3 Days', '24-72', NULL, TRUE, NULL, 2, TRUE,
  ARRAY['2 Vedic Pandits', 'Ramcharitmanas', 'Akhand Jyoti', 'Havan Samagri', 'Prasad & Bhandara'],
  ARRAY['Family harmony', 'Righteousness', 'Divine grace', 'Peace & prosperity']),

('Rudrabhishek', 'रुद्राभिषेक', 'Sacred abhishek of Lord Shiva with milk, honey, curd, and holy offerings for blessings of health and prosperity.', 'स्वास्थ्य और समृद्धि के आशीर्वाद हेतु दूध, शहद, दही और पवित्र सामग्री से भगवान शिव का अभिषेक।', 'Special Puja', 4100, '2-3 Hours', '2-3', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Shivling', 'Panchamrit (Milk, Honey, Curd, Ghee, Sugar)', 'Bilva Patra', 'Havan Samagri'],
  ARRAY['Health & prosperity', 'Sin removal', 'Wish fulfillment', 'Shiva blessings']),

('Vivah (Marriage Ceremony)', 'विवाह', 'Complete Vedic marriage ceremony with all traditional rituals, mantras, and sacred fire.', 'सम्पूर्ण वैदिक विवाह संस्कार — सभी पारंपरिक रीति-रिवाज, मन्त्र और पवित्र अग्नि के साथ।', 'Sanskar', 11000, '4-6 Hours', '4-6', NULL, TRUE, NULL, 2, TRUE,
  ARRAY['2 Experienced Pandits', 'Mandap Setup Guidance', 'Havan Kund & Samagri', 'All Vivah Rituals', 'Ganesh & Kalash Sthapana'],
  ARRAY['Auspicious union', 'Lifelong bond', 'Family blessings', 'Vedic tradition']),

('Haldi Kalash', 'हल्दी कलश', 'Pre-wedding Haldi ceremony with Vedic rituals and traditional kalash sthapana.', 'वैदिक विधि और पारंपरिक कलश स्थापना के साथ विवाह पूर्व हल्दी संस्कार।', 'Sanskar', 2100, '1-2 Hours', '1-2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Haldi & Kalash', 'Mango Leaves', 'Coconut & Flowers'],
  ARRAY['Purification', 'Beauty blessings', 'Auspicious beginning', 'Traditional blessing']),

('Surya Puja', 'सूर्य पूजा', 'Sun worship for vitality, leadership, government favors, and relief from Surya-related doshas.', 'जीवन शक्ति, नेतृत्व, सरकारी कार्यों में सफलता और सूर्य दोष निवारण हेतु सूर्य पूजा।', 'Graha Puja', 2500, '2 Hours', '2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Red Flowers & Wheat', 'Surya Yantra', 'Havan Samagri'],
  ARRAY['Vitality & health', 'Leadership qualities', 'Government success', 'Surya blessings']),

('Kali Puja', 'काली पूजा', 'Worship of Goddess Kali for destruction of evil forces, protection, and immense power.', 'बुरी शक्तियों के विनाश, सुरक्षा और अपार शक्ति हेतु माँ काली की पूजा।', 'Special Puja', 5100, '3-4 Hours', '3-4', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Experienced Tantrik Pandit', 'Kali Murti/Yantra', 'Red Flowers & Hibiscus', 'Havan Samagri', 'Special Offerings'],
  ARRAY['Evil force destruction', 'Immense protection', 'Fearlessness', 'Kali Mata blessings']),

('Krishna Janmashtami Puja', 'कृष्ण जन्माष्टमी पूजा', 'Celebration of Lord Krishna birth with midnight puja, bhajan, and traditional rituals.', 'भगवान कृष्ण के जन्मोत्सव — मध्यरात्रि पूजा, भजन और पारंपरिक अनुष्ठानों के साथ।', 'Special Puja', 3100, '3-4 Hours', '3-4', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Krishna Murti & Jhula', 'Makhan & Mishri', 'Flowers & Tulsi', 'Prasad'],
  ARRAY['Krishna blessings', 'Family happiness', 'Prosperity', 'Spiritual growth']),

('Narayan Bali Shraddh', 'नारायण बली श्राद्ध', 'Advanced ancestral rites to liberate souls of departed from cycle of rebirth and relieve Pitra dosh.', 'पूर्वजों की आत्माओं की मुक्ति और पितृ दोष निवारण हेतु उन्नत श्राद्ध कर्म।', 'Shraddh & Pitra', 11000, '1 Day', '8', NULL, TRUE, NULL, 2, TRUE,
  ARRAY['2 Experienced Pandits', 'Bali Vidhi Samagri', 'Pind Daan Items', 'Havan & Tarpan', 'Brahmin Bhoj'],
  ARRAY['Ancestral soul liberation', 'Pitra dosh remedy', 'Family peace', 'Spiritual merit']),

('Satyanarayan Katha', 'सत्यानारायण कथा', 'Most popular puja for prosperity and well-being, performed on Purnima or auspicious occasions.', 'समृद्धि और कल्याण हेतु सबसे लोकप्रिय पूजा — पूर्णिमा या शुभ अवसरों पर की जाती है।', 'Special Puja', 2100, '2-3 Hours', '2-3', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Satyanarayan Katha Book', 'Panchamrit & Prasad', 'Banana Leaves', 'Havan Samagri'],
  ARRAY['Wish fulfillment', 'Prosperity', 'Family well-being', 'Vishnu blessings']),

('Chhaya Daan', 'छाया दान', 'Shadow donation ritual to ward off malefic planetary effects and earn spiritual merit.', 'ग्रहों के अशुभ प्रभावों को दूर करने और आध्यात्मिक पुण्य अर्जित करने हेतु छाया दान।', 'Daan & Charity', 2100, '1 Hour', '1', NULL, TRUE, NULL, 1, FALSE,
  ARRAY['Vedic Pandit', 'Shadow Daan Items', 'Mantra Chanting'],
  ARRAY['Planetary pacification', 'Spiritual merit', 'Health benefits', 'Dosh nivaran']),

-- DOSH NIVARAN
('Grahan Dosh Nivaran Puja', 'ग्रहण दोष निवारण पूजा', 'Specific puja to remove the ill effects of being born during an eclipse or grahan dosh in kundli.', 'ग्रहण के समय जन्म या कुंडली में ग्रहण दोष के दुष्प्रभावों को दूर करने हेतु विशेष पूजा।', 'Dosh Nivaran', 5100, '3-4 Hours', '3-4', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Experienced Vedic Pandit', 'Grahan Dosh Yantra', 'Havan Samagri', 'Daan Items'],
  ARRAY['Eclipse dosh removal', 'Health improvement', 'Positive energy', 'Peace of mind']),

('Karj Mukti Puja', 'कर्ज मुक्ति पूजा', 'Special puja to overcome debt and financial burdens through divine intervention.', 'दिव्य हस्तक्षेप द्वारा ऋण और आर्थिक बोझ से मुक्ति हेतु विशेष पूजा।', 'Dosh Nivaran', 3500, '2-3 Hours', '2-3', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Lakshmi & Ganesh Puja', 'Havan Samagri', 'Specific Daan'],
  ARRAY['Debt freedom', 'Financial stability', 'Prosperity', 'Mental peace']),

('Rog Mukti Puja', 'रोग मुक्ति पूजा', 'Healing puja for relief from chronic diseases and health issues through Vedic rituals and mantras.', 'वैदिक अनुष्ठानों और मन्त्रों द्वारा पुरानी बीमारियों और स्वास्थ्य समस्याओं से राहत हेतु उपचार पूजा।', 'Dosh Nivaran', 3500, '2-3 Hours', '2-3', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Mrityunjaya Jaap', 'Dhanvantari Puja', 'Havan Samagri', 'Aushadhi Daan'],
  ARRAY['Disease relief', 'Health restoration', 'Longevity', 'Divine healing']),

('Ghritdhari', 'घृतधारी', 'Continuous pouring of ghee on Shivling for wish fulfillment and Shiva blessings.', 'मनोकामना पूर्ति और शिव आशीर्वाद हेतु शिवलिंग पर घी की अविरल धारा।', 'Special Puja', 2100, '1-2 Hours', '1-2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Pure Cow Ghee', 'Shivling', 'Bilva Patra & Flowers'],
  ARRAY['Wish fulfillment', 'Sin removal', 'Prosperity', 'Shiva blessings']),

('Mandap Achchhadan', 'मंडप आच्छादन', 'Traditional ritual of decorating and consecrating the wedding mandap before the ceremony.', 'विवाह संस्कार से पूर्व मंडप को सजाने और पवित्र करने की पारंपरिक विधि।', 'Sanskar', 3100, '2-3 Hours', '2-3', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Mandap Decoration Items', 'Kalash & Nariyal', 'Mango Leaves'],
  ARRAY['Auspicious ceremony', 'Divine blessings', 'Traditional beauty', 'Sacred space']),

('Kal Bhairav Puja', 'काल भैरव पूजा', 'Worship of Kal Bhairav, fierce form of Shiva, for protection from enemies and black magic.', 'शत्रुओं और काले जादू से रक्षा हेतु शिव के उग्र रूप काल भैरव की पूजा।', 'Special Puja', 5100, '3-4 Hours', '3-4', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Experienced Tantrik Pandit', 'Bhairav Yantra', 'Mustard Oil & Black Items', 'Havan Samagri'],
  ARRAY['Enemy protection', 'Black magic removal', 'Fearlessness', 'Bhairav blessings']),

('Tripindi Shraddh', 'त्रिपिंडी श्राद्ध', 'Special ancestral rites for three generations of departed souls to attain peace and liberation.', 'तीन पीढ़ियों की दिवंगत आत्माओं की शांति और मुक्ति हेतु विशेष श्राद्ध कर्म।', 'Shraddh & Pitra', 5100, '3-4 Hours', '3-4', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Experienced Vedic Pandit', 'Tripindi Samagri', 'Pind Daan Items', 'Tarpan & Havan', 'Brahmin Bhoj'],
  ARRAY['3-generation ancestral peace', 'Pitra dosh removal', 'Family prosperity', 'Spiritual merit']),

('Kal Sarp Dosh Nivaran Puja', 'काल सर्प दोष निवारण पूजा', 'Powerful remedy puja for Kal Sarp Yog/Dosh in kundli — removes obstacles in career, marriage, and health.', 'कुंडली में काल सर्प योग/दोष का शक्तिशाली निवारण — करियर, विवाह और स्वास्थ्य में बाधाओं को दूर करता है।', 'Dosh Nivaran', 7500, '4-5 Hours', '4-5', NULL, TRUE, NULL, 2, TRUE,
  ARRAY['2 Experienced Pandits', 'Nag Puja & Yantra', 'Silver Nag', 'Havan Samagri', 'Specific Daan'],
  ARRAY['All-round obstacle removal', 'Career growth', 'Marriage facilitation', 'Health improvement']),

('Manglik Dosh Nivaran Puja', 'मांगलिक दोष निवारण पूजा', 'Essential puja for Manglik individuals to reduce Mars affliction and enable smooth marriage.', 'मांगलिक व्यक्तियों के लिए मंगल दोष को कम करने और सुचारू विवाह हेतु आवश्यक पूजा।', 'Dosh Nivaran', 5100, '3-4 Hours', '3-4', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Experienced Vedic Pandit', 'Mangal Yantra', 'Red Coral & Items', 'Kumbh Vivah Items', 'Havan Samagri'],
  ARRAY['Mangal dosh remedy', 'Marriage facilitation', 'Marital harmony', 'Confidence']),

('Pitra Dosh Nivaran Puja', 'पितृ दोष निवारण पूजा', 'Comprehensive puja to pacify displeased ancestors and remove Pitra dosh effects from kundli.', 'कुंडली से पितृ दोष के प्रभावों को दूर करने और अप्रसन्न पूर्वजों को शांत करने हेतु व्यापक पूजा।', 'Dosh Nivaran', 5100, '3-4 Hours', '3-4', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Experienced Vedic Pandit', 'Tarpan Samagri', 'Pind Daan Items', 'Havan & Homam', 'Brahmin Bhoj'],
  ARRAY['Ancestral peace', 'Dosh removal', 'Family harmony', 'Progeny blessings']),

('Geeta Paath', 'गीता पाठ', 'Complete recitation of Shrimad Bhagavad Gita for spiritual wisdom and life guidance.', 'आध्यात्मिक ज्ञान और जीवन मार्गदर्शन हेतु श्रीमद भगवद गीता का सम्पूर्ण पाठ।', 'Path & Stotra', 2100, '3-4 Hours', '3-4', NULL, TRUE, NULL, 1, FALSE,
  ARRAY['Vedic Pandit', 'Bhagavad Gita', 'Flowers & Incense', 'Prasad'],
  ARRAY['Spiritual wisdom', 'Life clarity', 'Peace of mind', 'Krishna blessings']),

('Gaya Shraddh', 'गया श्राद्ध', 'Sacred Pind Daan at Gaya for liberation of ancestral souls — performed by pandit with Gaya vidhi expertise.', 'पूर्वजों की आत्माओं की मुक्ति हेतु गया में पवित्र पिंड दान — गया विधि विशेषज्ञ पंडित द्वारा।', 'Shraddh & Pitra', 11000, '1 Day', '8', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Gaya Vidhi Expert Pandit', 'Pind Daan Samagri', 'Tarpan Items', 'Brahmin Bhoj', 'Travel Guidance'],
  ARRAY['Ultimate ancestral liberation', 'Moksha for departed', 'Pitra dosh cure', 'Spiritual merit']),

('Annaprashan', 'अन्नप्राशन', 'Baby first rice-feeding ceremony with Vedic mantras for health, growth, and prosperity of the child.', 'शिशु के स्वास्थ्य, विकास और समृद्धि हेतु वैदिक मन्त्रों के साथ प्रथम अन्न ग्रहण संस्कार।', 'Sanskar', 2100, '1-2 Hours', '1-2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Silver Bowl & Spoon', 'Kheer/Payasam', 'Ganesh Puja', 'Havan Samagri'],
  ARRAY['Child health', 'Growth & prosperity', 'Digestive strength', 'Auspicious beginning']);
