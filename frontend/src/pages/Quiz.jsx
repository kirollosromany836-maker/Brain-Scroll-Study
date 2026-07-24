import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../StudyContext.jsx';
import { api } from '../api.js';

const PART_LABELS = {
  simple_math: 'Part 1 · Simple mathematics',
  simple_word: 'Part 2 · Simple word problems',
  complex_math: 'Part 3 · Complex mathematics',
  complex_word: 'Part 4 · Complex word problems',
};

export default function Quiz() {
  const navigate = useNavigate();
  const { participantId, setQuizResult } = useStudy();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const questionStartRef = useRef(null);
  const quizStartRef = useRef(null);

  useEffect(() => {
    if (!participantId) {
      navigate('/');
      return;
    }
    api
      .getQuestions()
      .then((data) => {
        setQuestions(data.questions);
        setLoading(false);
        quizStartRef.current = performance.now();
        questionStartRef.current = performance.now();
      })
      .catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!participantId) return null;
  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <p>Loading assessment…</p>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const total = questions.length;

  async function handleNext() {
    if (selected === null) return;
    const timeSeconds = (performance.now() - questionStartRef.current) / 1000;
    const nextResponses = [
      ...responses,
      { questionId: q.id, answer: selected, timeSeconds },
    ];
    setResponses(nextResponses);
    setSelected(null);

    if (current + 1 < total) {
      setCurrent(current + 1);
      questionStartRef.current = performance.now();
    } else {
      setSubmitting(true);
      const totalTimeSeconds = (performance.now() - quizStartRef.current) / 1000;
      try {
        const result = await api.submitQuiz(participantId, {
          responses: nextResponses,
          totalTimeSeconds,
        });
        setQuizResult(result);
        navigate('/results');
      } catch (err) {
        setSubmitting(false);
        alert(`There was a problem submitting your assessment: ${err.message}`);
      }
    }
  }

  const showPartHeader = current === 0 || questions[current - 1].part !== q.part;

  return (
    <div className="page">
      <div className="container">
        <span className="eyebrow">Problem-solving assessment</span>
        <div className="quiz-progress">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`dot ${i < current ? 'done' : i === current ? 'active' : ''}`}
            />
          ))}
        </div>

        {showPartHeader && (
          <h3 style={{ fontSize: '14px', color: 'var(--ink-soft)', marginBottom: 8 }}>
            {PART_LABELS[q.part]}
          </h3>
        )}

        <div className="card">
          <h2 style={{ fontSize: '20px' }}>{q.prompt}</h2>
          <div style={{ marginTop: 18 }}>
            {q.choices.map((choice) => (
              <button
                key={choice}
                className={`choice-btn ${selected === choice ? 'selected' : ''}`}
                onClick={() => setSelected(choice)}
                type="button"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary btn-block"
          disabled={selected === null || submitting}
          onClick={handleNext}
        >
          {submitting ? 'Submitting…' : current + 1 < total ? 'Next question' : 'Finish assessment'}
        </button>
        <p className="footer-note">
          Question {current + 1} of {total}
        </p>
      </div>
    </div>
  );
}
