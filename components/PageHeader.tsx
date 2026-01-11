/**
 * PageHeader Component
 * Notion-style page header with title, share button, and actions
 * Includes share functionality with access control
 */

'use client';

import { useState } from 'react';

interface PageHeaderProps {
  title: string;
  onShare?: () => void;
  onDelete?: () => void;
  onStar?: () => void;
  isStarred?: boolean;
  noteId?: string | null;
}

export function PageHeader({ title, onShare, onDelete, onStar, isStarred = false, noteId }: PageHeaderProps) {
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  const handleShare = () => {
    if (noteId) {
      const link = `${window.location.origin}/notes/${noteId}`;
      setShareLink(link);
      setShowShareMenu(true);
    } else {
      onShare?.();
    }
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      // You could show a toast notification here
      setShowShareMenu(false);
    }
  };

  const handlePublicAccess = async () => {
    // TODO: Implement public access toggle via API
    setIsPublic(!isPublic);
    // This would call an API to update note sharing settings
  };

  return (
    <div className="sticky top-0 z-10 bg-[#1F1F1F] border-b border-[#2E2E2E] px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Navigation and Title */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-[#2E2E2E] rounded">
              <svg className="w-5 h-5 text-[#9B9B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-1.5 hover:bg-[#2E2E2E] rounded">
              <svg className="w-5 h-5 text-[#9B9B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <h1 className="text-2xl font-semibold text-[#E9E9E9] truncate">{title}</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {onShare && (
            <div className="relative">
              <button
                onClick={handleShare}
                className="px-4 py-1.5 bg-[#2E2E2E] hover:bg-[#3E3E3E] text-sm text-[#E9E9E9] rounded transition-colors"
              >
                Share
              </button>
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#2E2E2E] border border-[#3E3E3E] rounded shadow-lg z-20 p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-[#E9E9E9] mb-2">
                        <input
                          type="checkbox"
                          checked={isPublic}
                          onChange={handlePublicAccess}
                          className="rounded"
                        />
                        <span>Public access</span>
                      </label>
                      <p className="text-xs text-[#9B9B9B]">Anyone with the link can view</p>
                    </div>
                    {shareLink && (
                      <div>
                        <label className="block text-xs text-[#9B9B9B] mb-1">Link</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={shareLink}
                            readOnly
                            className="flex-1 px-3 py-2 bg-[#1F1F1F] border border-[#3E3E3E] rounded text-xs text-[#E9E9E9]"
                          />
                          <button
                            onClick={handleCopyLink}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => setShowShareMenu(false)}
                      className="w-full px-3 py-2 bg-[#3E3E3E] hover:bg-[#4E4E4E] text-sm text-[#E9E9E9] rounded transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {onStar && (
            <button
              onClick={onStar}
              className="p-2 hover:bg-[#2E2E2E] rounded"
            >
              <svg className={`w-5 h-5 ${isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-[#9B9B9B]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowDeleteMenu(!showDeleteMenu)}
              className="p-2 hover:bg-[#2E2E2E] rounded"
            >
              <svg className="w-5 h-5 text-[#9B9B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            {showDeleteMenu && onDelete && (
              <div className="absolute right-0 mt-2 w-48 bg-[#2E2E2E] border border-[#3E3E3E] rounded shadow-lg z-20">
                <button
                  onClick={() => {
                    onDelete();
                    setShowDeleteMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#3E3E3E] rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
