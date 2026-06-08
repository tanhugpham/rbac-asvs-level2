'use client';

import { useState, FormEvent } from 'react';
import { Send, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  { value: 'QUESTION', label: 'Question' },
  { value: 'COMPLAINT', label: 'Complaint' },
  { value: 'REQUEST', label: 'Request' },
  { value: 'OTHER', label: 'Other' },
];

export function SupportTicketForm() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!subject.trim() || !message.trim()) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
        return;
      }

      setSuccess('Yêu cầu của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong vòng 24 giờ.');
      setSubject('');
      setMessage('');
      setCategory('OTHER');
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category */}
      <div>
        <label className="mb-1.5 block text-sm text-gray-400">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-blue-500/50"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value} className="bg-gray-900">
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div>
        <label className="mb-1.5 block text-sm text-gray-400">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Tóm tắt vấn đề của bạn..."
          maxLength={200}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-blue-500/50"
        />
      </div>

      {/* Message */}
      <div>
        <label className="mb-1.5 block text-sm text-gray-400">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mô tả chi tiết vấn đề của bạn..."
          rows={4}
          maxLength={2000}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-blue-500/50"
        />
        <p className="mt-1 text-right text-xs text-gray-500">{message.length}/2000</p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
          <p className="text-sm text-green-300">{success}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || !subject.trim() || !message.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Request
          </>
        )}
      </button>
    </form>
  );
}