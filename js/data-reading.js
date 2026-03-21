/**
 * PTE Academic — Reading Module
 * 5 question types: RWFIB, MCMA, ROP, RFIB, MCSA
 * Official scoring from Pearson 2025 Score Guide
 */

window.PTE = window.PTE || {};

PTE.READING_TYPES = {
  RW_FILL_IN_BLANKS: {
    id: 'rw-fib',
    name: 'Reading & Writing: Fill in the Blanks',
    shortName: 'RWFIB',
    icon: '📋',
    color: '#f59e0b',
    colorLight: '#fef3c7',
    module: 'reading',
    description: 'Read a passage with blanks. Choose the correct word from a dropdown for each blank.',
    examItems: '5-6 items',
    answerTime: 120,
    scoring: ['partial'],
    skillsAssessed: ['Reading', 'Writing'],
    tips: [
      'Read the entire passage first for overall meaning',
      'Check grammatical fit — noun, verb, adjective, adverb',
      'Consider collocations (words that naturally go together)',
      'Each correct blank = +1 point, no negative marking',
      'If unsure, read the sentence aloud in your head with each option'
    ]
  },
  MC_MULTIPLE_ANSWER: {
    id: 'r-mcma',
    name: 'Multiple Choice, Multiple Answer',
    shortName: 'MCMA',
    icon: '☑️',
    color: '#10b981',
    colorLight: '#d1fae5',
    module: 'reading',
    description: 'Read a passage and select all correct answers. More than one answer is correct.',
    examItems: '1-2 items',
    answerTime: 120,
    scoring: ['partial_negative'],
    skillsAssessed: ['Reading'],
    tips: [
      'Multiple answers are correct — select ALL that apply',
      'Scoring: +1 for each correct, -1 for each incorrect selection',
      'Minimum score is 0 (cannot go negative)',
      'Only select answers you are confident about',
      'Re-read the question carefully — "according to the passage" means textual evidence required'
    ]
  },
  REORDER_PARAGRAPHS: {
    id: 'reorder',
    name: 'Re-order Paragraphs',
    shortName: 'ROP',
    icon: '🔀',
    color: '#ec4899',
    colorLight: '#fce7f3',
    module: 'reading',
    description: 'Arrange text boxes in the correct order to form a coherent passage.',
    examItems: '2-3 items',
    answerTime: 120,
    scoring: ['pairs'],
    skillsAssessed: ['Reading'],
    tips: [
      'Find the topic sentence (introduces the main idea) — it goes first',
      'Look for discourse markers: "However", "Furthermore", "As a result"',
      'Pronouns ("this", "these", "it") must refer to something in a previous sentence',
      'Scoring is based on correct ADJACENT PAIRS, not individual positions',
      'Read your final order top to bottom to check logical flow'
    ]
  },
  R_FILL_IN_BLANKS: {
    id: 'r-fib',
    name: 'Reading: Fill in the Blanks',
    shortName: 'RFIB',
    icon: '🧩',
    color: '#6366f1',
    colorLight: '#e0e7ff',
    module: 'reading',
    description: 'Drag words from a word bank to fill blanks in the passage.',
    examItems: '4-5 items',
    answerTime: 120,
    scoring: ['partial'],
    skillsAssessed: ['Reading'],
    tips: [
      'There are MORE words in the bank than blanks — some are distractors',
      'Check part of speech: does the blank need a noun, verb, adjective?',
      'Read the sentence with each candidate word to test meaning',
      'Each correct placement = +1 point, no penalty for wrong answers',
      'Look at surrounding words for collocations and grammatical agreement'
    ]
  },
  MC_SINGLE_ANSWER: {
    id: 'r-mcsa',
    name: 'Multiple Choice, Single Answer',
    shortName: 'MCSA',
    icon: '🔘',
    color: '#0ea5e9',
    colorLight: '#e0f2fe',
    module: 'reading',
    description: 'Read a passage and select the single best answer.',
    examItems: '1-2 items',
    answerTime: 120,
    scoring: ['binary'],
    skillsAssessed: ['Reading'],
    tips: [
      'Only ONE answer is correct',
      'Scoring: 1 point for correct, 0 for incorrect',
      'Eliminate obviously wrong options first',
      'The correct answer is supported by the passage, not general knowledge',
      'Be careful with "extreme" language in options (always, never, all)'
    ]
  }
};

PTE.ReadingQuestions = {
  'rw-fib': [
    { id:'rwfib-1',
      passage:'The development of the internet has {0} transformed the way people communicate and access information. What was once a {1} tool used primarily by researchers has become an {2} part of daily life for billions of people worldwide. Social media platforms have {3} new forms of interaction, while e-commerce has revolutionized the retail {4}.',
      blanks:[
        { options:['fundamentally','marginally','temporarily','superficially'], correct:0 },
        { options:['sophisticated','specialized','complicated','primitive'], correct:1 },
        { options:['optional','integral','isolated','irrelevant'], correct:1 },
        { options:['enabled','prevented','restricted','diminished'], correct:0 },
        { options:['industry','philosophy','mythology','astronomy'], correct:0 }
      ] },
    { id:'rwfib-2',
      passage:'Education systems around the world are {0} to meet the demands of the twenty-first century. Traditional approaches that {1} memorization and standardized testing are being replaced by methods that prioritize critical thinking, creativity, and {2}. Technology plays an increasingly important {3} in modern classrooms, with digital tools {4} new opportunities for personalized learning.',
      blanks:[
        { options:['evolving','declining','stagnating','retreating'], correct:0 },
        { options:['discouraged','emphasized','eliminated','ignored'], correct:1 },
        { options:['collaboration','isolation','conformity','obedience'], correct:0 },
        { options:['role','threat','obstacle','burden'], correct:0 },
        { options:['creating','destroying','limiting','removing'], correct:0 }
      ] },
    { id:'rwfib-3',
      passage:'The human brain is a remarkably {0} organ that continues to surprise scientists with its capabilities. Recent research has {1} that the brain can form new neural connections throughout life, a process known as neuroplasticity. This discovery has {2} implications for rehabilitation after brain injuries and for our understanding of learning and {3}. Physical exercise, adequate sleep, and mental stimulation have all been shown to {4} brain health.',
      blanks:[
        { options:['complex','simple','predictable','static'], correct:0 },
        { options:['denied','revealed','concealed','fabricated'], correct:1 },
        { options:['negligible','profound','minimal','trivial'], correct:1 },
        { options:['memory','forgetting','ignorance','confusion'], correct:0 },
        { options:['undermine','promote','damage','ignore'], correct:1 }
      ] },
    { id:'rwfib-4',
      passage:'Climate scientists have warned that rising sea levels pose a {0} threat to coastal communities worldwide. As global temperatures increase, glaciers and ice sheets are {1} at accelerating rates, contributing to higher ocean levels. Low-lying island nations are particularly {2}, with some facing the prospect of complete submersion within decades. Adaptation {3} include building sea walls, relocating communities, and developing flood-resistant {4}.',
      blanks:[
        { options:['minor','significant','theoretical','imaginary'], correct:1 },
        { options:['expanding','melting','freezing','forming'], correct:1 },
        { options:['immune','protected','vulnerable','indifferent'], correct:2 },
        { options:['strategies','obstacles','failures','problems'], correct:0 },
        { options:['infrastructure','weapons','entertainment','cuisine'], correct:0 }
      ] },
    { id:'rwfib-5',
      passage:'The global food system is under increasing {0} from population growth, climate change, and resource depletion. Agricultural production must increase by approximately sixty percent by 2050 to {1} the nutritional needs of a projected nine billion people. Sustainable farming {2} such as precision agriculture, vertical farming, and genetically modified crops offer potential {3}. However, reducing food waste, which currently accounts for roughly one-third of all food {4}, may be the most effective immediate intervention.',
      blanks:[
        { options:['pressure','relief','comfort','decline'], correct:0 },
        { options:['ignore','reduce','meet','exceed'], correct:2 },
        { options:['practices','problems','failures','hazards'], correct:0 },
        { options:['dangers','solutions','complications','setbacks'], correct:1 },
        { options:['produced','imported','exported','consumed'], correct:0 }
      ] },
    { id:'rwfib-6',
      passage:'Biodiversity loss is {0} at an unprecedented rate, with scientists estimating that species are going extinct up to one thousand times faster than the natural background rate. The primary {1} include habitat destruction, pollution, climate change, and overexploitation of natural resources. Protecting biodiversity is not merely an {2} concern but an economic imperative, as ecosystems provide essential services such as pollination, water purification, and carbon {3}. Conservation efforts must be {4} up significantly if we are to preserve the biological heritage of our planet.',
      blanks:[
        { options:['slowing','occurring','reversing','stabilizing'], correct:1 },
        { options:['benefits','solutions','drivers','outcomes'], correct:2 },
        { options:['environmental','financial','artistic','athletic'], correct:0 },
        { options:['emissions','sequestration','release','production'], correct:1 },
        { options:['wound','scaled','cut','played'], correct:1 }
      ] },
    { id:'rwfib-7',
      passage:'The pharmaceutical industry invests billions of dollars annually in {0} and development of new medications. The process of bringing a new drug to {1} typically takes ten to fifteen years and costs an average of two point six billion dollars. Clinical trials must demonstrate both the safety and {2} of a new treatment before regulatory agencies will grant approval. Despite these rigorous standards, concerns about drug {3} and accessibility remain significant issues in many {4}.',
      blanks:[
        { options:['research','marketing','advertising','packaging'], correct:0 },
        { options:['market','court','trial','attention'], correct:0 },
        { options:['danger','cost','efficacy','popularity'], correct:2 },
        { options:['pricing','coloring','naming','tasting'], correct:0 },
        { options:['countries','galaxies','centuries','species'], correct:0 }
      ] },
    { id:'rwfib-8',
      passage:'Water scarcity affects approximately two billion people worldwide and is {0} to worsen as populations grow and climate patterns shift. Agriculture accounts for roughly seventy percent of global freshwater {1}, making irrigation efficiency a critical concern. Innovative technologies such as desalination, rainwater {2}, and drip irrigation systems offer promising solutions. However, addressing water scarcity also requires {3} changes in consumption patterns and stronger governance of shared water {4}.',
      blanks:[
        { options:['unlikely','expected','impossible','forbidden'], correct:1 },
        { options:['pollution','withdrawal','contamination','flooding'], correct:1 },
        { options:['harvesting','poisoning','wasting','ignoring'], correct:0 },
        { options:['behavioral','cosmetic','superficial','temporary'], correct:0 },
        { options:['resources','sports','games','fashions'], correct:0 }
      ] },
  ],
  'r-mcma': [
    { id:'rmcma-1',
      passage:'The concept of emotional intelligence, first proposed by psychologists Peter Salovey and John Mayer and later popularized by Daniel Goleman, refers to the ability to recognize, understand, manage, and effectively use emotions in oneself and others. Research suggests that emotional intelligence is a stronger predictor of workplace success than traditional IQ in many contexts. People with high emotional intelligence tend to be better leaders, more effective communicators, and more adept at resolving conflicts. However, some critics argue that emotional intelligence is difficult to measure objectively and that the concept has been oversimplified in popular culture.',
      question:'According to the passage, which of the following statements are correct?',
      options:[
        { text:'Emotional intelligence was first proposed by Daniel Goleman.', correct:false },
        { text:'Emotional intelligence involves recognizing and managing emotions.', correct:true },
        { text:'EI can be a better predictor of workplace success than IQ.', correct:true },
        { text:'All researchers agree on how to measure emotional intelligence.', correct:false },
        { text:'People with high EI tend to be more effective communicators.', correct:true }
      ] },
    { id:'rmcma-2',
      passage:'Urbanization is one of the defining trends of the twenty-first century. More than half of the world\'s population now lives in urban areas, and this proportion is expected to reach sixty-eight percent by 2050. Cities are engines of economic growth, generating over eighty percent of global GDP. However, rapid urbanization also brings challenges including overcrowding, pollution, inadequate infrastructure, and social inequality. Smart city technologies, which use data and digital tools to optimize urban services, are being adopted by cities worldwide as a way to address these challenges while improving quality of life for residents.',
      question:'Which of the following can be inferred from the passage?',
      options:[
        { text:'More people currently live in rural areas than urban areas.', correct:false },
        { text:'Cities contribute significantly to economic output.', correct:true },
        { text:'Urbanization creates both benefits and challenges.', correct:true },
        { text:'Smart city technologies have solved all urban problems.', correct:false },
        { text:'The urban population is expected to continue growing.', correct:true }
      ] },
    { id:'rmcma-3',
      passage:'Coral reefs, often called the rainforests of the sea, support approximately twenty-five percent of all marine species despite covering less than one percent of the ocean floor. They provide essential ecosystem services including coastal protection, fisheries support, and tourism revenue. However, coral reefs are under severe threat from rising ocean temperatures, which cause coral bleaching — a process where corals expel the symbiotic algae that provide them with nutrients and color. Ocean acidification, caused by increased absorption of carbon dioxide, further weakens coral structures. Scientists estimate that seventy to ninety percent of existing coral reefs could be lost within the next thirty years if current trends continue.',
      question:'Based on the passage, which statements are true?',
      options:[
        { text:'Coral reefs cover a large portion of the ocean floor.', correct:false },
        { text:'Rising ocean temperatures cause coral bleaching.', correct:true },
        { text:'Coral reefs support a disproportionately large number of marine species.', correct:true },
        { text:'Ocean acidification strengthens coral structures.', correct:false },
        { text:'Coral reefs may largely disappear within thirty years.', correct:true }
      ] },
    { id:'rmcma-4',
      passage:'The printing press, invented by Johannes Gutenberg in the mid-fifteenth century, is widely regarded as one of the most transformative inventions in human history. Before its creation, books were painstakingly copied by hand, making them rare and expensive. The printing press dramatically reduced the cost of book production and increased literacy rates across Europe. It facilitated the spread of scientific knowledge during the Renaissance and played a crucial role in the Protestant Reformation by enabling the mass distribution of religious texts. Some historians argue that the printing press was as significant to its era as the internet has been to ours.',
      question:'According to the passage, which of the following are effects of the printing press?',
      options:[
        { text:'Books became more affordable and accessible.', correct:true },
        { text:'Literacy rates in Europe increased.', correct:true },
        { text:'The printing press was invented in the sixteenth century.', correct:false },
        { text:'It helped spread scientific knowledge during the Renaissance.', correct:true },
        { text:'It had no impact on religious movements.', correct:false }
      ] },
    { id:'rmcma-5',
      passage:'Sleep is essential for physical health, cognitive function, and emotional well-being. During sleep, the brain consolidates memories, clears toxic waste products, and repairs cellular damage. Chronic sleep deprivation has been linked to a wide range of health problems, including obesity, cardiovascular disease, diabetes, and weakened immune function. Research also shows that sleep-deprived individuals are significantly more likely to make errors in judgment, have slower reaction times, and experience mood disturbances. Despite mounting evidence of its importance, modern societies increasingly promote a culture of productivity that undervalues rest, with many adults consistently sleeping less than the recommended seven to nine hours per night.',
      question:'Which of the following are supported by the passage?',
      options:[
        { text:'The brain performs important functions during sleep.', correct:true },
        { text:'Chronic sleep deprivation only affects mood.', correct:false },
        { text:'Sleep deprivation can impair decision-making ability.', correct:true },
        { text:'Most adults get the recommended amount of sleep.', correct:false },
        { text:'Modern culture often undervalues the importance of sleep.', correct:true }
      ] },
  ],
  'reorder': [
    { id:'rop-1',
      paragraphs:[
        { id:'a', text:'The discovery of antibiotics in the twentieth century revolutionized medicine and saved millions of lives.' },
        { id:'b', text:'However, the overuse and misuse of these drugs has led to the emergence of antibiotic-resistant bacteria.' },
        { id:'c', text:'These so-called "superbugs" pose a serious threat to global health, as infections caused by them are difficult or impossible to treat with existing medications.' },
        { id:'d', text:'To address this crisis, researchers are exploring alternative approaches, including phage therapy, antimicrobial peptides, and CRISPR-based technologies.' },
        { id:'e', text:'Meanwhile, public health campaigns are encouraging more responsible use of antibiotics among both healthcare providers and patients.' }
      ],
      correctOrder:['a','b','c','d','e'] },
    { id:'rop-2',
      paragraphs:[
        { id:'a', text:'The Amazon rainforest is the largest tropical rainforest in the world, spanning nine countries in South America.' },
        { id:'b', text:'It is home to an estimated ten percent of all species on Earth, many of which have not yet been scientifically described.' },
        { id:'c', text:'In recent decades, deforestation driven by agriculture, logging, and mining has significantly reduced the forest\'s area.' },
        { id:'d', text:'This destruction not only threatens biodiversity but also releases vast quantities of stored carbon into the atmosphere.' },
        { id:'e', text:'Conservation efforts, including protected areas and sustainable land-use practices, are essential for preserving this irreplaceable ecosystem.' }
      ],
      correctOrder:['a','b','c','d','e'] },
    { id:'rop-3',
      paragraphs:[
        { id:'a', text:'Water is essential for all known forms of life and covers approximately seventy-one percent of the Earth\'s surface.' },
        { id:'b', text:'Despite its abundance, only about two and a half percent of the Earth\'s water is freshwater, and much of this is locked in glaciers and ice caps.' },
        { id:'c', text:'As a result, less than one percent of the world\'s water is readily accessible for human use.' },
        { id:'d', text:'Growing populations and changing climate patterns are putting increasing pressure on these limited freshwater resources.' },
        { id:'e', text:'Innovative solutions such as desalination technology and water recycling are becoming increasingly important for ensuring sustainable water supplies.' }
      ],
      correctOrder:['a','b','c','d','e'] },
    { id:'rop-4',
      paragraphs:[
        { id:'a', text:'Vaccination is widely regarded as one of the most successful public health interventions in history.' },
        { id:'b', text:'Since Edward Jenner developed the first vaccine against smallpox in 1796, vaccines have helped eradicate or control numerous deadly diseases.' },
        { id:'c', text:'Despite this remarkable track record, vaccine hesitancy has grown in recent years, fueled by misinformation on social media.' },
        { id:'d', text:'This reluctance to vaccinate has contributed to outbreaks of preventable diseases in several countries.' },
        { id:'e', text:'Public health authorities are responding with education campaigns and community engagement programs to rebuild trust in vaccination.' }
      ],
      correctOrder:['a','b','c','d','e'] },
    { id:'rop-5',
      paragraphs:[
        { id:'a', text:'Artificial intelligence has made remarkable progress in recent years, with systems now capable of performing tasks that once required human intelligence.' },
        { id:'b', text:'Applications range from language translation and medical diagnosis to autonomous driving and creative content generation.' },
        { id:'c', text:'However, the rapid advancement of AI has raised important ethical concerns about bias, privacy, and the displacement of human workers.' },
        { id:'d', text:'In response, governments and organizations worldwide are developing frameworks and regulations to ensure that AI is developed and deployed responsibly.' },
        { id:'e', text:'The challenge lies in balancing the immense potential benefits of AI with the need to protect individual rights and societal values.' }
      ],
      correctOrder:['a','b','c','d','e'] },
  ],
  'r-fib': [
    { id:'rfib-1',
      passage:'The human body is a complex biological {0} that requires a balanced intake of nutrients to function {1}. Proteins are essential for building and repairing {2}, while carbohydrates provide the primary source of {3} for daily activities. Vitamins and minerals, though needed in smaller {4}, play critical roles in immune function, bone health, and metabolic processes.',
      blanks:['system','optimally','tissues','energy','quantities'],
      distractors:['atmosphere','randomly','emotions','pollution','galaxies','constantly','attitude'] },
    { id:'rfib-2',
      passage:'The Industrial Revolution, which began in Britain in the late eighteenth century, fundamentally {0} the nature of work and society. The introduction of steam-powered {1} enabled mass production, replacing traditional hand-crafted methods. Workers migrated from rural areas to {2} centers in search of employment, leading to rapid urbanization. While the revolution brought unprecedented economic {3}, it also created harsh working conditions and significant environmental {4}.',
      blanks:['transformed','machinery','urban','growth','degradation'],
      distractors:['simplified','agriculture','underwater','recession','celebration','prohibited','harmony'] },
    { id:'rfib-3',
      passage:'Sleep plays a {0} role in maintaining physical and mental health. During sleep, the brain {1} memories from the day and clears metabolic waste products. Research has shown that chronic sleep {2} is associated with an increased risk of obesity, cardiovascular disease, and cognitive {3}. Health experts recommend that adults aim for seven to nine hours of {4} sleep each night.',
      blanks:['vital','consolidates','deprivation','decline','quality'],
      distractors:['minimal','ignores','abundance','improvement','toxic','ancient','external'] },
    { id:'rfib-4',
      passage:'Ocean currents play a {0} role in regulating the Earth\'s climate by distributing heat from the tropics to the {1} regions. The Gulf Stream, for example, carries warm water from the Gulf of Mexico across the Atlantic, {2} the climate of Western Europe considerably warmer than it would otherwise be. Changes in ocean circulation {3} could have dramatic effects on weather patterns, agricultural productivity, and sea {4} worldwide.',
      blanks:['crucial','polar','making','patterns','levels'],
      distractors:['minor','desert','preventing','textures','prices','artificial','random'] },
    { id:'rfib-5',
      passage:'The development of writing systems was a {0} milestone in human civilization. The earliest known writing, cuneiform, {1} in Mesopotamia around 3400 BCE as a means of recording commercial {2}. Over time, writing evolved beyond its practical origins to become a medium for preserving literature, religious texts, and {3} knowledge. Today, literacy is considered a fundamental {4} and a key indicator of social development.',
      blanks:['pivotal','emerged','transactions','scientific','right'],
      distractors:['trivial','vanished','emotions','musical','hobby','forgotten','accidental'] },
  ],
  'r-mcsa': [
    { id:'rmcsa-1',
      passage:'The theory of plate tectonics, developed in the 1960s, provides a comprehensive explanation for many geological phenomena, including earthquakes, volcanic eruptions, and mountain formation. According to this theory, the Earth\'s outer shell, or lithosphere, is divided into several large plates that float on the semi-fluid asthenosphere beneath. These plates move slowly but continuously, driven by convection currents in the Earth\'s mantle. Where plates collide, one may be forced beneath the other in a process called subduction, creating deep ocean trenches and volcanic arcs. Where plates pull apart, magma rises to fill the gap, forming new crust at mid-ocean ridges.',
      question:'What is the main idea of this passage?',
      options:[
        'Earthquakes are caused by the movement of tectonic plates.',
        'Plate tectonics explains a wide range of geological phenomena through the movement of lithospheric plates.',
        'The Earth\'s mantle is composed of semi-fluid material called the asthenosphere.',
        'Subduction zones create deep ocean trenches.',
        'Mid-ocean ridges are formed by rising magma.'
      ],
      correctIndex:1 },
    { id:'rmcsa-2',
      passage:'Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose. This process takes place primarily in the chloroplasts of plant cells, where chlorophyll absorbs light energy, mainly from the blue and red portions of the visible spectrum. During photosynthesis, carbon dioxide from the atmosphere and water absorbed by the roots are combined to produce glucose and oxygen. The oxygen is released as a byproduct, while the glucose serves as an energy source for the plant and, ultimately, for the animals that consume it. Photosynthesis is fundamental to life on Earth, as it forms the base of nearly all food chains and is the primary source of atmospheric oxygen.',
      question:'According to the passage, what role does chlorophyll play in photosynthesis?',
      options:[
        'It converts glucose into energy for plant growth.',
        'It releases oxygen as a primary product of photosynthesis.',
        'It absorbs light energy used in the photosynthetic process.',
        'It absorbs water from the soil through the roots.',
        'It produces carbon dioxide for the atmosphere.'
      ],
      correctIndex:2 },
    { id:'rmcsa-3',
      passage:'The concept of supply and demand is fundamental to understanding how market economies function. When the supply of a good exceeds demand, prices tend to fall as sellers compete for buyers. Conversely, when demand exceeds supply, prices rise as buyers compete for limited goods. This dynamic interaction between supply and demand determines the market equilibrium price — the point at which the quantity supplied equals the quantity demanded. External factors such as government regulations, technological changes, and shifts in consumer preferences can disrupt this equilibrium, causing prices to adjust until a new balance is reached.',
      question:'What happens when demand for a good exceeds its supply?',
      options:[
        'Prices tend to fall as sellers compete.',
        'The market reaches equilibrium immediately.',
        'Prices tend to rise as buyers compete for limited goods.',
        'Government regulations are automatically imposed.',
        'Technological changes eliminate the shortage.'
      ],
      correctIndex:2 },
    { id:'rmcsa-4',
      passage:'Migration patterns among birds have fascinated scientists for centuries. Many bird species undertake extraordinary journeys twice each year, traveling thousands of kilometers between their breeding grounds in temperate regions and their wintering grounds in the tropics. The Arctic tern holds the record for the longest migration of any animal, covering approximately seventy thousand kilometers annually on its journey from the Arctic to the Antarctic and back. Birds navigate using a combination of the Earth\'s magnetic field, the position of the sun and stars, and visual landmarks. Climate change is increasingly disrupting traditional migration patterns, with some species arriving at breeding grounds earlier or shifting their routes in response to changing temperatures and food availability.',
      question:'What is the primary focus of this passage?',
      options:[
        'The Arctic tern\'s record-breaking migration distance.',
        'How climate change affects all animal species.',
        'Bird migration patterns, navigation methods, and the impact of climate change.',
        'The magnetic field of the Earth and its uses.',
        'Why birds travel to the tropics during winter.'
      ],
      correctIndex:2 },
    { id:'rmcsa-5',
      passage:'The discovery of DNA\'s double helix structure by James Watson and Francis Crick in 1953 is considered one of the most important scientific breakthroughs of the twentieth century. Their work, which built upon X-ray crystallography data produced by Rosalind Franklin and Maurice Wilkins, revealed how genetic information is stored and replicated. The double helix model showed that DNA consists of two complementary strands wound around each other, with pairs of nucleotide bases forming the rungs of a twisted ladder. This discovery laid the foundation for the field of molecular biology and ultimately led to developments such as genetic engineering, DNA forensics, and the Human Genome Project.',
      question:'According to the passage, whose work contributed to Watson and Crick\'s discovery?',
      options:[
        'Only James Watson and Francis Crick made contributions.',
        'The Human Genome Project provided the initial data.',
        'Rosalind Franklin and Maurice Wilkins provided key X-ray data.',
        'Genetic engineers developed the initial double helix model.',
        'DNA forensics experts first identified the structure.'
      ],
      correctIndex:2 },
  ]
};
