/**
 * PTE Reading - EXPANDED Question Bank
 * Extra questions for rw-fib, r-mcma, reorder, r-fib, r-mcsa
 * Auto-merges into PTE.ReadingQuestions on load
 */
window.PTE = window.PTE || {};
window.PTE._bankReading = {

'rw-fib': [
  { id:'xrwfib-1',
    passage:'The human circulatory system is a remarkable network of {0} that delivers oxygen and nutrients to every cell in the body. The heart acts as a central {1}, pumping blood through a vast system of arteries and veins. Red blood cells contain hemoglobin, a protein that {2} oxygen from the lungs to distant tissues. When blood flow is {3} by blockages, the resulting deprivation can cause serious damage to organs such as the heart and {4}.',
    blanks:[
      { options:['vessels','wires','tunnels','bridges'], correct:0 },
      { options:['pump','filter','valve','sensor'], correct:0 },
      { options:['transports','discards','conceals','weakens'], correct:0 },
      { options:['obstructed','accelerated','amplified','widened'], correct:0 },
      { options:['brain','garden','ocean','market'], correct:0 }
    ] },
  { id:'xrwfib-2',
    passage:'Renewable energy adoption is {0} expanding as nations seek to reduce greenhouse gas emissions. Solar panels convert sunlight directly into electricity, while wind turbines {1} the kinetic energy of moving air. Unlike fossil fuels, these sources are continuously {2} and produce no emissions during operation. However, their intermittent output requires advances in energy {3} to ensure reliable supply during periods of low sun or {4}.',
    blanks:[
      { options:['rapidly','reluctantly','temporarily','superficially'], correct:0 },
      { options:['capture','release','ignore','destroy'], correct:0 },
      { options:['replenished','exhausted','buried','imported'], correct:0 },
      { options:['storage','pricing','coloring','packaging'], correct:0 },
      { options:['wind','debt','silence','hunger'], correct:0 }
    ] },
  { id:'xrwfib-3',
    passage:'Cognitive psychology examines how people {0}, process, and store information. Memory is commonly divided into sensory, short-term, and long-term stores, each with distinct {1}. Attention acts as a filter that selects which incoming stimuli receive conscious {2}. When attention is divided across multiple tasks, performance typically {3}, a phenomenon with important implications for activities such as {4}.',
    blanks:[
      { options:['perceive','ignore','forget','misplace'], correct:0 },
      { options:['capacities','recipes','uniforms','weather'], correct:0 },
      { options:['examination','rejection','punishment','dismissal'], correct:0 },
      { options:['deteriorates','improves','stabilizes','peaks'], correct:0 },
      { options:['driving','sleeping','singing','cooking'], correct:0 }
    ] },
  { id:'xrwfib-4',
    passage:'The water cycle describes the continuous {0} of water between the atmosphere and the surface. Evaporation turns liquid water into vapor, which rises and {1} into clouds. Precipitation returns water to the ground, where it may flow into rivers or {2} into underground aquifers. This cycle is vital for {3} freshwater supplies and supporting all forms of {4}.',
    blanks:[
      { options:['movement','destruction','marketing','collapse'], correct:0 },
      { options:['condenses','evaporates','solidifies','explodes'], correct:0 },
      { options:['seeps','floats','evaporates','melts'], correct:0 },
      { options:['maintaining','depleting','polluting','ignoring'], correct:0 },
      { options:['life','fiction','debt','silence'], correct:0 }
    ] },
  { id:'xrwfib-5',
    passage:'Effective communication requires both a clear message and an attentive {0}. Speakers must tailor their language and tone to their {1} to avoid misunderstandings. Nonverbal cues such as gestures and facial expressions often {2} more meaning than the words themselves. When cultural differences are ignored, even well-intentioned messages can be {3}, leading to confusion or {4}.',
    blanks:[
      { options:['listener','machine','animal','statue'], correct:0 },
      { options:['audience','rivals','ancestors','machinery'], correct:0 },
      { options:['convey','conceal','distort','erase'], correct:0 },
      { options:['misinterpreted','perfected','celebrated','memorized'], correct:0 },
      { options:['offense','harmony','agreement','praise'], correct:0 }
    ] }
],

'r-mcma': [
  { id:'xrmcma-1',
    passage:'Volunteering has been shown to benefit both communities and the volunteers themselves. Studies indicate that people who volunteer regularly report higher levels of life satisfaction and lower rates of depression. Volunteering can also build valuable skills, expand professional networks, and foster a sense of purpose. For communities, volunteers provide essential services that might otherwise be underfunded, from tutoring to disaster relief. Critics note, however, that volunteering should not be used as a substitute for adequately funded public services, and that some organizations rely too heavily on unpaid labor.',
    question:'According to the passage, which statements are correct?',
    options:[
      { text:'Volunteering can improve volunteers\' mental well-being.', correct:true },
      { text:'Volunteers never acquire useful skills.', correct:false },
      { text:'Volunteering can help expand professional networks.', correct:true },
      { text:'Communities receive no benefit from volunteers.', correct:false },
      { text:'The passage warns against using volunteers to replace properly funded services.', correct:true }
    ] },
  { id:'xrmcma-2',
    passage:'The scientific method relies on systematic observation, experimentation, and the willingness to revise conclusions in light of new evidence. A well-designed experiment controls variables to isolate cause and effect, and its results should be reproducible by independent researchers. Peer review serves as a quality check, though it does not guarantee that findings are correct. Science advances through both gradual refinement and occasional paradigm shifts that overturn established thinking.',
    question:'Which of the following does the passage support?',
    options:[
      { text:'Reproducibility is an important feature of scientific results.', correct:true },
      { text:'Peer review guarantees that all findings are correct.', correct:false },
      { text:'Scientists should be willing to revise conclusions given new evidence.', correct:true },
      { text:'Scientific progress can occur through paradigm shifts.', correct:true },
      { text:'The scientific method ignores experimentation.', correct:false }
    ] },
  { id:'xrmcma-3',
    passage:'Electric vehicles produce zero tailpipe emissions, making them attractive for improving urban air quality. However, their overall environmental benefit depends on how the electricity that charges them is generated; vehicles charged from coal-heavy grids still contribute indirectly to emissions. Battery production also carries environmental and ethical costs, particularly regarding the mining of lithium and cobalt. Advances in battery recycling and cleaner grids are expected to strengthen the case for electric vehicles over time.',
    question:'Based on the passage, which statements are true?',
    options:[
      { text:'Electric vehicles always produce zero emissions overall.', correct:false },
      { text:'The source of electricity affects an electric vehicle\'s environmental impact.', correct:true },
      { text:'Battery production raises environmental and ethical concerns.', correct:true },
      { text:'Electric vehicles have tailpipe emissions like gasoline cars.', correct:false },
      { text:'Cleaner grids and battery recycling could improve the case for electric vehicles.', correct:true }
    ] }
],

'reorder': [
  { id:'xrop-1',
    paragraphs:[
      { id:'a', text:'Renewable energy sources such as solar and wind have become increasingly cost-competitive with fossil fuels.' },
      { id:'b', text:'As a result, many countries are investing heavily in clean energy infrastructure.' },
      { id:'c', text:'Despite this progress, the transition is not uniform across regions.' },
      { id:'d', text:'Developing nations often face financial and technological barriers to adoption.' },
      { id:'e', text:'International cooperation and funding are therefore essential to ensure an equitable energy transition.' }
    ],
    correctOrder:['a','b','c','d','e'] },
  { id:'xrop-2',
    paragraphs:[
      { id:'a', text:'Sleep is a complex biological process essential for human health.' },
      { id:'b', text:'During sleep, the brain consolidates memories and clears metabolic waste.' },
      { id:'c', text:'Chronic sleep deprivation has been linked to numerous health problems.' },
      { id:'d', text:'These include obesity, cardiovascular disease, and impaired immune function.' },
      { id:'e', text:'Experts therefore recommend that adults consistently get seven to nine hours of sleep each night.' }
    ],
    correctOrder:['a','b','c','d','e'] },
  { id:'xrop-3',
    paragraphs:[
      { id:'a', text:'The internet has transformed how people access and share information.' },
      { id:'b', text:'Before its widespread adoption, information dissemination was slower and more centralized.' },
      { id:'c', text:'Today, individuals can publish content to a global audience within seconds.' },
      { id:'d', text:'This democratization of publishing has both empowered expression and enabled the rapid spread of misinformation.' },
      { id:'e', text:'Developing critical evaluation skills is consequently more important than ever.' }
    ],
    correctOrder:['a','b','c','d','e'] }
],

'r-fib': [
  { id:'xrfib-1',
    passage:'Reading comprehension depends on both decoding skills and prior {0}. Fluent readers recognize words automatically, freeing attention for higher-level {1}. When readers encounter unfamiliar vocabulary, they often use surrounding context to infer {2}. Research shows that extensive reading builds both vocabulary and general {3}, which in turn makes future reading easier and more {4}.',
    blanks:['knowledge','understanding','meaning','knowledge','enjoyable'],
    distractors:['confusion','noise','randomly','weather','vacuum','celery','suspicion'] },
  { id:'xrfib-2',
    passage:'A healthy diet provides the body with essential {0} in appropriate proportions. Fruits and vegetables are rich sources of vitamins, minerals, and dietary {1}. Proteins supply the building blocks needed for muscle {2} and tissue repair. Consuming excessive amounts of processed sugar can {3} to weight gain and metabolic problems, so nutritionists recommend {4} such foods whenever possible.',
    blanks:['nutrients','fiber','growth','contribute','limiting'],
    distractors:['taxes','galaxies','silence','drift','betray','copper','myth'] },
  { id:'xrfib-3',
    passage:'Climate change is altering ecosystems at an unprecedented {0}. Rising temperatures shift the ranges of many species, forcing them to migrate toward the {1} or higher elevations. Some organisms cannot adapt quickly enough and face {2}. In addition to biodiversity loss, climate change threatens human {3} through more frequent droughts, floods, and {4} events.',
    blanks:['rate','poles','extinction','agriculture','extreme'],
    distractors:['melody','carpet','randomly','forgery','delay','texture','luxury'] },
  { id:'xrfib-4',
    passage:'Effective leadership involves setting a clear {0} and inspiring others to work toward it. Good leaders communicate expectations transparently and {1} accountability among team members. They also recognize individual strengths and {2} tasks accordingly. When challenges arise, resilient leaders remain {3} and adapt their strategies rather than {4} to pressure.',
    blanks:['vision','foster','assign','calm','yielding'],
    distractors:['chaos','weather','texture','myth','copper','randomly','delay'] }
],

'r-mcsa': [
  { id:'xrmcsa-1',
    passage:'Bioluminescence is the production and emission of light by living organisms. It occurs widely in marine environments, particularly among deep-sea creatures, but is also found in certain fungi and terrestrial insects such as fireflies. The light is generated through a chemical reaction involving a light-emitting molecule and an enzyme. Organisms use bioluminescence for a variety of purposes, including attracting mates, confusing predators, and luring prey. Because it requires no heat, bioluminescence is sometimes called "cold light."',
    question:'What is bioluminescence, according to the passage?',
    options:[
      'A form of light produced by heat-resistant metals',
      'Light produced by living organisms through a chemical reaction',
      'A type of reflection from the ocean surface',
      'Light generated exclusively by deep-sea minerals'
    ],
    correctIndex:1 },
  { id:'xrmcsa-2',
    passage:'The concept of opportunity cost refers to the value of the next best alternative that is given up when a choice is made. Whenever resources such as time, money, or labor are limited, choosing one option means forgoing others. Economists use opportunity cost to analyze decisions ranging from individual purchases to national policy. Understanding opportunity cost helps people make more informed trade-offs, even when the forgone alternative is not easily measured in monetary terms.',
    question:'What does opportunity cost describe?',
    options:[
      'The total expense of all available alternatives combined',
      'The value of the next best alternative given up when making a choice',
      'The financial profit from a successful investment',
      'The cost of borrowing money from a bank'
    ],
    correctIndex:1 },
  { id:'xrmcsa-3',
    passage:'Mangrove forests grow along tropical coastlines and are uniquely adapted to salty, waterlogged soils. Their tangled root systems stabilize shorelines by trapping sediment and reducing erosion, while also providing habitat for fish, birds, and crustaceans. Mangroves store large amounts of carbon, making them valuable allies in climate change mitigation. Despite their importance, mangrove forests are threatened by shrimp farming, coastal development, and pollution, leading to significant losses in many regions.',
    question:'Which of the following is a benefit of mangrove forests described in the passage?',
    options:[
      'They increase coastal erosion over time',
      'They release large amounts of carbon into the atmosphere',
      'They stabilize shorelines and store carbon',
      'They prevent all tropical storms from reaching land'
    ],
    correctIndex:2 }
]

};

PTE.mergeBankReading = function() {
  for (var type in PTE._bankReading) {
    if (!PTE.ReadingQuestions[type]) PTE.ReadingQuestions[type] = [];
    var existing = {};
    PTE.ReadingQuestions[type].forEach(function(q) { existing[q.id] = true; });
    PTE._bankReading[type].forEach(function(q) {
      if (!existing[q.id]) PTE.ReadingQuestions[type].push(q);
    });
  }
};
