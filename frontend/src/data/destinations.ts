export interface Destination {
    id: string;
    name: string;
    location: string;
    badgeText?: string;
    tags: { label: string; color: 'blue' | 'orange' | 'purple' | 'yellow' }[];
    description: string;
    imageUrl: string;
    wikiTitle: string;
}

export const destinations: Destination[] = [
    {
        id: 'kedarnath',
        name: 'Kedarnath Temple',
        location: 'Rudraprayag, Uttarakhand',
        badgeText: '11,755 ft',
        tags: [
            { label: 'JYOTIRLINGA', color: 'blue' },
            { label: 'SHIVA', color: 'orange' },
        ],
        description: 'Built by the Pandavas and revived by Adi Shankaracharya, this ancient temple stands amidst the snow-clad peaks of the Himalayas.',
        imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop',
        wikiTitle: 'Kedarnath_Temple'
    },
    {
        id: 'kashi-vishwanath',
        name: 'Kashi Vishwanath',
        location: 'Varanasi, Uttar Pradesh',
        badgeText: 'Ganga Ghat',
        tags: [
            { label: 'JYOTIRLINGA', color: 'blue' },
            { label: 'MOKSHA', color: 'orange' },
        ],
        description: 'Known as the Golden Temple dedicated to Lord Shiva. It is believed that a visit to this temple and a bath in the river Ganges leads one on a path to Moksha.',
        imageUrl: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?q=80&w=1000&auto=format&fit=crop',
        wikiTitle: 'Kashi_Vishwanath_Temple'
    },
    {
        id: 'tirupati-balaji',
        name: 'Tirupati Balaji',
        location: 'Tirumala, Andhra Pradesh',
        badgeText: 'Most Visited',
        tags: [
            { label: 'VISHNU', color: 'yellow' },
            { label: 'DRAVIDIAN', color: 'purple' },
        ],
        description: 'The richest temple in the world dedicated to Lord Venkateswara. The divine aura and the laddu prasadam pull millions of devotees every year.',
        imageUrl: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?q=80&w=1000&auto=format&fit=crop',
        wikiTitle: 'Venkateswara_Temple,_Tirumala'
    },
    {
        id: 'meenakshi-amman',
        name: 'Meenakshi Amman',
        location: 'Madurai, Tamil Nadu',
        badgeText: 'Architectural Marvel',
        tags: [
            { label: 'PARVATI', color: 'orange' },
            { label: 'DRAVIDIAN', color: 'purple' },
        ],
        description: 'A historic Hindu temple located on the southern bank of the Vaigai River. It is noted for its towering gopurams covered with thousands of colorful figures.',
        imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000&auto=format&fit=crop',
        wikiTitle: 'Meenakshi_Temple'
    },
    {
        id: 'badrinath',
        name: 'Badrinath Temple',
        location: 'Chamoli, Uttarakhand',
        badgeText: 'Char Dham',
        tags: [
            { label: 'VISHNU', color: 'yellow' },
            { label: 'HIMALAYAN', color: 'blue' },
        ],
        description: 'A Hindu temple dedicated to Lord Vishnu situated in the town of Badrinath. It is one of the most important pilgrimage sites in the Char Dham yatra.',
        imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1000&auto=format&fit=crop',
        wikiTitle: 'Badrinath_Temple'
    }
];
