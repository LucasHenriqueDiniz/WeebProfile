/**
 * Personality type data and mappings for 16Personalities
 */

import type { PersonalityType, Personality16Data } from '../types'

/**
 * Mapping of personality types to complete data
 */
export const PERSONALITY_DATA: Record<PersonalityType, Omit<Personality16Data, 'type'>> = {
  ENFJ: {
    name: 'Protagonist',
    emoji: '🎭',
    description: 'Protagonists are inspiring optimists, ready to act according to what they consider right.',
    url: 'https://www.16personalities.com/enfj-personality',
    traits: {
      E: 'Extroverted',
      N: 'Intuitive',
      F: 'Feeling',
      J: 'Judging',
    },
  },
  ENFP: {
    name: 'Campaigner',
    emoji: '🎨',
    description: 'Campaigners are true free spirits, creative and always finding a reason to smile.',
    url: 'https://www.16personalities.com/enfp-personality',
    traits: {
      E: 'Extroverted',
      N: 'Intuitive',
      F: 'Feeling',
      J: 'Prospecting',
    },
  },
  ENTJ: {
    name: 'Commander',
    emoji: '👑',
    description: 'Commanders are natural-born leaders. They perceive inefficiency and develop new solutions.',
    url: 'https://www.16personalities.com/entj-personality',
    traits: {
      E: 'Extroverted',
      N: 'Intuitive',
      F: 'Thinking',
      J: 'Judging',
    },
  },
  ENTP: {
    name: 'Debater',
    emoji: '💡',
    description: 'Debaters are smart and curious thinkers who cannot resist an intellectual challenge.',
    url: 'https://www.16personalities.com/entp-personality',
    traits: {
      E: 'Extroverted',
      N: 'Intuitive',
      F: 'Thinking',
      J: 'Prospecting',
    },
  },
  ESFJ: {
    name: 'Consul',
    emoji: '🤝',
    description: 'Consuls are extraordinarily caring, social and popular people, always eager to help.',
    url: 'https://www.16personalities.com/esfj-personality',
    traits: {
      E: 'Extroverted',
      N: 'Observant',
      F: 'Feeling',
      J: 'Judging',
    },
  },
  ESFP: {
    name: 'Entertainer',
    emoji: '🎪',
    description: 'Entertainers are spontaneous, enthusiastic and energetic performers - life never gets boring around them.',
    url: 'https://www.16personalities.com/esfp-personality',
    traits: {
      E: 'Extroverted',
      N: 'Observant',
      F: 'Feeling',
      J: 'Prospecting',
    },
  },
  ESTJ: {
    name: 'Executive',
    emoji: '📊',
    description: 'Executives are excellent administrators, unsurpassed at managing things or people.',
    url: 'https://www.16personalities.com/estj-personality',
    traits: {
      E: 'Extroverted',
      N: 'Observant',
      F: 'Thinking',
      J: 'Judging',
    },
  },
  ESTP: {
    name: 'Entrepreneur',
    emoji: '⚡',
    description: 'Entrepreneurs are smart, energetic and perceptive people, truly action-oriented.',
    url: 'https://www.16personalities.com/estp-personality',
    traits: {
      E: 'Extroverted',
      N: 'Observant',
      F: 'Thinking',
      J: 'Prospecting',
    },
  },
  INFJ: {
    name: 'Advocate',
    emoji: '🛡️',
    description: 'Advocates are creative and dedicated, with a passion for doing what is right.',
    url: 'https://www.16personalities.com/infj-personality',
    traits: {
      E: 'Introverted',
      N: 'Intuitive',
      F: 'Feeling',
      J: 'Judging',
    },
  },
  INFP: {
    name: 'Mediator',
    emoji: '🌙',
    description: 'Mediators are true idealists, always looking for the good in things and people.',
    url: 'https://www.16personalities.com/infp-personality',
    traits: {
      E: 'Introverted',
      N: 'Intuitive',
      F: 'Feeling',
      J: 'Prospecting',
    },
  },
  INTJ: {
    name: 'Architect',
    emoji: '🏗️',
    description: 'Architects are strategic thinkers, confident in their abilities and possess an analytical mind.',
    url: 'https://www.16personalities.com/intj-personality',
    traits: {
      E: 'Introverted',
      N: 'Intuitive',
      F: 'Thinking',
      J: 'Judging',
    },
  },
  INTP: {
    name: 'Thinker',
    emoji: '🔬',
    description: 'Thinkers are innovative thinkers with an insatiable thirst for knowledge.',
    url: 'https://www.16personalities.com/intp-personality',
    traits: {
      E: 'Introverted',
      N: 'Intuitive',
      F: 'Thinking',
      J: 'Prospecting',
    },
  },
  ISFJ: {
    name: 'Protector',
    emoji: '🛡️',
    description: 'Protectors are very dedicated and warm people, always ready to protect their loved ones.',
    url: 'https://www.16personalities.com/isfj-personality',
    traits: {
      E: 'Introverted',
      N: 'Observant',
      F: 'Feeling',
      J: 'Judging',
    },
  },
  ISFP: {
    name: 'Adventurer',
    emoji: '🎨',
    description: 'Adventurers are flexible and charming artists, always ready to explore new possibilities.',
    url: 'https://www.16personalities.com/isfp-personality',
    traits: {
      E: 'Introverted',
      N: 'Observant',
      F: 'Feeling',
      J: 'Prospecting',
    },
  },
  ISTJ: {
    name: 'Logistician',
    emoji: '📋',
    description: 'Logisticians are practical and fact-focused people, with confidence in themselves.',
    url: 'https://www.16personalities.com/istj-personality',
    traits: {
      E: 'Introverted',
      N: 'Observant',
      F: 'Thinking',
      J: 'Judging',
    },
  },
  ISTP: {
    name: 'Virtuoso',
    emoji: '🔧',
    description: 'Virtuosos are bold and practical mechanics, masters of all kinds of tools.',
    url: 'https://www.16personalities.com/istp-personality',
    traits: {
      E: 'Introverted',
      N: 'Observant',
      F: 'Thinking',
      J: 'Prospecting',
    },
  },
}

/**
 * Gets personality data by type
 */
export function getPersonalityData(type: PersonalityType): Personality16Data {
  const data = PERSONALITY_DATA[type]
  if (!data) {
    // Fallback to ENFJ if invalid type
    return { type: 'ENFJ', ...PERSONALITY_DATA.ENFJ }
  }
  return { type, ...data }
}
