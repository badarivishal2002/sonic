/**
 * Meetings Page
 * Notion-style meetings interface
 */

'use client';

import { PageHeader } from '@/components/PageHeader';
import { useState } from 'react';

export default function MeetingsPage() {
  const [upcomingMeetings] = useState([
    { id: 1, title: 'Teamwide Morning Alignment', time: '9:00 AM - 10:00 AM', date: 'Today' },
    { id: 2, title: 'Project Progress Preview', time: '10:00 AM - 11:00 AM', date: 'Today' },
    { id: 3, title: 'Quarterly Strategy Update', time: '2:30 PM - 3:30 PM', date: 'Today' },
    { id: 4, title: 'Sprint Wrap-Up', time: '5:30 PM - 6:30 PM', date: 'Today' },
  ]);

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      <PageHeader title="Meetings" />
      
      <div className="px-8 py-8 max-w-6xl mx-auto">
        {/* New Button */}
        <div className="mb-8 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors">
            New
          </button>
        </div>

        {/* Upcoming Meetings */}
        <div className="mb-12">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-lg bg-[#2E2E2E] border border-[#3E3E3E] flex items-center justify-center">
                <span className="text-2xl font-bold text-[#E9E9E9]">11</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#E9E9E9] mb-2">Upcoming meetings</h2>
              <p className="text-sm text-[#9B9B9B] mb-4">
                Start AI Meeting Notes automatically for your upcoming events.
              </p>
              <button className="text-sm text-blue-400 hover:text-blue-300">
                Connect Calendar
              </button>
              
              <div className="mt-6 space-y-3">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-4 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg hover:bg-[#3E3E3E] transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-sm font-medium text-[#E9E9E9]">{meeting.title}</h3>
                        <span className="text-xs text-[#9B9B9B]">{meeting.date}</span>
                      </div>
                      <p className="text-xs text-[#9B9B9B]">{meeting.time}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-[#3E3E3E] hover:bg-[#4E4E4E] text-xs text-[#E9E9E9] rounded transition-colors">
                      Transcribe
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Meeting Notes */}
        <div>
          <button className="flex items-center gap-2 mb-4 text-sm text-[#9B9B9B] hover:text-[#E9E9E9]">
            <span>▾</span>
            <span>Last 30 days</span>
          </button>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg hover:bg-[#3E3E3E] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#9B9B9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-[#E9E9E9]">Meeting @December 13, 2025</span>
              </div>
              <span className="text-xs text-[#9B9B9B]">Dec 13</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
