/**
 * PTE Writing/Reading/Listening - High-Frequency Prediction Bank
 * Compiled from public exam-recall sources (2025-2026 edition).
 * Auto-merges into PTE.WritingQuestions / ReadingQuestions / ListeningQuestions
 * via PTE.mergePredictions() on load.
 */
window.PTE = window.PTE || {};
PTE.Predictions = PTE.Predictions || {};

// ═══════════════════════════════════════════════════════════════
// SUMMARIZE WRITTEN TEXT — high-frequency passages
// ═══════════════════════════════════════════════════════════════
PTE.Predictions['swt'] = [
  { id:'pswt-1', source:'APEUni', frequency:'very-high',
    title:'Remote Work and Productivity',
    passage:'The shift toward remote work has prompted extensive study of its effects on productivity. Research from several large firms indicates that employees working from home complete tasks at a similar or higher rate than their office-based counterparts, partly because fewer interruptions and the absence of a commute recover time for focused work. Nevertheless, the same studies caution that prolonged isolation can weaken collaboration on complex problems and slow the transfer of informal knowledge that normally occurs through casual workplace conversation.',
    keywords:['remote','work','productivity','research','firms','employees','home','higher','interruptions','commute','isolation','collaboration','knowledge','conversation'] },
  { id:'pswt-2', source:'Gurully', frequency:'high',
    title:'Electric Vehicles and Grid Demand',
    passage:'Widespread adoption of electric vehicles is expected to increase demand on electricity grids significantly, particularly during evening hours when commuters return home and plug in their cars. Without careful management, this concentrated charging could strain local infrastructure and raise peak loads. Analysts recommend smart charging systems that schedule charging overnight, dynamic pricing that discourages peak-time use, and investment in storage to absorb surplus renewable generation for later deployment.',
    keywords:['electric','vehicles','demand','grids','evening','commuters','charging','infrastructure','peak','smart','scheduling','pricing','storage','renewable'] },
  { id:'pswt-3', source:'PTE Hub', frequency:'high',
    title:'Coral Reef Restoration',
    passage:'Coral reef restoration projects increasingly combine coral gardening with selective breeding of heat-resistant varieties. Researchers grow fragments in nurseries before transplanting them onto degraded reefs, where survival rates depend on water temperature and competition from algae. While such interventions cannot reverse warming on their own, they may preserve genetic diversity and buy time until broader climate action stabilizes ocean conditions.',
    keywords:['coral','reef','restoration','gardening','breeding','heat-resistant','nurseries','transplanting','temperature','algae','genetic','diversity','climate','ocean'] }
];

// ═══════════════════════════════════════════════════════════════
// WRITE ESSAY — high-frequency prompts
// ═══════════════════════════════════════════════════════════════
PTE.Predictions['write-essay'] = [
  { id:'pwe-1', source:'APEUni', frequency:'very-high',
    prompt:'Many people believe that social media has a negative impact on society. To what extent do you agree or disagree? Give reasons and examples to support your view.',
    keywords:['social','media','society','negative','impact','agree','disagree','reasons','examples','communication','misinformation','mental','health'] },
  { id:'pwe-2', source:'Gurully', frequency:'high',
    prompt:'Some people think that universities should focus on academic subjects, while others believe they should prepare students for the workplace. Discuss both views and give your opinion.',
    keywords:['universities','academic','subjects','workplace','prepare','skills','employability','knowledge','debate','opinion','curriculum','career'] },
  { id:'pwe-3', source:'StormEduGo', frequency:'high',
    prompt:'In many countries, the population is aging. What are the causes and effects of this trend, and what measures could governments take to address it?',
    keywords:['aging','population','causes','effects','trend','governments','measures','healthcare','workforce','pension','birth','rate','life','expectancy'] }
];

// ═══════════════════════════════════════════════════════════════
// READING & WRITING: FILL IN THE BLANKS — high-frequency
// ═══════════════════════════════════════════════════════════════
PTE.Predictions['rw-fib'] = [
  { id:'prwfib-1', source:'APEUni', frequency:'very-high',
    passage:'Artificial intelligence is rapidly {0} the way businesses analyze large volumes of data. Machine learning models can {1} patterns that would be invisible to human analysts, enabling faster and more {2} decisions. However, reliance on these systems raises concerns about transparency, since the reasoning behind some model outputs is not easily {3} to users or regulators.',
    blanks:[
      { options:['transforming','ignoring','interrupting','forgetting'], correct:0 },
      { options:['detect','destroy','dismiss','distort'], correct:0 },
      { options:['accurate','random','superficial','hostile'], correct:0 },
      { options:['explained','concealed','forbidden','postponed'], correct:0 }
    ] },
  { id:'prwfib-2', source:'Gurully', frequency:'high',
    passage:'Biodiversity underpins the functioning of ecosystems by {0} resilience against environmental shocks. Diverse communities of species are generally better able to {1} from disturbances such as drought or fire, because different species {2} distinct roles and can compensate for one another. As species are lost, ecosystems become more {3} to collapse.',
    blanks:[
      { options:['providing','removing','avoiding','rejecting'], correct:0 },
      { options:['recover','suffer','retreat','vanish'], correct:0 },
      { options:['fill','abandon','ignore','reject'], correct:0 },
      { options:['vulnerable','immune','resistant','indifferent'], correct:0 }
    ] }
];

// ═══════════════════════════════════════════════════════════════
// READING: FILL IN THE BLANKS — high-frequency
// ═══════════════════════════════════════════════════════════════
PTE.Predictions['r-fib'] = [
  { id:'prfib-1', source:'APEUni', frequency:'very-high',
    passage:'The invention of the printing press in the fifteenth century {0} the spread of knowledge across Europe. By making books far cheaper to produce, it allowed new {1} to reach a much wider audience. Over time, rising literacy rates and the circulation of {2} texts helped fuel major intellectual movements. Historians often {3} this innovation as a turning point comparable in significance to the modern internet.',
    blanks:['accelerated','ideas','religious','describe'],
    distractors:['delayed','silence','weather','myth','copper','randomly','luxury'] },
  { id:'prfib-2', source:'Gurully', frequency:'high',
    passage:'Effective public speaking requires both clear structure and confident {0}. A well-organized speech guides the audience through each point without {1} them. Speakers who vary their tone and pace tend to hold attention more {2}, while monotonous delivery often causes listeners to lose {3} quickly.',
    blanks:['delivery','confusing','effectively','focus'],
    distractors:['weather','texture','betray','forgery','copper','delay','vacuum'] }
];

// ═══════════════════════════════════════════════════════════════
// SUMMARIZE SPOKEN TEXT — high-frequency lectures
// ═══════════════════════════════════════════════════════════════
PTE.Predictions['sst'] = [
  { id:'psst-1', source:'APEUni', frequency:'very-high',
    audioText:'The lecture discusses the origins and impact of the industrial revolution, which began in Britain in the late eighteenth century. The speaker explains how the development of steam power and mechanized factories transformed production, drawing workers from rural areas into rapidly growing cities. While living standards eventually rose, the transition also produced harsh working conditions and significant environmental pollution that reformers spent decades addressing.',
    keywords:['industrial','revolution','Britain','eighteenth','century','steam','power','factories','production','urbanization','cities','working','conditions','pollution','reformers'] },
  { id:'psst-2', source:'Gurully', frequency:'high',
    audioText:'The talk explores how language shapes thought, a hypothesis associated with linguists such as Benjamin Lee Whorf. The speaker presents evidence that the structure of a language can influence habitual attention to features like color, direction, or time. However, the lecturer cautions against strong determinism, noting that bilingual speakers can shift perspectives and that human thought is not rigidly confined by any single language.',
    keywords:['language','thought','Whorf','structure','attention','color','direction','time','determinism','bilingual','perspectives','confined'] }
];

// ═══════════════════════════════════════════════════════════════
// WRITE FROM DICTATION — high-frequency sentences
// ═══════════════════════════════════════════════════════════════
PTE.Predictions['l-wfd'] = [
  { id:'pwfd-1', source:'APEUni', frequency:'very-high', audioText:'The library will be closed on Monday for the public holiday.' },
  { id:'pwfd-2', source:'APEUni', frequency:'very-high', audioText:'Students must submit their assignments by the end of this week.' },
  { id:'pwfd-3', source:'Gurully', frequency:'very-high', audioText:'The new campus is located near the central train station.' },
  { id:'pwfd-4', source:'Gurully', frequency:'high', audioText:'Researchers are examining the effects of climate on crop yields.' },
  { id:'pwfd-5', source:'PTE Hub', frequency:'high', audioText:'The report highlights several challenges facing the healthcare system.' },
  { id:'pwfd-6', source:'APEUni', frequency:'high', audioText:'Please ensure that all mobile devices are switched off during the exam.' },
  { id:'pwfd-7', source:'StormEduGo', frequency:'high', audioText:'The department will announce the scholarship results next month.' },
  { id:'pwfd-8', source:'Gurully', frequency:'very-high', audioText:'The lecture has been rescheduled to Wednesday afternoon.' }
];

// ═══════════════════════════════════════════════════════════════
// READING: MC SINGLE ANSWER — high-frequency
// ═══════════════════════════════════════════════════════════════
PTE.Predictions['r-mcsa'] = [
  { id:'prmcsa-1', source:'APEUni', frequency:'high',
    passage:'The concept of the "sharing economy" describes platforms that let individuals rent or share underused assets such as cars, tools, or rooms. Proponents argue these arrangements improve efficiency and create income opportunities, while critics raise concerns about uneven regulation, quality control, and the displacement of traditional workers. The long-term effects of this model remain contested and vary considerably between industries.',
    question:'What is the passage mainly about?',
    options:[
      'A detailed history of hotel construction',
      'An overview of the sharing economy and the debate surrounding it',
      'A technical guide to building rental platforms',
      'A comparison of fuel efficiency in cars'
    ],
    correctIndex:1 }
];
