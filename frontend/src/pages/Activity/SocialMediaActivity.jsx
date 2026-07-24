import React from 'react';
import CountdownTimer from '../../components/CountdownTimer.jsx';

/**
 * Simulated short-form video feed. All content is placeholder — generic
 * gradient "clips" with invented captions/usernames — so nothing here is
 * pulled from or represents a real platform or copyrighted media. The goal
 * is only to reproduce the *interaction pattern* (vertical snap-scrolling,
 * like/comment/share affordances) that the study is measuring the effect of.
 */
const CLIPS = [
  { user: '@kitchen.quick', caption: 'One-pan pasta in under 10 minutes 🍝', gradient: 'linear-gradient(160deg,#ff9a76,#c94b4b)', likes: '128K' },
  { user: '@dailymotivate', caption: 'Small habits, big changes. Day 47.', gradient: 'linear-gradient(160deg,#4facfe,#00f2fe)', likes: '54K' },
  { user: '@petclips', caption: 'He was NOT expecting that 😂🐶', gradient: 'linear-gradient(160deg,#f7971e,#ffd200)', likes: '892K' },
  { user: '@travel.moments', caption: 'POV: sunrise at 4,200m', gradient: 'linear-gradient(160deg,#43cea2,#185a9d)', likes: '210K' },
  { user: '@quickfacts', caption: "Did you know octopuses have 3 hearts?", gradient: 'linear-gradient(160deg,#8E2DE2,#4A00E0)', likes: '76K' },
  { user: '@fitnessreset', caption: '10-minute desk stretch routine', gradient: 'linear-gradient(160deg,#f857a6,#ff5858)', likes: '39K' },
  { user: '@dance.trend', caption: 'New trend just dropped 💃', gradient: 'linear-gradient(160deg,#3EECAC,#EE74E1)', likes: '1.1M' },
  { user: '@lifehacks101', caption: 'Fold your laundry in half the time', gradient: 'linear-gradient(160deg,#f2994a,#f2c94c)', likes: '61K' },
  { user: '@comedyclip', caption: 'when the wifi finally works', gradient: 'linear-gradient(160deg,#5f2c82,#49a09d)', likes: '340K' },
  { user: '@bookish', caption: 'books that will ruin your sleep schedule 📚', gradient: 'linear-gradient(160deg,#e55d87,#5fc3e4)', likes: '48K' },
  { user: '@artdaily', caption: 'painting a galaxy in 60 seconds', gradient: 'linear-gradient(160deg,#2C3E50,#141E30)', likes: '95K' },
  { user: '@carspot', caption: 'this sound though 🔊', gradient: 'linear-gradient(160deg,#232526,#414345)', likes: '203K' },
  { user: '@cozycorner', caption: 'rainy day study setup ☔', gradient: 'linear-gradient(160deg,#3a7bd5,#3a6073)', likes: '27K' },
  { user: '@microscience', caption: 'why the sky looks purple at dusk', gradient: 'linear-gradient(160deg,#7F00FF,#E100FF)', likes: '112K' },
  { user: '@streetfood', caption: 'best night market find this year', gradient: 'linear-gradient(160deg,#f857a6,#ff5858)', likes: '188K' },
];

export default function SocialMediaActivity({ duration, onComplete }) {
  return (
    <div className="page">
      <div className="container">
        <span className="eyebrow">Activity — Group 1</span>
        <h1 style={{ fontSize: '22px' }}>Short-form video simulation</h1>
        <p>Scroll however feels natural. This continues for 10 minutes.</p>

        <div style={{ position: 'sticky', top: 8, zIndex: 5, display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div className="card" style={{ margin: 0, padding: '8px 18px' }}>
            <CountdownTimer durationSeconds={duration} label="Time remaining" onComplete={onComplete} />
          </div>
        </div>

        <div className="scroll-feed" style={{ height: '70vh', maxHeight: 640 }}>
          {CLIPS.map((clip, i) => (
            <div key={i} className="scroll-card" style={{ background: clip.gradient }}>
              <div className="gradient" />
              <div className="meta">
                <div className="username">{clip.user}</div>
                <div className="caption">{clip.caption}</div>
              </div>
              <div className="actions">
                <div><div className="icon">❤️</div>{clip.likes}</div>
                <div><div className="icon">💬</div>{Math.floor(Math.random() * 900) + 20}</div>
                <div><div className="icon">↗️</div>Share</div>
              </div>
            </div>
          ))}
          <div className="scroll-card" style={{ background: '#111', justifyContent: 'center', textAlign: 'center' }}>
            <div className="meta" style={{ width: '100%' }}>
              <p style={{ color: '#aaa' }}>You've reached the end of the simulated feed — keep scrolling back up if you like, until the timer finishes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
