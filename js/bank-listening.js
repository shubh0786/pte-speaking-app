/**
 * PTE Listening - EXPANDED Question Bank
 * Extra questions for all 8 listening types
 * Auto-merges into PTE.ListeningQuestions on load
 */
window.PTE = window.PTE || {};
window.PTE._bankListening = {

'sst': [
  { id:'xsst-1',
    audioText:'The lecture explores how urban green spaces influence mental health. Longitudinal surveys across several cities indicate that residents living near parks report fewer symptoms of anxiety and depression. The speaker attributes this partly to opportunities for exercise and social contact, and partly to reductions in air and noise pollution. Budget constraints in lower-income districts, however, limit equitable access to these benefits.',
    keywords:['urban','green','spaces','mental','health','parks','anxiety','depression','exercise','social','pollution','budget','access'] },
  { id:'xsst-2',
    audioText:'This talk reviews the rise of autonomous vehicles and the regulatory challenges they pose. Proponents highlight potential gains in safety and traffic efficiency, while critics question the reliability of sensor systems in poor weather. The speaker stresses that clear liability frameworks and standardized testing protocols will be essential before widespread deployment is socially accepted.',
    keywords:['autonomous','vehicles','regulatory','safety','traffic','sensors','weather','liability','testing','deployment','accepted'] },
  { id:'xsst-3',
    audioText:'The seminar examines how drought affects agricultural supply chains. Reduced crop yields raise food prices and strain farm incomes, while overuse of groundwater reserves depletes aquifers faster than they can recharge. The speaker recommends diversified crops, improved irrigation efficiency, and better early-warning systems to reduce vulnerability.',
    keywords:['drought','agricultural','supply','chains','crop','yields','prices','groundwater','aquifers','irrigation','warning','vulnerability'] },
  { id:'xsst-4',
    audioText:'The recording discusses the psychology of habit formation. Repeated behaviors in consistent contexts become automatic through cue-routine-reward loops, which reduces the cognitive effort needed for daily tasks. Changing established habits, the speaker notes, is difficult because old cues can retrigger routines even after long interruptions.',
    keywords:['psychology','habit','formation','repeated','contexts','automatic','cue','routine','reward','cognitive','cues','changing'] }
],

'l-mcma': [
  { id:'xlmcma-1',
    audioText:'The presenter surveys evidence on remote work after large-scale adoption. Productivity remained stable or rose for knowledge workers, though onboarding new employees proved harder without in-person mentoring. Workers reported better focus but also feelings of isolation, and collaboration on complex creative problems sometimes suffered. Companies are settling on hybrid arrangements that blend office and home time.',
    question:'According to the recording, which statements are correct?',
    options:[
      { text:'Remote work reduced productivity for all knowledge workers.', correct:false },
      { text:'Onboarding new staff was more difficult remotely.', correct:true },
      { text:'Some workers felt isolated despite improved focus.', correct:true },
      { text:'Complex creative collaboration was unaffected by remote work.', correct:false },
      { text:'Many companies are adopting hybrid models.', correct:true }
    ] },
  { id:'xlmcma-2',
    audioText:'The lecture evaluates the promise and limitations of vertical farming. Stacked indoor systems use less land and fewer pesticides and can operate year-round near cities. However, the energy required for artificial lighting and climate control is substantial, and capital costs are high. The speaker concludes that vertical farming is most viable for leafy greens rather than staple grains.',
    question:'Which ideas does the speaker support?',
    options:[
      { text:'Vertical farms use less land than conventional farms.', correct:true },
      { text:'Vertical farming has no significant energy costs.', correct:false },
      { text:'Vertical farms can operate year-round.', correct:true },
      { text:'Vertical farming is best suited to staple grains.', correct:false },
      { text:'High capital costs are a noted limitation.', correct:true }
    ] }
],

'l-fib': [
  { id:'xlfib-1',
    audioText:'The lecture explains that supply and demand determine the equilibrium price in competitive markets, where surpluses push prices down and shortages drive them upward.',
    transcript:'The lecture explains that supply and demand determine the ___ price in competitive markets, where surpluses push prices ___ and shortages drive them ___.',
    answers:['equilibrium','down','upward'] },
  { id:'xlfib-2',
    audioText:'The researcher notes that coral reefs protect coastlines from storm damage by absorbing wave energy, yet rising ocean temperatures cause bleaching that weakens the reef structure.',
    transcript:'The researcher notes that coral reefs protect coastlines from storm damage by absorbing wave ___, yet rising ocean temperatures cause ___ that weakens the reef ___.',
    answers:['energy','bleaching','structure'] },
  { id:'xlfib-3',
    audioText:'The seminar describes how glaciers store freshwater as compacted snow and release it gradually during warmer months, sustaining rivers that downstream communities rely on.',
    transcript:'The seminar describes how glaciers store freshwater as compacted ___ and release it gradually during warmer months, sustaining ___ that downstream communities rely ___.',
    answers:['snow','rivers','on'] },
  { id:'xlfib-4',
    audioText:'The speaker argues that open-access publishing accelerates the spread of findings but raises concerns about how peer review and publication costs can be sustained fairly.',
    transcript:'The speaker argues that open-access publishing accelerates the spread of ___ but raises concerns about how peer review and publication ___ can be sustained ___.',
    answers:['findings','costs','fairly'] }
],

'l-hcs': [
  { id:'xlhcs-1',
    audioText:'The briefing contrasts two approaches to conservation: protected areas that restrict human activity, and community-based programs that involve local people in managing resources. The speaker notes that enforcement of protected areas is often weak, whereas community programs can build lasting support when benefits are shared transparently.',
    summaries:[
      { text:'Conservation can combine protected areas with community programs, and local involvement tends to build durable support when benefits are shared.', correct:true },
      { text:'The lecture argues that all conservation must exclude local communities entirely.', correct:false },
      { text:'The main topic is the history of urban public transport.', correct:false },
      { text:'The speaker claims protected areas are always perfectly enforced.', correct:false }
    ] },
  { id:'xlhcs-2',
    audioText:'The talk reviews how search engines rank results using signals such as relevance, authority, and freshness. The speaker warns that personalized results can create filter bubbles, where users see less diverse information, and recommends occasional comparison across sources to counter this effect.',
    summaries:[
      { text:'Search ranking relies on several signals, and personalization can narrow the information users see, so comparing sources is advisable.', correct:true },
      { text:'The recording states that search engines ignore relevance entirely.', correct:false },
      { text:'The central focus is on the chemistry of food preservatives.', correct:false },
      { text:'The speaker argues filter bubbles do not exist.', correct:false }
    ] }
],

'l-mcsa': [
  { id:'xlmcsa-1',
    audioText:'The speaker explains that inflation erodes purchasing power when prices rise faster than wages, forcing households to spend more on the same goods and services.',
    question:'What does the speaker say about inflation?',
    options:[
      'It increases household purchasing power when wages rise faster than prices',
      'It reduces purchasing power when prices rise faster than wages',
      'It has no effect on household spending',
      'It only affects imported luxury goods'
    ],
    correctIndex:1 },
  { id:'xlmcsa-2',
    audioText:'The recording notes that mangrove forests protect coastlines by trapping sediment and absorbing wave energy, which reduces erosion and storm damage.',
    question:'How do mangrove forests protect coastlines, according to the recording?',
    options:[
      'By increasing wave energy and accelerating erosion',
      'By trapping sediment and absorbing wave energy',
      'By releasing sediment into deeper waters',
      'By preventing all rainfall near the shore'
    ],
    correctIndex:1 }
],

'l-smw': [
  { id:'xlsmw-1',
    audioText:'The professor notes that demand for clean energy is driving rapid investment in battery storage technologies worldwide.',
    audioPlayText:'The professor notes that demand for clean energy is driving rapid investment in battery storage technologies',
    options:['worldwide','declining','irrelevant','abroad'],
    correctIndex:0 },
  { id:'xlsmw-2',
    audioText:'The lecturer concludes that regular physical activity strengthens the cardiovascular system and improves overall longevity.',
    audioPlayText:'The lecturer concludes that regular physical activity strengthens the cardiovascular system and improves overall',
    options:['longevity','weather','currency','anxiety'],
    correctIndex:0 },
  { id:'xlsmw-3',
    audioText:'The speaker argues that transparent data sharing strengthens the reliability of published scientific findings.',
    audioPlayText:'The speaker argues that transparent data sharing strengthens the reliability of published scientific',
    options:['findings','weather','harvests','voyages'],
    correctIndex:0 },
  { id:'xlsmw-4',
    audioText:'The seminar emphasizes that early childhood nutrition shapes cognitive development and lifelong health outcomes.',
    audioPlayText:'The seminar emphasizes that early childhood nutrition shapes cognitive development and lifelong health',
    options:['outcomes','weather','manuscripts','textiles'],
    correctIndex:0 }
],

'l-hiw': [
  { id:'xlhiw-1',
    audioText:'The researcher found that moderate coffee consumption was associated with a lower risk of certain diseases.',
    displayText:'The researcher found that excessive coffee consumption was associated with a lower risk of certain diseases.',
    incorrectIndices:[7] },
  { id:'xlhiw-2',
    audioText:'Regular exercise strengthens the heart and improves circulation throughout the body.',
    displayText:'Regular exercise weakens the heart and improves circulation throughout the body.',
    incorrectIndices:[4] },
  { id:'xlhiw-3',
    audioText:'The committee approved the proposal after reviewing the preliminary budget estimates.',
    displayText:'The committee rejected the proposal after reviewing the preliminary budget estimates.',
    incorrectIndices:[3] },
  { id:'xlhiw-4',
    audioText:'The survey showed that students who slept adequately performed better on memory tasks.',
    displayText:'The survey showed that students who slept adequately performed worse on memory tasks.',
    incorrectIndices:[11] }
],

'l-wfd': [
  { id:'xlwfd-1', audioText:'The committee will announce the results of the review next Friday afternoon.' },
  { id:'xlwfd-2', audioText:'Students are encouraged to participate in weekly discussion sessions throughout the semester.' },
  { id:'xlwfd-3', audioText:'The new policy aims to reduce carbon emissions across all major industrial sectors.' },
  { id:'xlwfd-4', audioText:'Researchers have discovered a promising compound that could slow the progression of the disease.' },
  { id:'xlwfd-5', audioText:'The museum exhibition features artifacts from several ancient civilizations around the Mediterranean.' },
  { id:'xlwfd-6', audioText:'Effective communication requires clarity, patience, and a willingness to listen carefully.' }
]

};

PTE.mergeBankListening = function() {
  for (var type in PTE._bankListening) {
    if (!PTE.ListeningQuestions[type]) PTE.ListeningQuestions[type] = [];
    var existing = {};
    PTE.ListeningQuestions[type].forEach(function(q) { existing[q.id] = true; });
    PTE._bankListening[type].forEach(function(q) {
      if (!existing[q.id]) PTE.ListeningQuestions[type].push(q);
    });
  }
};
