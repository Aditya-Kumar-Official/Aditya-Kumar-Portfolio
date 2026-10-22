/* One heading pattern for every section: a plain h2 and one sentence of context.
   No numbering or eyebrow labels, because these sections are not a sequence. */
export default function SectionHeading({ title, note, id }) {
  return (
    <header className="mb-12 max-w-2xl md:mb-16">
      <h2 id={id} className="text-h2 font-semibold">{title}</h2>
      {note && <p className="mt-4 text-lead text-muted">{note}</p>}
    </header>
  );
}
