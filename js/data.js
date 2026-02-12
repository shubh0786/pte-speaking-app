/**
 * PTE Speaking Module - Question Bank & Constants
 * Contains all question types, sample questions, and configuration
 */

window.PTE = window.PTE || {};

PTE.QUESTION_TYPES = {
  READ_ALOUD: {
    id: 'read-aloud',
    name: 'Read Aloud',
    shortName: 'RA',
    icon: '📖',
    color: '#6366f1',
    colorLight: '#e0e7ff',
    description: 'A text appears on screen. Read the text aloud.',
    prepTime: 35,
    recordTime: 40,
    hasAudio: false,
    hasImage: false,
    hasText: true,
    scoring: ['content', 'pronunciation', 'fluency'],
    tips: [
      'Use the preparation time to silently read the passage',
      'Speak clearly and at a natural pace',
      'Do not rush — fluency matters more than speed',
      'Stress key words naturally',
      'If you make a mistake, continue without going back'
    ]
  },
  REPEAT_SENTENCE: {
    id: 'repeat-sentence',
    name: 'Repeat Sentence',
    shortName: 'RS',
    icon: '🔁',
    color: '#8b5cf6',
    colorLight: '#ede9fe',
    description: 'Listen to a sentence. Repeat the sentence exactly as you heard it.',
    prepTime: 0,
    recordTime: 15,
    hasAudio: true,
    hasImage: false,
    hasText: false,
    scoring: ['content', 'pronunciation', 'fluency'],
    tips: [
      'Listen carefully to every word',
      'Try to remember the beginning, middle, and end',
      'Speak immediately when the recording starts',
      'Match the speaker\'s pace and intonation',
      'Even partial repetition scores some points'
    ]
  },
  DESCRIBE_IMAGE: {
    id: 'describe-image',
    name: 'Describe Image',
    shortName: 'DI',
    icon: '📊',
    color: '#ec4899',
    colorLight: '#fce7f3',
    description: 'An image appears on screen. Describe the image in detail.',
    prepTime: 25,
    recordTime: 40,
    hasAudio: false,
    hasImage: true,
    hasText: false,
    scoring: ['content', 'pronunciation', 'fluency'],
    tips: [
      'Start with a general overview statement',
      'Mention the type of image (bar chart, line graph, etc.)',
      'Describe the main trends or features',
      'Include specific data points and numbers',
      'Conclude with a summary or comparison'
    ]
  },
  RETELL_LECTURE: {
    id: 'retell-lecture',
    name: 'Re-tell Lecture',
    shortName: 'RL',
    icon: '🎓',
    color: '#f59e0b',
    colorLight: '#fef3c7',
    description: 'Listen to a lecture. Retell what you heard in your own words.',
    prepTime: 10,
    recordTime: 40,
    hasAudio: true,
    hasImage: false,
    hasText: false,
    scoring: ['content', 'pronunciation', 'fluency'],
    tips: [
      'Take mental notes of key points while listening',
      'Identify the main topic and supporting details',
      'Use discourse markers (firstly, moreover, in conclusion)',
      'Speak for the full 40 seconds',
      'Cover the main points even if you miss some details'
    ]
  },
  ANSWER_SHORT_QUESTION: {
    id: 'answer-short-question',
    name: 'Answer Short Question',
    shortName: 'ASQ',
    icon: '❓',
    color: '#10b981',
    colorLight: '#d1fae5',
    description: 'Listen to a question. Give a short answer in one or a few words.',
    prepTime: 0,
    recordTime: 10,
    hasAudio: true,
    hasImage: false,
    hasText: false,
    scoring: ['vocabulary'],
    tips: [
      'Give a short, direct answer — one or two words is enough',
      'Do not explain your answer',
      'Speak clearly and confidently',
      'If unsure, give your best guess',
      'Do not stay silent — always attempt an answer'
    ]
  },
  SUMMARIZE_GROUP_DISCUSSION: {
    id: 'summarize-group-discussion',
    name: 'Summarize Group Discussion',
    shortName: 'SGD',
    icon: '👥',
    color: '#0ea5e9',
    colorLight: '#e0f2fe',
    description: 'Listen to a group discussion. Summarize the main points.',
    prepTime: 10,
    recordTime: 60,
    hasAudio: true,
    hasImage: false,
    hasText: false,
    scoring: ['content', 'pronunciation', 'fluency'],
    tips: [
      'Note each speaker\'s main point',
      'Identify areas of agreement and disagreement',
      'Use formal, academic language',
      'Aim for 50-70 words in your summary',
      'Structure: introduction → main points → conclusion'
    ]
  },
  RESPOND_TO_SITUATION: {
    id: 'respond-to-situation',
    name: 'Respond to a Situation',
    shortName: 'RTS',
    icon: '💬',
    color: '#f43f5e',
    colorLight: '#ffe4e6',
    description: 'Read and listen to a scenario. Respond appropriately.',
    prepTime: 20,
    recordTime: 40,
    hasAudio: true,
    hasImage: false,
    hasText: true,
    scoring: ['content', 'pronunciation', 'fluency', 'appropriateness'],
    tips: [
      'Read the scenario carefully during prep time',
      'Identify who you are speaking to and why',
      'Use an appropriate tone (formal/informal)',
      'Address all parts of the situation',
      'Be polite and clear in your response'
    ]
  }
};

// ── Question Bank ──────────────────────────────────────────────

PTE.Questions = {
  'read-aloud': [
    {
      id: 'ra-1',
      text: 'Climate change is one of the most pressing issues of our time. Rising global temperatures have led to more frequent extreme weather events, melting polar ice caps, and rising sea levels. Scientists agree that human activities, particularly the burning of fossil fuels and deforestation, are the primary drivers of this phenomenon.',
      keywords: ['climate', 'change', 'pressing', 'temperatures', 'extreme', 'weather', 'melting', 'polar', 'ice', 'sea', 'levels', 'scientists', 'human', 'activities', 'fossil', 'fuels', 'deforestation', 'drivers', 'phenomenon']
    },
    {
      id: 'ra-2',
      text: 'The discovery of penicillin by Alexander Fleming in nineteen twenty-eight revolutionized modern medicine. This accidental finding led to the development of antibiotics, which have since saved millions of lives. However, the overuse of antibiotics has contributed to the emergence of drug-resistant bacteria, posing a significant threat to global health.',
      keywords: ['discovery', 'penicillin', 'Alexander', 'Fleming', 'revolutionized', 'medicine', 'accidental', 'antibiotics', 'millions', 'lives', 'overuse', 'drug-resistant', 'bacteria', 'threat', 'global', 'health']
    },
    {
      id: 'ra-3',
      text: 'Artificial intelligence has transformed numerous industries, from healthcare to finance. Machine learning algorithms can now diagnose diseases, predict market trends, and automate complex tasks with remarkable accuracy. As this technology continues to evolve, ethical considerations regarding privacy, employment, and decision-making become increasingly important.',
      keywords: ['artificial', 'intelligence', 'transformed', 'industries', 'healthcare', 'finance', 'machine', 'learning', 'algorithms', 'diagnose', 'diseases', 'predict', 'market', 'automate', 'accuracy', 'ethical', 'privacy', 'employment', 'decision']
    },
    {
      id: 'ra-4',
      text: 'The Great Barrier Reef, located off the coast of Queensland, Australia, is the world\'s largest coral reef system. Spanning over two thousand three hundred kilometres, it is home to an incredible diversity of marine life. Unfortunately, rising ocean temperatures and pollution have caused significant coral bleaching, threatening the survival of this natural wonder.',
      keywords: ['Great', 'Barrier', 'Reef', 'Queensland', 'Australia', 'largest', 'coral', 'reef', 'kilometres', 'diversity', 'marine', 'life', 'ocean', 'temperatures', 'pollution', 'bleaching', 'threatening', 'survival', 'natural', 'wonder']
    },
    {
      id: 'ra-5',
      text: 'Education plays a pivotal role in shaping the future of society. Access to quality education empowers individuals to develop critical thinking skills, pursue meaningful careers, and contribute to their communities. Governments around the world are investing in educational reform to ensure that every child has the opportunity to reach their full potential.',
      keywords: ['education', 'pivotal', 'role', 'shaping', 'future', 'society', 'access', 'quality', 'empowers', 'individuals', 'critical', 'thinking', 'careers', 'communities', 'governments', 'investing', 'reform', 'opportunity', 'potential']
    },
    {
      id: 'ra-6',
      text: 'The human brain is the most complex organ in the body, containing approximately eighty-six billion neurons. These neurons form intricate networks that control everything from basic bodily functions to complex cognitive processes such as memory, language, and problem-solving. Neuroscience research continues to reveal new insights into how the brain develops, adapts, and recovers from injury.',
      keywords: ['brain', 'complex', 'organ', 'neurons', 'networks', 'control', 'bodily', 'functions', 'cognitive', 'processes', 'memory', 'language', 'problem-solving', 'neuroscience', 'research', 'insights', 'develops', 'adapts', 'recovers', 'injury']
    }
  ],

  'repeat-sentence': [
    {
      id: 'rs-1',
      text: 'The university library will be closed for renovations throughout next semester.',
      keywords: ['university', 'library', 'closed', 'renovations', 'next', 'semester']
    },
    {
      id: 'rs-2',
      text: 'Students are expected to submit their assignments before the deadline.',
      keywords: ['students', 'expected', 'submit', 'assignments', 'before', 'deadline']
    },
    {
      id: 'rs-3',
      text: 'The research findings were published in a leading scientific journal last month.',
      keywords: ['research', 'findings', 'published', 'leading', 'scientific', 'journal', 'last', 'month']
    },
    {
      id: 'rs-4',
      text: 'Climate change affects biodiversity in both terrestrial and marine ecosystems.',
      keywords: ['climate', 'change', 'affects', 'biodiversity', 'terrestrial', 'marine', 'ecosystems']
    },
    {
      id: 'rs-5',
      text: 'The government has announced new policies to reduce carbon emissions by twenty thirty.',
      keywords: ['government', 'announced', 'new', 'policies', 'reduce', 'carbon', 'emissions', 'twenty', 'thirty']
    },
    {
      id: 'rs-6',
      text: 'All participants must register online at least two weeks before the conference.',
      keywords: ['participants', 'must', 'register', 'online', 'least', 'two', 'weeks', 'before', 'conference']
    },
    {
      id: 'rs-7',
      text: 'The professor suggested that we review the previous chapters before the exam.',
      keywords: ['professor', 'suggested', 'review', 'previous', 'chapters', 'before', 'exam']
    },
    {
      id: 'rs-8',
      text: 'International trade agreements can have significant impacts on local economies.',
      keywords: ['international', 'trade', 'agreements', 'significant', 'impacts', 'local', 'economies']
    }
  ],

  'describe-image': [
    {
      id: 'di-1',
      chartType: 'bar',
      title: 'Annual Rainfall by City (mm)',
      data: [
        { label: 'Sydney', value: 1215, color: '#6366f1' },
        { label: 'London', value: 602, color: '#8b5cf6' },
        { label: 'Tokyo', value: 1530, color: '#ec4899' },
        { label: 'Mumbai', value: 2343, color: '#f59e0b' },
        { label: 'Cairo', value: 25, color: '#10b981' }
      ],
      keywords: ['bar chart', 'rainfall', 'cities', 'Mumbai', 'highest', 'Cairo', 'lowest', 'Tokyo', 'Sydney', 'London', 'millimetres', 'annual', 'comparison']
    },
    {
      id: 'di-2',
      chartType: 'pie',
      title: 'Global Energy Sources (2025)',
      data: [
        { label: 'Oil', value: 31, color: '#1e293b' },
        { label: 'Natural Gas', value: 24, color: '#6366f1' },
        { label: 'Coal', value: 27, color: '#64748b' },
        { label: 'Renewables', value: 13, color: '#10b981' },
        { label: 'Nuclear', value: 5, color: '#f59e0b' }
      ],
      keywords: ['pie chart', 'energy', 'sources', 'global', 'oil', 'largest', 'share', 'coal', 'natural gas', 'renewables', 'nuclear', 'percentage', 'fossil fuels', 'majority']
    },
    {
      id: 'di-3',
      chartType: 'line',
      title: 'World Population Growth (Billions)',
      data: [
        { label: '1950', value: 2.5 },
        { label: '1970', value: 3.7 },
        { label: '1990', value: 5.3 },
        { label: '2000', value: 6.1 },
        { label: '2010', value: 6.9 },
        { label: '2020', value: 7.8 },
        { label: '2025', value: 8.1 }
      ],
      keywords: ['line graph', 'population', 'growth', 'world', 'increase', 'steady', 'billion', 'rose', 'trend', 'upward', 'doubled', 'significantly']
    },
    {
      id: 'di-4',
      chartType: 'bar',
      title: 'Internet Users by Region (Millions)',
      data: [
        { label: 'Asia', value: 2900, color: '#ef4444' },
        { label: 'Europe', value: 750, color: '#3b82f6' },
        { label: 'Africa', value: 600, color: '#10b981' },
        { label: 'Americas', value: 1100, color: '#f59e0b' },
        { label: 'Oceania', value: 30, color: '#8b5cf6' }
      ],
      keywords: ['bar chart', 'internet', 'users', 'region', 'Asia', 'highest', 'millions', 'Americas', 'Europe', 'Africa', 'Oceania', 'lowest', 'digital', 'divide']
    },
    {
      id: 'di-5',
      chartType: 'pie',
      title: 'Student Study Time Distribution',
      data: [
        { label: 'Lectures', value: 30, color: '#6366f1' },
        { label: 'Self-study', value: 25, color: '#10b981' },
        { label: 'Group Work', value: 15, color: '#f59e0b' },
        { label: 'Online', value: 20, color: '#ec4899' },
        { label: 'Other', value: 10, color: '#64748b' }
      ],
      keywords: ['pie chart', 'student', 'study', 'time', 'distribution', 'lectures', 'largest', 'self-study', 'online', 'group work', 'percentage', 'proportion']
    }
  ],

  'retell-lecture': [
    {
      id: 'rl-1',
      text: 'Today we are going to discuss the impact of social media on mental health. Research has shown that excessive use of social media platforms can lead to increased feelings of anxiety and depression, particularly among young adults. Studies indicate that constant comparison with others on these platforms creates unrealistic expectations. However, social media also provides valuable connections for people who may otherwise feel isolated. The key is finding a healthy balance between online and offline interactions. Mental health professionals recommend limiting screen time and being mindful of how social media use affects your emotional well-being.',
      keywords: ['social media', 'mental health', 'anxiety', 'depression', 'young adults', 'comparison', 'unrealistic', 'expectations', 'connections', 'isolated', 'balance', 'screen time', 'emotional', 'well-being', 'mindful']
    },
    {
      id: 'rl-2',
      text: 'In this lecture, I want to talk about the future of renewable energy. Solar and wind power have seen tremendous growth over the past decade, with costs dropping by over seventy percent. Many countries are now investing heavily in clean energy infrastructure. The main challenge remains energy storage, as solar and wind are intermittent sources. Battery technology is advancing rapidly, with new lithium-ion and solid-state batteries offering greater capacity. Experts predict that by twenty fifty, renewable energy could account for over eighty percent of global electricity generation, fundamentally transforming how we power our societies.',
      keywords: ['renewable', 'energy', 'solar', 'wind', 'growth', 'costs', 'dropping', 'clean', 'infrastructure', 'challenge', 'storage', 'intermittent', 'battery', 'technology', 'lithium', 'solid-state', 'electricity', 'generation', 'transforming']
    },
    {
      id: 'rl-3',
      text: 'Let me explain the concept of urban planning and sustainable cities. As urbanization accelerates globally, cities face mounting challenges including traffic congestion, air pollution, and housing shortages. Sustainable urban planning addresses these issues through mixed-use development, efficient public transportation systems, and green spaces. Cities like Copenhagen and Singapore have become models for sustainable development. They prioritize cycling infrastructure, vertical gardens, and smart technology to manage resources. The goal is to create liveable cities that meet the needs of current residents without compromising the ability of future generations to meet their own needs.',
      keywords: ['urban', 'planning', 'sustainable', 'cities', 'urbanization', 'congestion', 'pollution', 'housing', 'mixed-use', 'transportation', 'green', 'spaces', 'Copenhagen', 'Singapore', 'cycling', 'smart', 'technology', 'liveable', 'future', 'generations']
    },
    {
      id: 'rl-4',
      text: 'Today\'s topic is the psychology of decision-making. Behavioral economists have discovered that humans are not purely rational decision makers. We are influenced by cognitive biases such as anchoring, where we rely heavily on the first piece of information we receive, and confirmation bias, where we seek information that confirms our existing beliefs. The availability heuristic means we judge probability based on how easily examples come to mind. Understanding these biases is crucial for making better decisions in both personal and professional contexts. Organizations are now designing choice architectures that help people make better decisions by default.',
      keywords: ['psychology', 'decision-making', 'behavioral', 'economists', 'rational', 'cognitive', 'biases', 'anchoring', 'confirmation', 'bias', 'availability', 'heuristic', 'probability', 'understanding', 'choice', 'architecture', 'organizations', 'default']
    }
  ],

  'answer-short-question': [
    { id: 'asq-1', text: 'What do you call the person who flies an airplane?', answer: 'pilot', keywords: ['pilot'] },
    { id: 'asq-2', text: 'What is the main gas that humans breathe out?', answer: 'carbon dioxide', keywords: ['carbon dioxide', 'co2'] },
    { id: 'asq-3', text: 'What device is used to measure temperature?', answer: 'thermometer', keywords: ['thermometer'] },
    { id: 'asq-4', text: 'In which continent is Brazil located?', answer: 'South America', keywords: ['south america'] },
    { id: 'asq-5', text: 'What do you call the study of stars and planets?', answer: 'astronomy', keywords: ['astronomy'] },
    { id: 'asq-6', text: 'How many sides does a hexagon have?', answer: 'six', keywords: ['six', '6'] },
    { id: 'asq-7', text: 'What is the opposite of ancient?', answer: 'modern', keywords: ['modern', 'new', 'contemporary'] },
    { id: 'asq-8', text: 'What do you call the period of ten years?', answer: 'decade', keywords: ['decade'] },
    { id: 'asq-9', text: 'What organ pumps blood throughout the body?', answer: 'heart', keywords: ['heart'] },
    { id: 'asq-10', text: 'What is the process by which plants make food using sunlight?', answer: 'photosynthesis', keywords: ['photosynthesis'] },
    { id: 'asq-11', text: 'What do you call someone who studies history?', answer: 'historian', keywords: ['historian'] },
    { id: 'asq-12', text: 'What is frozen water called?', answer: 'ice', keywords: ['ice'] }
  ],

  'summarize-group-discussion': [
    {
      id: 'sgd-1',
      speakers: [
        { name: 'Speaker A', text: 'I believe remote work is here to stay. Productivity has actually increased for many companies since the shift to working from home. Employees save time on commuting and have better work-life balance.' },
        { name: 'Speaker B', text: 'I partially agree, but I think we need to consider the downsides. Many workers feel isolated and find it difficult to collaborate effectively online. There is also the issue of maintaining company culture.' },
        { name: 'Speaker C', text: 'I think the ideal solution is a hybrid model. Companies should offer flexibility while maintaining some in-person interaction. This addresses both productivity and social needs.' },
        { name: 'Speaker A', text: 'That is a fair point. However, we should remember that not all roles can be done remotely. Manufacturing and healthcare workers, for example, must be on-site.' }
      ],
      keywords: ['remote work', 'productivity', 'work-life balance', 'isolated', 'collaborate', 'company culture', 'hybrid', 'flexibility', 'in-person', 'on-site', 'manufacturing', 'healthcare']
    },
    {
      id: 'sgd-2',
      speakers: [
        { name: 'Speaker A', text: 'University education should be free for all students. The rising cost of tuition creates inequality and prevents talented individuals from lower-income backgrounds from accessing higher education.' },
        { name: 'Speaker B', text: 'While I support accessible education, making it completely free places an enormous burden on taxpayers. We need to find a balance, perhaps through income-based repayment plans.' },
        { name: 'Speaker C', text: 'I think the focus should be on reducing costs rather than making education free. Universities need to become more efficient and embrace technology for online learning.' },
        { name: 'Speaker B', text: 'I agree with that. Scholarships and grants targeted at disadvantaged students could also help bridge the gap without making education entirely taxpayer-funded.' }
      ],
      keywords: ['university', 'education', 'free', 'tuition', 'inequality', 'lower-income', 'taxpayers', 'balance', 'income-based', 'repayment', 'reducing costs', 'efficient', 'technology', 'online', 'scholarships', 'grants', 'disadvantaged']
    }
  ],

  'respond-to-situation': [
    {
      id: 'rts-1',
      scenario: 'You are a team leader at work. One of your team members has been consistently arriving late for the past two weeks. You need to speak to them about this issue while being supportive and understanding.',
      audioText: 'You are a team leader and need to address a team member who has been arriving late consistently.',
      keywords: ['late', 'concerned', 'understand', 'reason', 'support', 'improve', 'attendance', 'schedule', 'team', 'help', 'discuss', 'solution']
    },
    {
      id: 'rts-2',
      scenario: 'You are a university student. Your professor has given the class a group assignment, but one member of your group is not contributing. You need to diplomatically address the issue with the group member.',
      audioText: 'You need to address a group member who is not contributing to a university group assignment.',
      keywords: ['group', 'assignment', 'contribution', 'share', 'work', 'fair', 'deadline', 'concerned', 'help', 'together', 'discuss', 'tasks', 'responsibility']
    },
    {
      id: 'rts-3',
      scenario: 'You are a customer at a restaurant. You have received the wrong order and the food is cold. You need to politely complain to the waiter and ask for your meal to be replaced.',
      audioText: 'You need to politely complain at a restaurant about receiving a wrong and cold order.',
      keywords: ['order', 'wrong', 'cold', 'replace', 'apologize', 'meal', 'correct', 'please', 'appreciate', 'understand', 'waiter', 'menu']
    },
    {
      id: 'rts-4',
      scenario: 'You are a new employee at a company. You have been asked to present your project proposal to senior management, but you are unsure about some technical details. You need to ask your supervisor for guidance.',
      audioText: 'As a new employee, you need to ask your supervisor for help with a presentation to senior management.',
      keywords: ['presentation', 'project', 'proposal', 'guidance', 'management', 'technical', 'details', 'appreciate', 'advice', 'help', 'prepare', 'meeting', 'supervisor', 'feedback']
    }
  ]
};
