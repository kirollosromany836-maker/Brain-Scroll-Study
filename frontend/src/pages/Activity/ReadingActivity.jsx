import React from 'react';
import CountdownTimer from '../../components/CountdownTimer.jsx';

// Original, non-copyrighted placeholder article written for this study.
const ARTICLE_TITLE = 'The Quiet Engineering Behind Coral Reefs';

const ARTICLE_PARAGRAPHS = [
  'Coral reefs cover less than one percent of the ocean floor, yet they support roughly a quarter of all known marine species. That density is not an accident of nature so much as the outcome of a slow, cooperative construction project that has been running for millions of years.',
  'A coral reef is built by tiny animals called polyps, each barely larger than a grain of rice. A single polyp secretes a cup of calcium carbonate around its soft body for protection. Multiply that by billions of polyps working over centuries, and the result is a limestone structure large enough to be seen from space, like the Great Barrier Reef stretching over 2,300 kilometers along Australia\'s coast.',
  'What makes this possible is a partnership, not a solo effort. Each polyp hosts microscopic algae called zooxanthellae inside its own tissue. The algae photosynthesize, converting sunlight into sugars, and share up to ninety percent of that food with their coral host. In exchange, the coral provides the algae a safe, sunlit home and a steady supply of carbon dioxide. Neither organism could build a reef alone; the structure exists because of the exchange between them.',
  'This relationship is also the reef\'s greatest vulnerability. When ocean temperatures rise even slightly above normal, the stressed coral expels its algae, a process known as bleaching. Without its algal partner, the coral loses its main food source and its color, turning ghostly white. A bleached reef is not dead, but it is starving, and prolonged stress can cause large sections to die off entirely.',
  'Reef architecture also shapes life far beyond the reef itself. The three-dimensional maze of branching and plate corals creates shelter for small fish, which in turn attract larger predators, which in turn support the fishing economies of coastal communities. Remove the physical structure, and that entire chain of shelter collapses along with it.',
  'Scientists studying reef resilience have found that genetic diversity among coral colonies matters as much as water temperature. Reefs with a wider variety of coral genotypes tend to have a better chance that at least some colonies carry heat-tolerant traits, allowing partial recovery after a bleaching event. This has led some conservation projects to focus on preserving genetically diverse coral nurseries rather than simply replanting a single hardy species.',
  'In that sense, a coral reef behaves less like a single organism and more like a very old, very patient piece of civil engineering: built collaboratively, maintained continuously, and only as strong as the diversity of the partnerships holding it together.',
];

export default function ReadingActivity({ duration, onComplete }) {
  return (
    <div className="page">
      <div className="container">
        <span className="eyebrow">Activity — Group 2</span>
        <h1 style={{ fontSize: '22px' }}>Reading activity</h1>
        <p>Read at a comfortable pace. The article will remain available for the full 10 minutes.</p>

        <div style={{ position: 'sticky', top: 8, zIndex: 5, display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div className="card" style={{ margin: 0, padding: '8px 18px' }}>
            <CountdownTimer durationSeconds={duration} label="Time remaining" onComplete={onComplete} />
          </div>
        </div>

        <div className="card" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '22px' }}>{ARTICLE_TITLE}</h2>
          <div className="article-body">
            {ARTICLE_PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
