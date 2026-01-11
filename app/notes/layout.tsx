/**
 * Notes Layout
 * Layout for all notes pages
 */

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
        <p className="mt-2 text-gray-600">Your voice-first note-taking workspace</p>
      </header>
      {children}
    </div>
  );
}
