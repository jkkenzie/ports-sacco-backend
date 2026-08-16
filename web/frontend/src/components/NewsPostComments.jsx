import React, { useRef, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { formSubmitErrorMessage } from '../api/postJsonWithNonce';
import { submitNewsComment } from '../api/news';
import { useFormNonce } from '../hooks/useFormNonce';
import { getTurnstileToken } from '../utils/turnstile';

export function NewsPostComments({ slug, commentsOpen = true, initialComments = [] }) {
  const formRef = useRef(null);
  const { nonceRef, ensureNonce } = useFormNonce();
  const [comments, setComments] = useState(Array.isArray(initialComments) ? initialComments : []);
  const [form, setForm] = useState({ name: '', email: '', comment: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'idle', message: '' });

    if (!commentsOpen) {
      setStatus({ state: 'error', message: 'Comments are closed for this article.' });
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim();
    const comment = form.comment.trim();

    if (!name) {
      setStatus({ state: 'error', message: 'Please enter your name.' });
      return;
    }
    if (!email) {
      setStatus({ state: 'error', message: 'Please enter your email address.' });
      return;
    }
    if (!comment) {
      setStatus({ state: 'error', message: 'Please enter your comment.' });
      return;
    }

    const gotchaField = formRef.current?.elements?.namedItem('_gotcha');
    const gotcha = typeof gotchaField?.value === 'string' ? gotchaField.value.trim() : '';

    setStatus({ state: 'sending', message: '' });

    try {
      const nonce = (await ensureNonce({ force: true })) || nonceRef.current;
      if (!nonce) {
        setStatus({
          state: 'error',
          message: 'Unable to verify the form. Please refresh the page and try again.',
        });
        return;
      }

      const turnstileToken = await getTurnstileToken({ action: 'news_comment' });
      const data = await submitNewsComment(
        slug,
        {
          name,
          email,
          comment,
          _gotcha: gotcha,
          _wpnonce: nonce,
          ...(turnstileToken ? { turnstileToken } : {}),
        },
        nonce
      );

      if (data?.ok) {
        setStatus({
          state: 'success',
          message:
            data.message ||
            (data.pending
              ? 'Thank you. Your comment is awaiting moderation.'
              : 'Thank you. Your comment has been published.'),
        });
        setForm({ name: '', email: '', comment: '' });
        if (!data.pending && data.comment) {
          setComments((prev) => [...prev, data.comment]);
        }
        return;
      }

      setStatus({
        state: 'error',
        message: data?.message || 'Could not submit your comment. Please try again.',
      });
    } catch (err) {
      setStatus({
        state: 'error',
        message: formSubmitErrorMessage(err, 'Could not submit your comment. Please try again.'),
      });
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-[#e2e8f0] bg-white p-5 sm:p-6" aria-label="Comments">
      <div className="mb-6 flex items-center gap-2 text-[#1e293b]">
        <MessageCircle className="size-5 text-[#22acb6]" aria-hidden />
        <h2 className="text-lg font-bold" style={{ fontFamily: 'Museo, Helvetica, sans-serif' }}>
          Comments
          <span className="ml-2 text-base font-semibold text-[#64748b]">({comments.length})</span>
        </h2>
      </div>

      {comments.length > 0 ? (
        <ul className="mb-8 space-y-5">
          {comments.map((item) => (
            <li key={item.id} className="border-b border-[#eef2f7] pb-5 last:border-b-0 last:pb-0">
              <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold text-[#1e293b]">{item.author}</span>
                {item.date ? <span className="text-sm text-[#94a3b8]">{item.date}</span> : null}
              </div>
              <div
                className="text-[#3b4e6b] leading-relaxed prose-news-comment"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-8 text-sm text-[#64748b]">No comments yet. Be the first to share your thoughts.</p>
      )}

      {commentsOpen ? (
        <form ref={formRef} onSubmit={handleSubmit} className="relative space-y-4" noValidate>
          <p className="text-sm text-[#64748b]">
            Comments are moderated. Your comment will appear after admin approval.
          </p>

          <input
            type="text"
            name="_gotcha"
            defaultValue=""
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-px w-px overflow-hidden opacity-0"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#334155]">Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange('name')}
                autoComplete="name"
                className="w-full rounded-xl border border-[#dbe3ee] px-4 py-3 text-sm text-[#1e293b] outline-none transition focus:border-[#22acb6] focus:ring-2 focus:ring-[#22acb6]/20"
                disabled={status.state === 'sending'}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#334155]">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange('email')}
                autoComplete="email"
                className="w-full rounded-xl border border-[#dbe3ee] px-4 py-3 text-sm text-[#1e293b] outline-none transition focus:border-[#22acb6] focus:ring-2 focus:ring-[#22acb6]/20"
                disabled={status.state === 'sending'}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#334155]">Comment</span>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange('comment')}
              rows={5}
              className="w-full resize-y rounded-xl border border-[#dbe3ee] px-4 py-3 text-sm text-[#1e293b] outline-none transition focus:border-[#22acb6] focus:ring-2 focus:ring-[#22acb6]/20"
              disabled={status.state === 'sending'}
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={status.state === 'sending'}
              className="inline-flex items-center gap-2 rounded-full bg-[#ee6e2a] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#d85f20] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="size-4" aria-hidden />
              {status.state === 'sending' ? 'Submitting…' : 'Post comment'}
            </button>
            {status.message ? (
              <p
                className={`text-sm ${
                  status.state === 'error' ? 'text-red-600' : 'text-[#22acb6] font-medium'
                }`}
                role={status.state === 'error' ? 'alert' : 'status'}
              >
                {status.message}
              </p>
            ) : null}
          </div>
        </form>
      ) : (
        <p className="text-sm text-[#64748b]">Comments are closed for this article.</p>
      )}
    </section>
  );
}
