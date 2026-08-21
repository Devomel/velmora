'use client';

import { useState } from 'react';
import type { Review } from '@/lib/reviews';

type ReviewsT = {
  average: string;
  basedOn: string;
  newReviewTitle: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  rateLabel: string;
  submit: string;
  success: string;
  reply: string;
};

function Avatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-[#E8DDD4] flex items-center justify-center flex-shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="#9C8A7E">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 22a8 8 0 0116 0z" />
      </svg>
    </div>
  );
}

function StaticStars({ rating, size = 14 }: { rating: number; size?: number }) {
  const uid = `rv${Math.round(rating * 10)}`;
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)));
        const partial = fill > 0 && fill < 1;
        const clipId = `cp-${uid}-${i}`;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24">
            {partial && (
              <defs>
                <clipPath id={clipId}>
                  <rect x="0" y="0" width={24 * fill} height="24" />
                </clipPath>
              </defs>
            )}
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#E8DDD4" />
            {fill > 0 && (
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill="#C8A86B"
                clipPath={partial ? `url(#${clipId})` : undefined}
              />
            )}
          </svg>
        );
      })}
    </span>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <span className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${i} star`}
          className="p-0.5"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={i <= shown ? '#C8A86B' : '#E8DDD4'}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </span>
  );
}

function ReplyBox({ t }: { t: ReviewsT }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [text, setText] = useState('');

  if (sent) {
    return <p className="text-xs text-[#6B8F71] mt-2">{t.success}</p>;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[#7D6C5E] hover:text-[#C4704F] transition-colors mt-2"
      >
        {t.reply}
      </button>
    );
  }

  return (
    <form
      onSubmit={e => { e.preventDefault(); if (text.trim()) setSent(true); }}
      className="mt-3 flex flex-col gap-2"
    >
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={2}
        required
        className="w-full border border-[#E8DDD4] px-3 py-2 text-sm focus:border-[#C4704F] outline-none bg-white resize-none"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-[#C4704F] hover:bg-[#A85A3A] text-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          {t.submit}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-[#7D6C5E] hover:text-[#5A4A3D] transition-colors"
        >
          ×
        </button>
      </div>
    </form>
  );
}

function ReviewRow({ review, t }: { review: Review; t: ReviewsT }) {
  return (
    <div className="flex gap-3 py-5 border-b border-[#E8DDD4] last:border-0">
      <Avatar />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
          <span className="text-sm font-semibold text-[#1A1410]">{review.author}</span>
          <span className="text-xs text-[#7D6C5E]">{review.date}</span>
          <StaticStars rating={review.rating} />
        </div>
        <p className="text-sm text-[#5A4A3D] leading-relaxed">{review.text}</p>
        <ReplyBox t={t} />
      </div>
    </div>
  );
}

export default function ReviewsSection({ reviews, avgRating, t }: { reviews: Review[]; avgRating: number; t: ReviewsT }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message || !rating) return;
    setSubmitted(true);
  }

  return (
    <div>
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 mb-2 p-5 bg-white border border-[#E8DDD4] shadow-sm w-fit">
          <span className="text-4xl font-light text-[#1A1410]">{avgRating.toFixed(1)}</span>
          <div>
            <StaticStars rating={avgRating} size={20} />
            <p className="text-xs text-[#7D6C5E] mt-1">
              {t.average} · {t.basedOn.replace('{count}', String(reviews.length))}
            </p>
          </div>
        </div>
      )}

      <div>
        {reviews.map((review, i) => (
          <ReviewRow key={i} review={review} t={t} />
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-[#E8DDD4]">
        <h4 className="text-lg font-semibold text-[#1A1410] mb-4">{t.newReviewTitle}</h4>

        {submitted ? (
          <div className="bg-[#6B8F71]/10 border border-[#6B8F71]/30 p-6 flex items-center gap-3 text-sm text-[#1A1410]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2" className="flex-shrink-0">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t.success}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                required
                className="flex-1 border border-[#E8DDD4] px-4 py-3 text-sm focus:border-[#C4704F] outline-none bg-white"
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              required
              className="w-full border border-[#E8DDD4] px-4 py-3 text-sm focus:border-[#C4704F] outline-none bg-white"
            />
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={t.messagePlaceholder}
              rows={4}
              required
              className="w-full border border-[#E8DDD4] px-4 py-3 text-sm focus:border-[#C4704F] outline-none bg-white resize-none"
            />
            <div className="flex items-center gap-3 pt-1">
              <span className="text-sm text-[#5A4A3D]">{t.rateLabel}</span>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <button
              type="submit"
              className="bg-[#6B8F71] hover:bg-[#5c7d62] text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-colors"
            >
              {t.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
