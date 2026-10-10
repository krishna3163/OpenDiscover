import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { useToast } from '../context/toast';
import { readStorage, STORAGE_KEYS, writeStorage } from '../lib/storage';
import { timeAgo } from '../lib/time';

export interface Comment {
  id: number;
  user: string;
  text: string;
  /** ISO timestamp. */
  time: string;
  avatar: string;
}

const SEED_COMMENTS: Comment[] = [
  {
    id: 1,
    user: 'Alex',
    text: 'Has anyone tried this with the new API update? Curious whether the workflow still holds up.',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    avatar: 'A',
  },
  {
    id: 2,
    user: 'Sarah',
    text: 'Works great here. The licence is permissive enough that we shipped it inside a commercial product.',
    time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    avatar: 'S',
  },
];

interface DiscussionSectionProps {
  projectId: number;
  projectTitle: string;
}

/**
 * Per-project discussion thread.
 *
 * Comments are stored in `localStorage` (seeded with two examples so the
 * section never looks empty). There is no backend yet — when one exists, only
 * this component has to change.
 */
export const DiscussionSection: React.FC<DiscussionSectionProps> = ({ projectId, projectTitle }) => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const [comments, setComments] = useState<Comment[]>(() => {
    const stored = readStorage<Comment[] | null>(STORAGE_KEYS.discussion(projectId), null);
    return Array.isArray(stored) && stored.length ? stored : SEED_COMMENTS;
  });
  const [draft, setDraft] = useState('');

  useEffect(() => {
    writeStorage(STORAGE_KEYS.discussion(projectId), comments);
  }, [comments, projectId]);

  const handlePost = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      const text = draft.trim();
      if (!text) return;

      setComments((prev) => [
        {
          id: Date.now(),
          user: user?.name ?? 'Guest',
          text,
          time: new Date().toISOString(),
          avatar: (user?.name ?? 'G').charAt(0).toUpperCase(),
        },
        ...prev,
      ]);
      setDraft('');
      toast.success('Comment posted', 'Saved in this browser — there is no server yet.');
    },
    [draft, toast, user],
  );

  return (
    <div className="discussion">
      <h3 className="section-title">
        💬 Community discussion <span className="count-pill">{comments.length}</span>
      </h3>

      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment">
            <span className="comment-avatar" aria-hidden="true">
              {comment.avatar}
            </span>
            <div className="comment-body">
              <p className="comment-meta">
                <strong>{comment.user}</strong> <span>· {timeAgo(comment.time)}</span>
              </p>
              <p className="comment-text">{comment.text}</p>
            </div>
          </li>
        ))}
      </ul>

      {isAuthenticated ? (
        <form className="comment-form" onSubmit={handlePost}>
          <span className="comment-avatar comment-avatar-me" aria-hidden="true">
            {(user?.name ?? 'Y').charAt(0).toUpperCase()}
          </span>
          <div className="comment-form-fields">
            <label className="sr-only" htmlFor={`comment-${projectId}`}>
              Add a comment about {projectTitle}
            </label>
            <textarea
              id={`comment-${projectId}`}
              className="chat-input"
              value={draft}
              rows={3}
              maxLength={1000}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Add to the discussion… (stored locally in this browser)"
            />
            <div className="comment-form-actions">
              <span className="char-count">{draft.length}/1000</span>
              <button type="submit" className="btn btn-primary" disabled={!draft.trim()}>
                Post comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="notice">
          <p>Log in to join the conversation.</p>
          <Link to="/login" className="btn btn-outline">
            Log in / Sign up
          </Link>
        </div>
      )}
    </div>
  );
};

export default DiscussionSection;
