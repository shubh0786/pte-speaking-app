/**
 * Crack PTE - Templates Library
 * Copy-paste speaking templates for every question type
 */
window.PTE = window.PTE || {};

PTE.Templates = {
  DATA: [
    { type:'read-aloud', icon:'📖', title:'Read Aloud - Pacing Guide', templates:[
      { name:'Standard Pacing', text:'Read at 2-3 words per second. Pause briefly at commas (0.3s). Pause longer at full stops (0.5s). Stress content words (nouns, verbs, adjectives). Say function words (the, a, of, in) quickly and softly.', tip:'Practice by marking pauses in the text with / for short pause and // for long pause before you start recording.' },
      { name:'Difficult Word Strategy', text:'During preparation time, identify any difficult words. Practice saying them silently. If you stumble during recording, do NOT go back. Keep moving forward. A small mispronunciation costs less than a restart.', tip:'Speed over perfection — fluency is weighted more heavily than individual word pronunciation.' }
    ]},
    { type:'repeat-sentence', icon:'🔁', title:'Repeat Sentence - Method 258', templates:[
      { name:'APEUni Method 258', text:'Remember: First 2 words + Middle 5 words + Last 8 sounds. As soon as audio ends, speak immediately. Even partial repetition scores points. Do NOT stay silent.', tip:'Focus on the sentence structure (subject-verb-object) rather than memorizing every word.' },
      { name:'Chunking Strategy', text:'Listen for meaningful chunks: [Subject phrase] + [Verb phrase] + [Object/detail phrase]. Repeat each chunk in order. Example: "The university library / will be closed / for renovations next semester."', tip:'Understanding the meaning helps recall. Visualize the scene while listening.' }
    ]},
    { type:'describe-image', icon:'📊', title:'Describe Image - Templates', templates:[
      { name:'Bar Chart Template', text:'This bar chart illustrates [TOPIC]. Looking at the data, [HIGHEST ITEM] has the highest value at approximately [NUMBER], while [LOWEST ITEM] has the lowest value at around [NUMBER]. [SECOND ITEM] comes in second place with [NUMBER]. Overall, there is a significant difference between the highest and lowest values.', tip:'Always mention: chart type, topic, highest, lowest, and one comparison.' },
      { name:'Pie Chart Template', text:'This pie chart shows the distribution of [TOPIC]. The largest proportion belongs to [CATEGORY] at [X] percent. [SECOND CATEGORY] accounts for [X] percent, making it the second largest segment. The remaining categories include [LIST]. In summary, [LARGEST] dominates the chart.', tip:'Focus on the top 2-3 segments and their percentages.' },
      { name:'Line Graph Template', text:'This line graph depicts [TOPIC] from [START YEAR] to [END YEAR]. The data shows an overall [upward/downward] trend. Starting at [VALUE] in [YEAR], the value [rose/fell] to [VALUE] by [YEAR]. The most notable change occurred between [PERIOD]. In conclusion, there has been a [steady increase/decline] over the period shown.', tip:'Mention the overall trend, starting point, ending point, and any sharp changes.' },
      { name:'Process/Map Template', text:'This image illustrates [the process of / the layout of] [TOPIC]. The process begins with [FIRST STEP], which leads to [SECOND STEP]. Following that, [THIRD STEP] occurs. Finally, the process concludes with [LAST STEP]. Overall, this is a [simple/complex] [NUMBER]-stage process.', tip:'Use sequence words: first, then, next, after that, finally.' }
    ]},
    { type:'retell-lecture', icon:'🎓', title:'Re-tell Lecture - Template', templates:[
      { name:'4-Part Structure', text:'The speaker discussed [TOPIC]. The main point was that [KEY IDEA]. Furthermore, the speaker mentioned that [DETAIL 1]. Additionally, it was noted that [DETAIL 2]. In conclusion, the speaker emphasized that [SUMMARY].', tip:'Aim for: 5s opening + 10s point 1 + 10s point 2 + 5s conclusion = 30s minimum.' },
      { name:'Note-Taking Format', text:'While listening, write 5-7 key phrases using abbreviations:\n- Topic: ___\n- Point 1: ___\n- Point 2: ___\n- Example: ___\n- Conclusion: ___\nUse symbols: → (leads to), ↑ (increase), ↓ (decrease), = (equals), ≠ (different)', tip:'Write phrases not sentences. Use the 10s prep time to organize your notes into the template order.' }
    ]},
    { type:'answer-short-question', icon:'❓', title:'Answer Short Question - Tips', templates:[
      { name:'Quick Response Strategy', text:'1. Listen for the KEY WORD in the question (what, who, where, how many)\n2. Answer within 1-3 seconds\n3. Use 1-2 words ONLY — never explain\n4. If unsure, give your best guess — silence = zero\n5. Common categories: professions, science, geography, daily objects, body parts, animals', tip:'Build a mental flashcard deck of common Q&A pairs. Practice the Vocabulary Builder daily.' }
    ]},
    { type:'summarize-group-discussion', icon:'👥', title:'Summarize Group Discussion', templates:[
      { name:'Speaker Attribution Template', text:'The group discussed [TOPIC]. Speaker A argued that [POINT]. Speaker B responded by saying that [POINT]. Speaker C suggested that [COMPROMISE/ALTERNATIVE]. Overall, while there were differing viewpoints, the speakers [agreed on / acknowledged] [COMMON GROUND].', tip:'Use reporting verbs: argued, responded, suggested, pointed out, agreed, disagreed, emphasized, concluded.' },
      { name:'Agreement/Disagreement Template', text:'The discussion centered on [TOPIC]. The speakers had [similar/different] views. [NAME] believed that [X], whereas [NAME] argued that [Y]. A compromise was suggested by [NAME], who proposed [Z]. In conclusion, the group recognized the need for [BALANCED APPROACH].', tip:'Note each speaker\'s main point and whether they agree or disagree with others.' }
    ]},
    { type:'respond-to-situation', icon:'💬', title:'Respond to a Situation', templates:[
      { name:'STAR Response Framework', text:'[SITUATION] — Acknowledge the scenario: "I understand that..."\n[TASK] — State your role: "As a [student/employee], I need to..."\n[ACTION] — Explain what you\'ll do: "I would like to suggest that..."\n[RESULT] — Expected outcome: "This would help us to..."', tip:'Match the tone to the relationship: formal for professors/managers, polite but firm for complaints, friendly for peers.' },
      { name:'Polite Request Template', text:'Thank you for [context]. I wanted to discuss [ISSUE]. I understand [THEIR PERSPECTIVE], and I appreciate [POSITIVE ASPECT]. However, I would like to suggest [YOUR PROPOSAL]. I believe this would [BENEFIT]. Would that be acceptable to you?', tip:'Always: acknowledge, empathize, propose, benefit. Never be confrontational.' }
    ]}
  ],

  renderPage() {
    const sections = this.DATA.map(section => {
      const cards = section.templates.map(t => {
        const escaped = t.text.replace(/'/g, "\\'").replace(/\n/g, '\\n');
        return `
        <div class="card rounded-xl p-5 mb-3">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold text-zinc-100 text-sm">${t.name}</h4>
            <div class="flex gap-2">
              <button onclick="PTE.TTS.speak(\`${t.text.replace(/`/g,"'").replace(/\n/g,' ')}\`, 0.9)" class="text-xs text-[var(--accent-light)] hover:text-[var(--accent)] px-2 py-1 rounded bg-[var(--accent-surface)] transition-colors" title="Listen">🔊 Listen</button>
              <button onclick="navigator.clipboard.writeText(\`${t.text.replace(/`/g,"'").replace(/\n/g,'\\n')}\`).then(()=>this.textContent='Copied!')" class="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-cyan-500/10 transition-colors" title="Copy">📋 Copy</button>
            </div>
          </div>
          <div class="bg-white/[0.02] rounded-lg p-4 mb-3 border border-[var(--border)]">
            <p class="text-sm text-zinc-300 whitespace-pre-line leading-relaxed">${t.text}</p>
          </div>
          <div class="flex items-start gap-2 text-xs text-amber-400/80">
            <span class="mt-0.5">💡</span>
            <p>${t.tip}</p>
          </div>
        </div>`;
      }).join('');

      return `
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-2xl">${section.icon}</span>
          <h2 class="text-xl font-semibold text-zinc-100">${section.title}</h2>
        </div>
        ${cards}
      </div>`;
    }).join('');

    return `
    ${PTE.UI.navbar('templates')}
    <main class="min-h-screen py-10 px-4">
      <div class="max-w-3xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-semibold text-zinc-100 mb-2">Templates Library</h1>
          <p class="text-zinc-500">Proven response templates for every PTE Speaking question type. Listen, copy, and practice.</p>
        </div>
        ${sections}
      </div>
    </main>`;
  }
};
