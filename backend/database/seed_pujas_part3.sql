-- Seed Part 3: Pujas 49-72
INSERT INTO services (name, name_hi, description, description_hi, category, base_price, duration, duration_hours, image_url, is_active, mantra_count, pandits_required, samagri_available, items_included, benefits) VALUES

('Shraddh', 'श्राद्ध', 'Annual ancestral rites performed during Pitru Paksha to honor departed souls.', 'पितृ पक्ष के दौरान दिवंगत पूर्वजों के सम्मान में किया जाने वाला वार्षिक श्राद्ध कर्म।', 'Shraddh & Pitra', 2500, '1 Hour', '1', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Pind Daan Samagri', 'Kush & Tit (Sesame)', 'Tarpan Water', 'Dakshina'],
  ARRAY['Ancestral blessings', 'Family continuity', 'Peace & harmony', 'Good karma']),

('Katha (General)', 'कथा', 'General narrative worship of gods/goddesses for specific occasions and blessings.', 'विशेष अवसरों और आशीर्वाद हेतु देवी-देवताओं की सामान्य कथा।', 'Special Puja', 1500, '1-2 Hours', '1-2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Katha Book', 'Flowers & Prasad', 'Lamp & Incense'],
  ARRAY['Divine stories', 'Moral guidance', 'Spiritual atmosphere', 'Blessings']),

('Teej Vrat Katha', 'तीज व्रत कथा', 'Traditional story recitation for women observing Teej fast for husband longevity.', 'पति की दीर्घायु हेतु तीज व्रत रखने वाली महिलाओं के लिए पारंपरिक कथा पाठ।', 'Special Puja', 1500, '1 Hour', '1', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Teej Katha Book', 'Fruits & Sweets', 'Makeup Items (Suhag)'],
  ARRAY['Marital bliss', 'Husband longevity', 'Family happiness', 'Tradition']),

('Jivitputrika Vrat Katha', 'जीवित पुत्रिका व्रत कथा', 'Sacred story for mothers fasting for the well-being and long life of their children.', 'संतान के कल्याण और दीर्घायु हेतु माताओं द्वारा किए जाने वाले व्रत की पवित्र कथा।', 'Special Puja', 1500, '1 Hour', '1', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Jivitputrika Katha Book', 'Fruits & Thread (Jitiya)'],
  ARRAY['Child safety', 'Longevity', 'Health & success', 'Motherly blessings']),

('Ekadashi Vrat Katha', 'एकादशी व्रत कथा', 'Bi-monthly story recitation on Ekadashi for Vishnu blessings and spiritual merit.', 'विष्णु आशीर्वाद और आध्यात्मिक पुण्य हेतु एकादशी पर पाक्षिक कथा पाठ।', 'Special Puja', 1500, '1 Hour', '1', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Ekadashi Mahatmya Book', 'Tulsi & Flowers', 'Fruits'],
  ARRAY['Sin removal', 'Moksha path', 'Vishnu grace', 'Spiritual purity']),

('Chauth Vrat Katha', 'चौथ व्रत कथा', 'Story of Sankashti/Karwa Chauth for overcoming obstacles and husband well-being.', 'बाधा निवारण और पति के कल्याण हेतु संकष्टी/करवा चौथ की कथा।', 'Special Puja', 1500, '1 Hour', '1', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Chauth Katha Book', 'Arghya Samagri', 'Modak/Sweets'],
  ARRAY['Obstacle removal', 'Marital happiness', 'Ganesh blessings', 'Moon worship']),

('Anant Puja', 'अनंत पूजा', 'Worship of Lord Anant (Vishnu) with sacred thread for endless prosperity and vow fulfillment.', 'अनंत समृद्धि और व्रत पूर्ति हेतु पवित्र धागे के साथ भगवान अनंत (विष्णु) की पूजा।', 'Special Puja', 2100, '2 Hours', '2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Anant Sutra (Thread)', 'Vishnu Idol', 'Sheshnag Puja', 'Sweets'],
  ARRAY['Endless prosperity', 'Vow fulfillment', 'Protection', 'Vishnu blessings']),

('Vishwakarma Puja', 'विश्वकर्मा पूजा', 'Worship of the divine architect for success in engineering, construction, and craftsmanship.', 'इंजीनियरिंग, निर्माण और शिल्प कौशल में सफलता हेतु दिव्य वास्तुकार की पूजा।', 'Home & Business', 3100, '2 Hours', '2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Vishwakarma Idol/Photo', 'Tools Puja', 'Vehicle Puja', 'Sweets'],
  ARRAY['Technical success', 'Safety with tools', 'Innovation', 'Craftsmanship blessings']),

('Kanakdhara Stotra', 'कनक धारा स्तोत्र', 'Powerful hymn by Adi Shankaracharya dedicated to Goddess Lakshmi for immense wealth.', 'अपार धन प्राप्ति हेतु आदि शंकराचार्य द्वारा रचित माँ लक्ष्मी का शक्तिशाली स्तोत्र।', 'Path & Stotra', 1500, '1 Hour', '1', NULL, TRUE, NULL, 1, FALSE,
  ARRAY['Vedic Pandit', 'Kanakdhara Stotra Book', 'Lotus Flowers', 'Gold Coin/Item'],
  ARRAY['Wealth accumulation', 'Poverty removal', 'Financial luck', 'Lakshmi grace']),

('Lakshmi Puja', 'लक्ष्मी पूजा', 'General worship of Goddess Lakshmi for wealth, fortune, and prosperity.', 'धन, भाग्य और समृद्धि हेतु माँ लक्ष्मी की सामान्य पूजा।', 'Special Puja', 2500, '1.5 Hours', '1.5', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Lakshmi Idol', 'Lotus Flowers', 'Sweets & Fruits', 'Coins'],
  ARRAY['Wealth & fortune', 'Business growth', 'Household prosperity', 'Divine grace']),

('Saraswati Puja', 'सरस्वती पूजा', 'Worship of Goddess of Knowledge for wisdom, arts, music, and academic success.', 'ज्ञान, कला, संगीत और शैक्षणिक सफलता हेतु विद्या की देवी की पूजा।', 'Special Puja', 2500, '1.5 Hours', '1.5', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Saraswati Idol', 'Books & Pens', 'White Flowers', 'Yellow Sweets'],
  ARRAY['Academic success', 'Artistic skills', 'Wisdom & memory', 'Saraswati blessings']),

('Akhand Puja', 'अखंड पूजा', 'Continuous worship (usually Ramayan/Kirtan) without interruption for deep spiritual impact.', 'गहरे आध्यात्मिक प्रभाव हेतु बिना किसी रुकावट के निरंतर पूजा (सामान्यतः रामायण/कीर्तन)।', 'Special Puja', 11000, '24 Hours', '24', NULL, TRUE, NULL, 3, TRUE,
  ARRAY['Team of Pandits (Shift-wise)', 'Akhand Jyoti', 'Sound System (if needed)', 'Havan Samagri', 'Continuous Prasad'],
  ARRAY['Deep spiritual vibration', 'Community blessing', 'Divine atmosphere', 'Miraculous results']),

('Ganesh Puja', 'गणेश पूजा', 'Detailed worship of Lord Ganesh to remove obstacles before any new venture.', 'किसी भी नए कार्य से पूर्व बाधाओं को दूर करने हेतु भगवान गणेश की विस्तृत पूजा।', 'Special Puja', 2100, '1 Hour', '1', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Ganesh Idol', 'Durva Grass', 'Modak', 'Red Flowers'],
  ARRAY['Obstacle removal', 'Wisdom & intellect', 'New beginnings', 'Riddhi-Siddhi']),

('Vishnu Abhishek', 'विष्णु अभिषेक', 'Ceremonial bathing of Lord Vishnu idol with sacred substances for preservation and protection.', 'संरक्षण और सुरक्षा हेतु पवित्र पदार्थों से भगवान विष्णु की मूर्ति का औपचारिक अभिषेक।', 'Special Puja', 3500, '2 Hours', '2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Vishnu/Shaligram Idol', 'Panchamrit', 'Tulsi Leaves', 'Conch Shell'],
  ARRAY['Forgiveness of sins', 'Protection', 'Prosperity', 'Vishnu grace']),

('Shrimad Bhagwat Mahapuran Katha (Saptah)', 'श्रीमद भागवत महापुराण कथा (साप्ताहिक)', '7-day recitation of Bhagwat Puran covering the life and teachings of Lord Krishna.', 'भगवान कृष्ण के जीवन और शिक्षाओं को कवर करने वाली भागवत पुराण की 7-दिवसीय कथा।', 'Path & Stotra', 25000, '7 Days', '168', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Expert Katha Vyas', 'Musical Accompaniment (Optional)', 'Vyas Gaddi Setup', 'Daily Prasad', 'Final Bhandara'],
  ARRAY['Ultimate moksha', 'Divine knowledge', 'Krishna bhakti', 'Family liberation']),

('Bhumi Daan', 'भूमि दान', 'Symbolic or actual donation of land for temples/ashrams to earn eternal merit.', 'मंदिरों/आश्रमों के लिए भूमि का प्रतीकात्मक या वास्तविक दान — अनंत पुण्य प्राप्ति हेतु।', 'Daan & Charity', 5100, '2 Hours', '2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Sankalp Vidhi', 'Soil from Land', 'Documents (Symbolic)', 'Dakshina'],
  ARRAY['Eternal merit', 'Stability', 'Legacy', 'Earth blessings']),

('Swarn Daan', 'स्वर्ण दान', 'Donation of gold to Brahmins or temples for wealth and solar blessings.', 'धन और सूर्य आशीर्वाद हेतु ब्राह्मणों या मंदिरों को स्वर्ण दान।', 'Daan & Charity', 2100, '1 Hour', '1', NULL, TRUE, NULL, 1, FALSE,
  ARRAY['Vedic Pandit', 'Sankalp Vidhi', 'Gold Item (client provides)', 'Dakshina'],
  ARRAY['Immense wealth', 'Solar grace', 'High status', 'Purity']),

('Gau Daan', 'गाय दान', 'Donation of a cow (or equivalent value) considered the highest form of charity in Vedas.', 'वेदों में दान का सर्वोच्च रूप माना जाने वाला गाय (या समतुल्य मूल्य) का दान।', 'Daan & Charity', 5100, '1 Hour', '1', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Cow (Symbolic/Real)', 'Fodder', 'Rope & Bucket', 'Sankalp'],
  ARRAY['Highest merit (Punya)', 'Moksha', 'Sin liberation', 'Vaitarni crossing']),

('Chitragupta Puja', 'चित्रगुप्त पूजा', 'Worship of the divine record-keeper by Kayastha community for justice and account-keeping.', 'न्याय और लेखा-जोखा हेतु कायस्थ समुदाय द्वारा दिव्य चित्रगुप्त जी की पूजा।', 'Special Puja', 2500, '1-2 Hours', '1-2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Chitragupta Photo', 'Pen & Ink Pot', 'Accounts Book', 'Sweets'],
  ARRAY['Justice', 'Written word success', 'Career stability', 'Divine record grace']),

('Govardhan Puja', 'गोवर्धन पूजा', 'Worship of Govardhan Hill and cows, usually performed the day after Diwali.', 'दिवाली के अगले दिन की जाने वाली गोवर्धन पर्वत और गायों की पूजा।', 'Special Puja', 3100, '2 Hours', '2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Cow Dung Hill (Symbolic)', 'Annakut (Food Mountain)', 'Flowers', 'Incense'],
  ARRAY['Nature blessings', 'Protection from calamities', 'Prosperity', 'Krishna grace']),

('Chhath Puja', 'छठ पूजा', 'Major sun-worship festival for health, prosperity, and offspring, widely celebrated in Bihar/UP.', 'बिहार/यूपी में व्यापक रूप से मनाया जाने वाला सूर्य-पूजा का महापर्व — स्वास्थ्य, समृद्धि और संतान हेतु।', 'Special Puja', 5100, '2 Days', '48', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Soop & Dala', 'Seasonal Fruits', 'Thekua', 'Arghya Items'],
  ARRAY['Vitality', 'Cure from diseases', 'Offspring well-being', 'Solar energy']),

('Garud Puran Paath', 'गरुड़ पुराण पाठ', 'Recitation of Garud Puran after death to guide the soul through the afterlife journey.', 'मृत्यु के पश्चात आत्मा को परलोक यात्रा में मार्गदर्शन हेतु गरुड़ पुराण का पाठ।', 'Path & Stotra', 5100, '10 Days', '240', NULL, TRUE, NULL, 1, FALSE,
  ARRAY['Vedic Pandit', 'Garud Puran Book', 'Daily Lamp', 'Flowers', 'Final Shanti'],
  ARRAY['Soul guidance', 'Peace for departed', 'Understanding afterlife', 'Moksha']),

('Harivansh Puran Paath', 'हरिवंश पुराण पाठ', 'Recitation of Harivansh Puran for progeny (santān prapti) and family lineage continuity.', 'संतान प्राप्ति और वंश निरंतरता हेतु हरिवंश पुराण का पाठ।', 'Path & Stotra', 7500, '7 Days', '168', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Harivansh Puran Book', 'Krishna Idol', 'Tulsi', 'Prasad'],
  ARRAY['Progeny (Child birth)', 'Lineage continuity', 'Krishna blessings', 'Family joy']),

('Amla Puja & Gupt Daan', 'आवाला पूजा एवं गुप्त दान', 'Worship of Amla tree (Vishnu form) and secret charity for multiplied spiritual merit.', 'आंवला वृक्ष (विष्णु रूप) की पूजा और गुणित आध्यात्मिक पुण्य हेतु गुप्त दान।', 'Special Puja', 2100, '1-2 Hours', '1-2', NULL, TRUE, NULL, 1, TRUE,
  ARRAY['Vedic Pandit', 'Amla Tree/Branch', 'Milk & Water', 'Deep Daan', 'Secret Donation Items'],
  ARRAY['Multiplied merit', 'Vishnu grace', 'Health (Vitamin C)', 'Sin removal']);
