const fs = require('fs');
const path = require('path');
const targetDir = 'e:/panditji/backend/src/data';
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const major = [
    { name: 'The Fool', meaning: 'New beginnings, innocence, spontaneity, a free spirit.' },
    { name: 'The Magician', meaning: 'Manifestation, resourcefulness, power, inspired action.' },
    { name: 'The High Priestess', meaning: 'Intuition, sacred knowledge, divine feminine, the subconscious mind.' },
    { name: 'The Empress', meaning: 'Femininity, beauty, nature, nurturing, abundance.' },
    { name: 'The Emperor', meaning: 'Authority, establishment, structure, a father figure.' },
    { name: 'The Hierophant', meaning: 'Spiritual wisdom, religious beliefs, conformity, tradition.' },
    { name: 'The Lovers', meaning: 'Love, harmony, relationships, values alignment, choices.' },
    { name: 'The Chariot', meaning: 'Control, willpower, success, action, determination.' },
    { name: 'Strength', meaning: 'Strength, courage, persuasion, influence, compassion.' },
    { name: 'The Hermit', meaning: 'Soul-searching, introspection, being alone, inner guidance.' },
    { name: 'Wheel of Fortune', meaning: 'Good luck, karma, life cycles, destiny, a turning point.' },
    { name: 'Justice', meaning: 'Justice, fairness, truth, cause and effect, law.' },
    { name: 'The Hanged Man', meaning: 'Pause, surrender, letting go, new perspectives.' },
    { name: 'Death', meaning: 'Endings, change, transformation, transition.' },
    { name: 'Temperance', meaning: 'Balance, moderation, patience, purpose.' },
    { name: 'The Devil', meaning: 'Shadow self, attachment, addiction, restriction, sexuality.' },
    { name: 'The Tower', meaning: 'Sudden change, upheaval, chaos, revelation, awakening.' },
    { name: 'The Star', meaning: 'Hope, faith, purpose, renewal, spirituality.' },
    { name: 'The Moon', meaning: 'Illusion, fear, anxiety, subconscious, intuition.' },
    { name: 'The Sun', meaning: 'Positivity, fun, warmth, success, vitality.' },
    { name: 'Judgement', meaning: 'Judgement, rebirth, inner calling, absolution.' },
    { name: 'The World', meaning: 'Completion, integration, accomplishment, travel.' }
];

const suits = [
    { name: 'Wands', meaning: 'passion, energy, and action' },
    { name: 'Cups', meaning: 'emotions, relationships, and intuition' },
    { name: 'Swords', meaning: 'intellect, conflict, and decisions' },
    { name: 'Pentacles', meaning: 'wealth, work, and material matters' }
];

const ranks = [
    { n: 'Ace of', m: 'New beginnings and potential in' },
    { n: 'Two of', m: 'Balance and choices regarding' },
    { n: 'Three of', m: 'Collaboration and growth in' },
    { n: 'Four of', m: 'Stability and foundation in' },
    { n: 'Five of', m: 'Challenges and conflict in' },
    { n: 'Six of', m: 'Harmony and support in' },
    { n: 'Seven of', m: 'Assessment and patience in' },
    { n: 'Eight of', m: 'Movement and dedication in' },
    { n: 'Nine of', m: 'Fulfillment and culmination of' },
    { n: 'Ten of', m: 'Completion and legacy of' },
    { n: 'Page of', m: 'Exploration and messages about' },
    { n: 'Knight of', m: 'Action and pursuit of' },
    { n: 'Queen of', m: 'Mastery and nurturing of' },
    { n: 'King of', m: 'Authority and control over' }
];

let minor = [];
for (let s of suits) {
    for (let r of ranks) {
        minor.push({
            name: `${r.n} ${s.name}`,
            meaning: `${r.m} ${s.meaning}.`
        });
    }
}

const all = [...major, ...minor];
const fileContent = `export const FULL_TAROT_DECK = ${JSON.stringify(all, null, 4)};`;
fs.writeFileSync(path.join(targetDir, 'tarotDeck.ts'), fileContent);
console.log('Successfully wrote tarotDeck.ts to ' + targetDir);
