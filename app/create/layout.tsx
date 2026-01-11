/**
 * Create Note Layout
 * Layout for create note page
 */

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8 max-w-4xl">
      {children}
    </div>
  );
}
