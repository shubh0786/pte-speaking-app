window.PTE = window.PTE || {};

PTE.LISTENING_TYPES = {
  SUMMARIZE_SPOKEN_TEXT: {
    id: 'sst',
    name: 'Summarize Spoken Text',
    shortName: 'SST',
    icon: '🎧',
    color: '#8b5cf6',
    colorLight: '#ede9fe',
    module: 'listening',
    description: 'Listen to a short lecture and write a summary of 50-70 words.',
    examItems: '1-2 items',
    answerTime: 600,
    hasAudio: true,
    scoring: ['content:0-2', 'form:0-2', 'grammar:0-2', 'vocabulary:0-2'],
    skillsAssessed: ['Listening', 'Writing'],
    tips: [
      'Note the main idea and two or three supporting points while you listen',
      'Stay within 50-70 words — outside this range loses Form marks',
      'Use your own words; avoid copying long phrases from the audio',
      'Leave time to check grammar, spelling, and sentence structure',
      'Write one or two clear paragraphs with logical connectors'
    ]
  },
  MC_MULTIPLE_ANSWER_LISTENING: {
    id: 'l-mcma',
    name: 'Multiple Choice, Multiple Answer (Listening)',
    shortName: 'LMCMA',
    icon: '☑️',
    color: '#10b981',
    colorLight: '#d1fae5',
    module: 'listening',
    description: 'Listen to a recording and select all answers that are correct.',
    examItems: '1-2 items',
    answerTime: 120,
    hasAudio: true,
    scoring: ['+1 per correct selection', '-1 per incorrect selection', 'minimum 0'],
    skillsAssessed: ['Listening'],
    tips: [
      'Only select options you are confident match what was stated',
      'Wrong selections reduce your score — avoid guessing wildly',
      'The audio may mention several ideas; more than one option can be correct',
      'Use the time after the audio to re-read every option carefully',
      'Listen for paraphrases, not identical wording to the stem'
    ]
  },
  LISTEN_FILL_IN_BLANKS: {
    id: 'l-fib',
    name: 'Fill in the Blanks (Listening)',
    shortName: 'LFIB',
    icon: '✏️',
    color: '#f59e0b',
    colorLight: '#fef3c7',
    module: 'listening',
    description: 'Listen to a recording and type the words you hear in the transcript blanks.',
    examItems: '2-3 items',
    answerTime: 120,
    hasAudio: true,
    scoring: ['1 point per correct word'],
    skillsAssessed: ['Listening', 'Writing'],
    tips: [
      'Skim the transcript before the audio to predict content and word class',
      'Focus on spelling — correct spelling is usually required',
      'Listen for collocations and grammatical endings (plural, tense)',
      'If you miss a blank, move on and return if time allows',
      'Do not change words that are already printed in the transcript'
    ]
  },
  HIGHLIGHT_CORRECT_SUMMARY: {
    id: 'l-hcs',
    name: 'Highlight Correct Summary',
    shortName: 'HCS',
    icon: '📄',
    color: '#ec4899',
    colorLight: '#fce7f3',
    module: 'listening',
    description: 'Listen to a recording and select the paragraph that best summarizes it.',
    examItems: '1-2 items',
    answerTime: 120,
    hasAudio: true,
    scoring: ['1 for correct', '0 for incorrect'],
    skillsAssessed: ['Listening', 'Reading'],
    tips: [
      'Identify the central claim — summaries often differ in scope or emphasis',
      'Reject options that add unsupported details or omit the main idea',
      'Watch for overly narrow options that mention only one example',
      'After listening, compare remaining options against your mental outline',
      'Paraphrasing in the stem is normal; focus on meaning, not exact words'
    ]
  },
  MC_SINGLE_ANSWER_LISTENING: {
    id: 'l-mcsa',
    name: 'Multiple Choice, Single Answer (Listening)',
    shortName: 'LMCSA',
    icon: '🔘',
    color: '#0ea5e9',
    colorLight: '#e0f2fe',
    module: 'listening',
    description: 'Listen to a recording and choose the single best answer.',
    examItems: '1-2 items',
    answerTime: 120,
    hasAudio: true,
    scoring: ['1 for correct', '0 for incorrect'],
    skillsAssessed: ['Listening'],
    tips: [
      'Read the question stem before the audio plays when possible',
      'Eliminate answers that contradict explicit information',
      'Be cautious with absolute language (always, never, only)',
      'Inference questions must still be consistent with the recording',
      'If two options seem close, choose the one that best fits the question focus'
    ]
  },
  SELECT_MISSING_WORD: {
    id: 'l-smw',
    name: 'Select Missing Word',
    shortName: 'SMW',
    icon: '🔇',
    color: '#6366f1',
    colorLight: '#e0e7ff',
    module: 'listening',
    description: 'The recording ends before the final word or phrase; choose the option that completes the idea.',
    examItems: '1-2 items',
    answerTime: 90,
    hasAudio: true,
    scoring: ['1 for correct', '0 for incorrect'],
    skillsAssessed: ['Listening'],
    tips: [
      'Follow the argument closely so you can predict the logical ending',
      'The correct option often completes a collocation or cause-effect chain',
      'Distractors may be related topics but not the natural completion',
      'Replay the ending mentally before selecting if you have spare seconds',
      'Pay attention to intonation before the cut — it often signals closure'
    ]
  },
  HIGHLIGHT_INCORRECT_WORDS: {
    id: 'l-hiw',
    name: 'Highlight Incorrect Words',
    shortName: 'HIW',
    icon: '🔍',
    color: '#ef4444',
    colorLight: '#fee2e2',
    module: 'listening',
    description: 'Read along with the transcript while listening and click words that differ from what you hear.',
    examItems: '2-3 items',
    answerTime: 120,
    hasAudio: true,
    scoring: ['+1 per correct click', '-1 per incorrect click', 'minimum 0'],
    skillsAssessed: ['Listening', 'Reading'],
    tips: [
      'Keep your eyes slightly ahead of the speaker when possible',
      'Only click when the spoken word does not match the screen text',
      'Random clicking will lose marks — wrong clicks carry a penalty',
      'Plural endings and small function words are common mismatch points',
      'If you lose your place, re-anchor using the next unmistakable phrase'
    ]
  },
  WRITE_FROM_DICTATION: {
    id: 'l-wfd',
    name: 'Write from Dictation',
    shortName: 'WFD',
    icon: '⌨️',
    color: '#f97316',
    colorLight: '#ffedd5',
    module: 'listening',
    description: 'Listen to a short sentence and type it exactly as you hear it.',
    examItems: '3-4 items',
    answerTime: 90,
    hasAudio: true,
    scoring: ['1 point per correct word'],
    skillsAssessed: ['Listening', 'Writing'],
    tips: [
      'Type what you hear — spelling and word order both matter',
      'Note initial capital letters and final punctuation if dictated',
      'If unsure of a word, write your best guess; partial credit rewards each correct word',
      'Listen for articles (a, an, the) and prepositions — they carry marks',
      'Use any short replay time to verify endings and plurals'
    ]
  }
};

PTE.ListeningQuestions = {
  'sst': [
    {
      id: 'sst-1',
      audioText: 'Today\'s lecture examines how urban green infrastructure affects public health outcomes. Research from several longitudinal studies indicates that residents living within three hundred meters of substantial vegetation report lower stress biomarkers and higher rates of physical activity. The mechanism is thought to combine improved air quality filtration, reduced urban heat exposure, and opportunities for social contact in shared outdoor spaces. City planners are therefore integrating green corridors and pocket parks into densification projects, although funding and maintenance remain persistent challenges in lower-income districts.',
      keywords: ['urban', 'green', 'infrastructure', 'public', 'health', 'vegetation', 'stress', 'physical', 'activity', 'air', 'quality', 'heat', 'planners', 'corridors', 'funding', 'maintenance']
    },
    {
      id: 'sst-2',
      audioText: 'This segment outlines recent developments in battery storage for renewable electricity grids. As solar and wind generation expand, utilities require scalable storage to balance intermittent supply. Lithium-ion systems dominate current deployment because of falling unit costs and mature manufacturing chains. Emerging alternatives include solid-state designs and long-duration flow batteries intended for overnight discharge. Analysts emphasize that policy incentives for grid modernization and transparent interconnection rules will strongly influence which technologies achieve commercial scale over the next decade.',
      keywords: ['battery', 'storage', 'renewable', 'grids', 'solar', 'wind', 'intermittent', 'lithium-ion', 'costs', 'solid-state', 'flow', 'policy', 'grid', 'modernization', 'commercial']
    },
    {
      id: 'sst-3',
      audioText: 'We now turn to cognitive load theory and its implications for instructional design in higher education. The theory distinguishes intrinsic load, which depends on concept difficulty, from extraneous load created by poor layout or redundant explanations. Effective multimedia lessons segment complex material, align visuals with narration, and avoid split attention across unrelated sources. Empirical trials in STEM courses show modest but consistent gains when designers remove decorative animations that do not support the learning objective.',
      keywords: ['cognitive', 'load', 'theory', 'instructional', 'design', 'intrinsic', 'extraneous', 'multimedia', 'segment', 'STEM', 'animations', 'learning', 'objective']
    },
    {
      id: 'sst-4',
      audioText: 'The speaker summarizes findings on microplastic pathways into freshwater systems. Agricultural runoff can transport tire particles and synthetic fibers from treated textiles into rivers, while inadequate wastewater filtration leaves substantial microbead residues. Ecotoxicology studies document uptake in invertebrates and subsequent biomagnification along food webs. Mitigation strategies under discussion include improved filtration standards, biodegradable polymer substitutes, and public campaigns to reduce single-use plastics at the household level.',
      keywords: ['microplastic', 'freshwater', 'runoff', 'tire', 'fibers', 'wastewater', 'microbeads', 'ecotoxicology', 'biomagnification', 'filtration', 'biodegradable', 'single-use', 'plastics']
    },
    {
      id: 'sst-5',
      audioText: 'This talk reviews ethical frameworks for deploying predictive algorithms in university admissions. Proponents argue that models can surface talented applicants whose achievements are obscured by traditional metrics, while critics warn about encoding historical bias and narrowing diversity. Transparent documentation of training data, regular fairness audits, and human review of borderline cases are presented as minimum safeguards. Institutions are urged to publish clear appeals processes when automated scores influence decisions.',
      keywords: ['ethical', 'predictive', 'algorithms', 'admissions', 'bias', 'diversity', 'training', 'data', 'fairness', 'audits', 'human', 'review', 'appeals', 'automated']
    },
    {
      id: 'sst-6',
      audioText: 'The recording describes a field experiment on collaborative learning in large introductory statistics courses. Students were assigned to structured peer groups with rotating roles for explanation and error checking. Compared with a control cohort receiving only lectures, the intervention group achieved higher scores on conceptual transfer items and reported greater persistence on open-ended tasks. Instructors noted that training peers to give constructive feedback was essential to avoid superficial discussion.',
      keywords: ['collaborative', 'learning', 'statistics', 'peer', 'groups', 'lectures', 'conceptual', 'transfer', 'persistence', 'feedback', 'instructors', 'intervention']
    }
  ],
  'l-mcma': [
    {
      id: 'lmcma-1',
      audioText: 'The seminar discusses telemedicine adoption after regional hospital capacity became constrained. Uptake increased sharply among younger adults and for follow-up consultations, while acute emergency presentations still favored in-person assessment. Privacy concerns about home environments and broadband inequality in rural counties were repeatedly cited as barriers that policymakers must address through targeted subsidies and clearer consent protocols.',
      question: 'According to the recording, which statements are correct?',
      options: [
        { text: 'Telemedicine use rose notably for routine follow-up appointments.', correct: true },
        { text: 'Emergency cases were mainly handled through video consultations.', correct: false },
        { text: 'Younger adults adopted telemedicine at higher rates.', correct: true },
        { text: 'Rural broadband gaps were identified as an obstacle.', correct: true },
        { text: 'Hospitals reported unlimited capacity throughout the period.', correct: false }
      ]
    },
    {
      id: 'lmcma-2',
      audioText: 'The lecturer evaluates carbon pricing instruments. Cap-and-trade systems set a declining emissions ceiling and allow firms to trade allowances, whereas carbon taxes impose a charge per ton of emissions. Both can generate revenue for green investment if designed carefully. The talk notes that export-exposed industries often receive transitional assistance to prevent leakage, and that credible monitoring is indispensable for market integrity.',
      question: 'Which ideas does the speaker support?',
      options: [
        { text: 'Cap-and-trade includes tradable permits within an emissions cap.', correct: true },
        { text: 'Carbon taxes never raise public funds.', correct: false },
        { text: 'Leakage concerns sometimes lead to support measures for trade-exposed sectors.', correct: true },
        { text: 'Monitoring is unnecessary once a tax is announced.', correct: false },
        { text: 'Revenue can fund low-carbon projects if policy design allows.', correct: true }
      ]
    },
    {
      id: 'lmcma-3',
      audioText: 'This excerpt covers bilingual education models in primary schools. Early immersion can accelerate second-language comprehension, but content teachers must scaffold subject vocabulary explicitly. Research highlighted in the talk suggests that students\' first-language literacy should be maintained to support academic transfer. Parents\' attitudes and resource levels influence program sustainability as much as curriculum quality.',
      question: 'Select all statements that reflect the recording.',
      options: [
        { text: 'Immersion may improve comprehension of the second language.', correct: true },
        { text: 'Teachers should ignore subject-specific vocabulary.', correct: false },
        { text: 'First-language literacy remains educationally important.', correct: true },
        { text: 'Parental support affects whether programs last.', correct: true },
        { text: 'Curriculum quality is the only factor mentioned.', correct: false }
      ]
    },
    {
      id: 'lmcma-4',
      audioText: 'The briefing summarizes ocean acidification chemistry. Absorbed carbon dioxide lowers pH and reduces carbonate availability for shell-building organisms. Laboratory evidence shows thinner shells in some mollusk larvae at projected end-century levels. Coastal ecosystems with limited buffering, such as certain upwelling zones, may experience impacts sooner than open-ocean averages suggest.',
      question: 'Which details are stated in the audio?',
      options: [
        { text: 'CO2 uptake decreases seawater pH.', correct: true },
        { text: 'Carbonate scarcity can affect calcifying species.', correct: true },
        { text: 'All mollusks thrive under acidification.', correct: false },
        { text: 'Some near-shore regions may face earlier stress than global averages imply.', correct: true },
        { text: 'Upwelling zones are never vulnerable.', correct: false }
      ]
    },
    {
      id: 'lmcma-5',
      audioText: 'The podcast segment reviews a meta-analysis on sleep extension interventions for adolescents. Extending sleep by even thirty to sixty minutes correlated with improved reaction time and working memory on laboratory tasks. School start-time delays were associated with better attendance, though transportation logistics complicated implementation. The narrator cautions that screen use at night can blunt gains from later wake times.',
      question: 'According to the speaker, which claims are accurate?',
      options: [
        { text: 'Modest sleep increases linked to cognitive gains in studies.', correct: true },
        { text: 'Later starts improved attendance in reviewed research.', correct: true },
        { text: 'Logistics posed no challenges for districts.', correct: false },
        { text: 'Evening screen habits can undermine sleep benefits.', correct: true },
        { text: 'Working memory never changed in experiments.', correct: false }
      ]
    },
    {
      id: 'lmcma-6',
      audioText: 'The talk describes open-access scholarly publishing. Authors or institutions may pay article processing charges so readers avoid paywalls. Advocates argue this widens readership for publicly funded science, while skeptics worry about incentives to accept weaker manuscripts when revenue depends on volume. Quality peer review and transparent editorial standards are emphasized as non-negotiable safeguards.',
      question: 'Which points does the recording make about open access?',
      options: [
        { text: 'APCs can fund free reader access.', correct: true },
        { text: 'Everyone agrees the model has no risks.', correct: false },
        { text: 'Publicly funded research may reach more readers.', correct: true },
        { text: 'Editorial standards and peer review remain critical.', correct: true },
        { text: 'Paywalls are universally preferred by researchers.', correct: false }
      ]
    }
  ],
  'l-fib': [
    {
      id: 'lfib-1',
      audioText: 'The tutorial explains that photosynthesis converts light energy into chemical energy stored in glucose, releasing oxygen as a by-product in the chloroplasts of plant cells.',
      transcript: 'The tutorial explains that photosynthesis converts light energy into chemical energy stored in ___, releasing ___ as a by-product in the ___ of plant cells.',
      answers: ['glucose', 'oxygen', 'chloroplasts']
    },
    {
      id: 'lfib-2',
      audioText: 'The historian argues that the printing press accelerated the spread of literacy by lowering the cost of reproducing texts across European universities and municipal schools.',
      transcript: 'The historian argues that the printing press accelerated the spread of ___ by lowering the ___ of reproducing texts across European universities and municipal ___.',
      answers: ['literacy', 'cost', 'schools']
    },
    {
      id: 'lfib-3',
      audioText: 'In macroeconomics lectures, aggregate demand is defined as total spending on domestically produced goods and services at a given price level over a specific period.',
      transcript: 'In macroeconomics lectures, aggregate demand is defined as total ___ on domestically produced goods and services at a given ___ level over a specific ___.',
      answers: ['spending', 'price', 'period']
    },
    {
      id: 'lfib-4',
      audioText: 'The biology seminar notes that enzymes act as catalysts by lowering the activation energy required for biochemical reactions without being consumed in the process.',
      transcript: 'The biology seminar notes that enzymes act as ___ by lowering the ___ energy required for biochemical reactions without being ___ in the process.',
      answers: ['catalysts', 'activation', 'consumed']
    },
    {
      id: 'lfib-5',
      audioText: 'The geography module states that meandering rivers erode outer banks and deposit sediment on inner bends, gradually shifting their channels across floodplains.',
      transcript: 'The geography module states that meandering rivers erode ___ banks and deposit sediment on inner ___, gradually shifting their ___ across floodplains.',
      answers: ['outer', 'bends', 'channels']
    },
    {
      id: 'lfib-6',
      audioText: 'The ethics lecture emphasizes informed consent, requiring that participants understand procedures, risks, and the right to withdraw from a study at any time.',
      transcript: 'The ethics lecture emphasizes informed ___, requiring that participants understand procedures, ___, and the right to ___ from a study at any time.',
      answers: ['consent', 'risks', 'withdraw']
    }
  ],
  'l-hcs': [
    {
      id: 'lhcs-1',
      audioText: 'The speaker reviews how vaccination campaigns reduced incidence of several communicable diseases in the twentieth century. Coverage thresholds matter for herd protection, and complacency can erode gains when immunization rates fall below recommended levels in specific communities.',
      summaries: [
        { text: 'Historical vaccination efforts lowered some infectious disease rates, but maintaining high coverage is essential because community protection weakens when uptake drops.', correct: true },
        { text: 'The lecture argues that vaccines were irrelevant to twentieth-century public health trends.', correct: false },
        { text: 'The main focus is exclusively on the economic cost of hospital equipment.', correct: false },
        { text: 'The speaker primarily discusses ocean currents and climate models.', correct: false }
      ]
    },
    {
      id: 'lhcs-2',
      audioText: 'The commentary addresses grade inflation at universities, linking rising average grades to compressed grading scales, employer signaling concerns, and faculty incentives that discourage rigorous differentiation among students.',
      summaries: [
        { text: 'Universities face questions about rising grades driven partly by incentives and compressed scales, which may blur signals to employers.', correct: true },
        { text: 'The talk proves that employers ignore transcripts entirely.', correct: false },
        { text: 'The central topic is athletic scholarships and stadium funding.', correct: false },
        { text: 'The speaker recommends abolishing all examinations worldwide.', correct: false }
      ]
    },
    {
      id: 'lhcs-3',
      audioText: 'The segment describes randomized controlled trials in medical research, highlighting blinding, placebo controls, and intention-to-treat analysis as tools to reduce bias when estimating treatment effects.',
      summaries: [
        { text: 'RCT methods such as blinding and controls help researchers estimate treatment effects more reliably by limiting bias.', correct: true },
        { text: 'The recording states that placebos are never used in clinical science.', correct: false },
        { text: 'The lecture is mainly about training marathon runners.', correct: false },
        { text: 'The speaker claims bias is impossible in observational studies only.', correct: false }
      ]
    },
    {
      id: 'lhcs-4',
      audioText: 'The briefing covers sustainable fisheries management, including catch limits based on stock assessments, seasonal closures to protect spawning, and international agreements to combat illegal harvesting on the high seas.',
      summaries: [
        { text: 'Managing fish stocks involves science-based limits, seasonal protections, and cooperation against illegal fishing beyond national waters.', correct: true },
        { text: 'The talk recommends unlimited catches to maximize short-term profit.', correct: false },
        { text: 'The audio focuses on desert irrigation techniques.', correct: false },
        { text: 'The speaker argues that stock assessments are unnecessary.', correct: false }
      ]
    },
    {
      id: 'lhcs-5',
      audioText: 'The lecture traces how peer review functions in academic publishing, noting that reviewers evaluate methodology and significance while editors balance reviewer comments with journal scope and ethical guidelines.',
      summaries: [
        { text: 'Peer review helps assess research quality within a process where editors weigh reviewer input against scope and ethics.', correct: true },
        { text: 'Editors never read manuscripts before acceptance.', correct: false },
        { text: 'The recording is primarily about social media influencers.', correct: false },
        { text: 'The speaker states reviewers only check spelling.', correct: false }
      ]
    },
    {
      id: 'lhcs-6',
      audioText: 'The talk explains formative assessment in classrooms, where low-stakes quizzes and drafts provide feedback that guides improvement before summative grades are assigned.',
      summaries: [
        { text: 'Formative assessment uses ongoing feedback from tasks like quizzes to help students improve before final grading.', correct: true },
        { text: 'The lecture defines formative assessment as high-stakes only.', correct: false },
        { text: 'The main idea is that feedback should always arrive after graduation.', correct: false },
        { text: 'The speaker focuses on stock market prediction models.', correct: false }
      ]
    }
  ],
  'l-mcsa': [
    {
      id: 'lmcsa-1',
      audioText: 'The speaker explains that a confidence interval in statistics provides a range of plausible values for a population parameter at a chosen confidence level, not a probability statement about the parameter jumping randomly.',
      question: 'What is the main purpose of a confidence interval, according to the lecture?',
      options: [
        'To list every raw data point collected in the sample',
        'To give a range of plausible values for a population parameter at a stated confidence level',
        'To prove that the sample mean is always exactly equal to the population mean',
        'To replace the need for any sample size calculation'
      ],
      correctIndex: 1
    },
    {
      id: 'lmcsa-2',
      audioText: 'The recording defines cultural relativism as the principle that beliefs and practices should be understood within their own cultural context rather than judged solely by external standards.',
      question: 'According to the speaker, cultural relativism emphasizes which approach?',
      options: [
        'Judging all cultures by a single universal checklist',
        'Ignoring historical context when reading texts',
        'Understanding practices within their own cultural framework',
        'Assuming all moral disagreements are meaningless'
      ],
      correctIndex: 2
    },
    {
      id: 'lmcsa-3',
      audioText: 'The lecturer states that opportunity cost is the value of the next-best alternative forgone when a choice is made, and it is central to rational decision-making under scarcity.',
      question: 'What does the speaker identify as opportunity cost?',
      options: [
        'The total money spent on every option combined',
        'The value of the next-best alternative given up when choosing',
        'Any sunk cost from past decisions',
        'The difference between supply and demand'
      ],
      correctIndex: 1
    },
    {
      id: 'lmcsa-4',
      audioText: 'The segment describes active transport across cell membranes, noting that it moves substances against concentration gradients and requires energy, often from ATP hydrolysis.',
      question: 'According to the audio, what distinguishes active transport?',
      options: [
        'It never requires energy input',
        'It only moves substances down their concentration gradient',
        'It can move substances against a concentration gradient using energy',
        'It exclusively describes diffusion through lipid bilayers'
      ],
      correctIndex: 2
    },
    {
      id: 'lmcsa-5',
      audioText: 'The talk outlines reflexive pronouns in English grammar, clarifying that they refer back to the subject of the clause and appear when the subject and object denote the same entity.',
      question: 'What function of reflexive pronouns does the speaker highlight?',
      options: [
        'They replace every noun phrase in formal writing',
        'They indicate tense shifts in passive constructions',
        'They refer back to the subject when subject and object are the same entity',
        'They mark plural subjects only'
      ],
      correctIndex: 2
    },
    {
      id: 'lmcsa-6',
      audioText: 'The briefing summarizes Keynesian ideas during recessions, arguing that insufficient aggregate demand can justify temporary government spending increases to stimulate output.',
      question: 'What is the speaker\'s central claim about Keynesian policy in a recession?',
      options: [
        'Recessions always eliminate the need for government action',
        'Low aggregate demand may warrant stimulus spending to lift output',
        'Prices adjust instantly so stimulus never matters',
        'Tax cuts are irrelevant to aggregate demand'
      ],
      correctIndex: 1
    }
  ],
  'l-smw': [
    {
      id: 'lsmw-1',
      audioText: 'Scholars increasingly rely on preregistered study protocols to reduce selective reporting and make hypothesis tests more transparent in the social sciences.',
      audioPlayText: 'Scholars increasingly rely on preregistered study protocols to reduce selective reporting and make hypothesis tests more transparent in the social',
      options: ['economies', 'sciences', 'laboratories', 'libraries'],
      correctIndex: 1
    },
    {
      id: 'lsmw-2',
      audioText: 'The seminar concludes that longitudinal datasets are invaluable for disentangling correlation from causation in health behavior research.',
      audioPlayText: 'The seminar concludes that longitudinal datasets are invaluable for disentangling correlation from causation in health behavior',
      options: ['theory', 'research', 'journalism', 'marketing'],
      correctIndex: 1
    },
    {
      id: 'lsmw-3',
      audioText: 'Critics argue that standardized admissions tests may advantage applicants with access to expensive preparation courses.',
      audioPlayText: 'Critics argue that standardized admissions tests may advantage applicants with access to expensive preparation',
      options: ['books', 'courses', 'universities', 'scholarships'],
      correctIndex: 1
    },
    {
      id: 'lsmw-4',
      audioText: 'The module emphasizes that plagiarism violates academic integrity because it misrepresents borrowed ideas as original work.',
      audioPlayText: 'The module emphasizes that plagiarism violates academic integrity because it misrepresents borrowed ideas as original',
      options: ['effort', 'work', 'grades', 'titles'],
      correctIndex: 1
    },
    {
      id: 'lsmw-5',
      audioText: 'Researchers caution that machine learning models can perpetuate bias present in historical training data unless mitigation steps are applied.',
      audioPlayText: 'Researchers caution that machine learning models can perpetuate bias present in historical training data unless mitigation steps are',
      options: ['ignored', 'applied', 'published', 'deleted'],
      correctIndex: 1
    },
    {
      id: 'lsmw-6',
      audioText: 'The lecture notes that mitochondria generate most of the ATP used by eukaryotic cells during aerobic respiration.',
      audioPlayText: 'The lecture notes that mitochondria generate most of the ATP used by eukaryotic cells during aerobic',
      options: ['digestion', 'respiration', 'fermentation', 'photosynthesis'],
      correctIndex: 1
    }
  ],
  'l-hiw': [
    {
      id: 'lhiw-1',
      audioText: 'The professor argues that empirical evidence supports gradual climate adaptation rather than abrupt policy shocks that could disrupt energy markets.',
      displayText: 'The professor argues that empirical evidence supports rapid climate adaptation rather than abrupt policy shocks that could disrupt energy markets.',
      incorrectIndices: [7]
    },
    {
      id: 'lhiw-2',
      audioText: 'Laboratory safety requires goggles, proper ventilation, and careful handling of volatile solvents near ignition sources.',
      displayText: 'Laboratory safety requires goggles, proper ventilation, and careless handling of volatile solvents near ignition sources.',
      incorrectIndices: [7]
    },
    {
      id: 'lhiw-3',
      audioText: 'The literature review synthesizes peer-reviewed articles published within the last decade on renewable microgrids.',
      displayText: 'The literature review synthesizes peer-reviewed articles published within the last decade on renewable highways.',
      incorrectIndices: [13]
    },
    {
      id: 'lhiw-4',
      audioText: 'Students must cite all paraphrased ideas to avoid unintentional plagiarism in academic essays.',
      displayText: 'Students must cite all paraphrased ideas to encourage unintentional plagiarism in academic essays.',
      incorrectIndices: [7]
    },
    {
      id: 'lhiw-5',
      audioText: 'The seminar highlighted that sample randomization reduces selection bias in experimental designs.',
      displayText: 'The seminar highlighted that sample clustering reduces selection bias in experimental designs.',
      incorrectIndices: [5]
    },
    {
      id: 'lhiw-6',
      audioText: 'Urban planners proposed expanding cycle lanes to reduce congestion and improve air quality downtown.',
      displayText: 'Urban planners proposed expanding parking lanes to reduce congestion and improve air quality downtown.',
      incorrectIndices: [4]
    }
  ],
  'l-wfd': [
    { id: 'lwfd-1', audioText: 'The lecture series will examine both classical and contemporary theories of moral responsibility in public policy debates.' },
    { id: 'lwfd-2', audioText: 'Researchers are investigating whether bilingual education improves executive function in primary school children.' },
    { id: 'lwfd-3', audioText: 'Sustainable agriculture depends on soil conservation, crop rotation, and efficient water management over many seasons.' },
    { id: 'lwfd-4', audioText: 'The hypothesis predicts that sleep deprivation will impair memory consolidation during the first cycle of slow-wave sleep.' },
    { id: 'lwfd-5', audioText: 'Peer reviewers evaluated the methodology carefully before the journal agreed to publish the revised manuscript online.' },
    { id: 'lwfd-6', audioText: 'International students must demonstrate English proficiency through an approved standardized test before enrolling in graduate coursework.' }
  ]
};
