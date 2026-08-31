// @ts-nocheck
'use client';

import { UIMessage as Message } from '@ai-sdk/react';

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-2xl px-4 py-3 rounded-lg ${
          isUser ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-100'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        
        {/* Render tool invocations conceptually if needed, though they are usually internal */}
        {message.toolInvocations && message.toolInvocations.map(invocation => (
          <div key={invocation.toolCallId} className="mt-2 text-xs text-slate-400 bg-slate-800 p-2 rounded">
            <div><strong>Calling Tool:</strong> {invocation.toolName}</div>
            {invocation.state === 'result' && (
              <div className="truncate text-green-400">Received data from Monday.com</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
