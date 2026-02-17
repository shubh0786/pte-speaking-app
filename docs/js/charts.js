/**
 * PTE Speaking Module - Chart Generator
 * Creates SVG charts for Describe Image questions
 */

window.PTE = window.PTE || {};

PTE.Charts = {
  /**
   * Generate a chart based on question data
   */
  generate(question) {
    switch (question.chartType) {
      case 'bar': return this.barChart(question);
      case 'pie': return this.pieChart(question);
      case 'line': return this.lineChart(question);
      default: return '<div class="text-gray-500">Chart not available</div>';
    }
  },

  barChart(q) {
    const maxVal = Math.max(...q.data.map(d => d.value));
    const barWidth = Math.floor(400 / q.data.length) - 20;
    const chartHeight = 240;

    let bars = '';
    let labels = '';
    let values = '';

    q.data.forEach((d, i) => {
      const x = 60 + i * (barWidth + 20);
      const barH = (d.value / maxVal) * (chartHeight - 40);
      const y = chartHeight - barH;
      const color = d.color || `hsl(${i * 60}, 70%, 55%)`;

      bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" fill="${color}" rx="4" opacity="0.9">
        <animate attributeName="height" from="0" to="${barH}" dur="0.8s" fill="freeze"/>
        <animate attributeName="y" from="${chartHeight}" to="${y}" dur="0.8s" fill="freeze"/>
      </rect>`;
      labels += `<text x="${x + barWidth / 2}" y="${chartHeight + 20}" text-anchor="middle" font-size="11" fill="#64748b" font-family="system-ui">${d.label}</text>`;
      values += `<text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="11" font-weight="600" fill="#334155" font-family="system-ui">${d.value.toLocaleString()}</text>`;
    });

    // Y-axis grid lines
    let gridLines = '';
    for (let i = 0; i <= 4; i++) {
      const y = chartHeight - (i / 4) * (chartHeight - 40);
      const val = Math.round((i / 4) * maxVal);
      gridLines += `<line x1="50" y1="${y}" x2="${60 + q.data.length * (barWidth + 20)}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="4"/>`;
      gridLines += `<text x="45" y="${y + 4}" text-anchor="end" font-size="10" fill="#94a3b8" font-family="system-ui">${val.toLocaleString()}</text>`;
    }

    const width = 80 + q.data.length * (barWidth + 20);
    return `<svg viewBox="0 0 ${width} ${chartHeight + 50}" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-lg mx-auto">
      <text x="${width / 2}" y="18" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b" font-family="system-ui">${q.title}</text>
      <g transform="translate(0, 25)">
        ${gridLines}
        ${bars}
        ${values}
        ${labels}
      </g>
    </svg>`;
  },

  pieChart(q) {
    const total = q.data.reduce((s, d) => s + d.value, 0);
    const cx = 180, cy = 150, r = 110;
    let startAngle = -Math.PI / 2;
    let slices = '';
    let legends = '';

    q.data.forEach((d, i) => {
      const ratio = d.value / total;
      const endAngle = startAngle + ratio * 2 * Math.PI;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = ratio > 0.5 ? 1 : 0;
      const color = d.color || `hsl(${i * 72}, 65%, 55%)`;

      slices += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z" fill="${color}" stroke="white" stroke-width="2" opacity="0.9"/>`;

      // Label on slice
      const midAngle = startAngle + ratio * Math.PI;
      const labelR = r * 0.65;
      const lx = cx + labelR * Math.cos(midAngle);
      const ly = cy + labelR * Math.sin(midAngle);
      if (ratio > 0.05) {
        slices += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="600" fill="white" font-family="system-ui">${d.value}%</text>`;
      }

      // Legend
      const legY = 20 + i * 22;
      legends += `<rect x="370" y="${legY}" width="14" height="14" rx="3" fill="${color}"/>`;
      legends += `<text x="390" y="${legY + 12}" font-size="12" fill="#334155" font-family="system-ui">${d.label}</text>`;

      startAngle = endAngle;
    });

    return `<svg viewBox="0 0 500 310" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-lg mx-auto">
      <text x="250" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b" font-family="system-ui">${q.title}</text>
      <g transform="translate(0, 15)">
        ${slices}
        ${legends}
      </g>
    </svg>`;
  },

  lineChart(q) {
    const maxVal = Math.max(...q.data.map(d => d.value));
    const minVal = Math.min(...q.data.map(d => d.value));
    const range = maxVal - minVal || 1;
    const chartW = 440, chartH = 220;
    const padL = 60, padR = 20, padT = 40, padB = 40;
    const plotW = chartW - padL - padR;
    const plotH = chartH - padT - padB;

    let points = [];
    let circles = '';
    let labels = '';

    q.data.forEach((d, i) => {
      const x = padL + (i / (q.data.length - 1)) * plotW;
      const y = padT + plotH - ((d.value - minVal) / range) * plotH;
      points.push(`${x},${y}`);

      circles += `<circle cx="${x}" cy="${y}" r="5" fill="#6366f1" stroke="white" stroke-width="2"/>`;
      circles += `<text x="${x}" y="${y - 12}" text-anchor="middle" font-size="10" font-weight="600" fill="#334155" font-family="system-ui">${d.value}</text>`;
      labels += `<text x="${x}" y="${chartH - 5}" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui">${d.label}</text>`;
    });

    // Area fill
    const areaPath = `M${padL},${padT + plotH} L${points.join(' L')} L${padL + plotW},${padT + plotH} Z`;
    const linePath = `M${points.join(' L')}`;

    // Grid lines
    let grid = '';
    for (let i = 0; i <= 4; i++) {
      const y = padT + (i / 4) * plotH;
      const val = (maxVal - (i / 4) * range).toFixed(1);
      grid += `<line x1="${padL}" y1="${y}" x2="${padL + plotW}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="4"/>`;
      grid += `<text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="#94a3b8" font-family="system-ui">${val}</text>`;
    }

    return `<svg viewBox="0 0 ${chartW} ${chartH + 10}" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-lg mx-auto">
      <text x="${chartW / 2}" y="18" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b" font-family="system-ui">${q.title}</text>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6366f1" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#6366f1" stop-opacity="0.02"/>
        </linearGradient>
      </defs>
      ${grid}
      <path d="${areaPath}" fill="url(#areaGrad)"/>
      <path d="${linePath}" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${circles}
      ${labels}
    </svg>`;
  }
};
