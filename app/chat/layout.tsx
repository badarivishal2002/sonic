/**
 * Chat Layout
 * Layout for chat page
 */

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
        <p className="mt-2 text-gray-600">Ask questions about your notes</p>
      </header>
      {children}
    </div>
  );
}
