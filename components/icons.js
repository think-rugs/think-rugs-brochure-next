// The wavy rug brand mark, traced from the real Think Rugs logo.
// Inherits currentColor so it works in the nav (sage on white) and placeholders.
export function Mark() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6.5"
         strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d="M80.8 50.0 C80.8 56.3 83.1 63.6 83.2 68.8 C83.2 74.0 83.6 78.8 81.2 81.2 C78.8 83.6 74.0 83.2 68.8 83.2 C63.6 83.1 56.3 80.8 50.0 80.8 C43.7 80.8 36.4 83.1 31.2 83.2 C26.0 83.2 21.2 83.6 18.8 81.2 C16.4 78.8 16.8 74.0 16.8 68.8 C16.9 63.6 19.2 56.3 19.2 50.0 C19.2 43.7 16.9 36.4 16.8 31.2 C16.8 26.0 16.4 21.2 18.8 18.8 C21.2 16.4 26.0 16.8 31.2 16.8 C36.4 16.9 43.7 19.2 50.0 19.2 C56.3 19.2 63.6 16.9 68.8 16.8 C74.0 16.8 78.8 16.4 81.2 18.8 C83.6 21.2 83.2 26.0 83.2 31.2 C83.1 36.4 80.8 43.7 80.8 50.0 Z" />
      <path d="M38 43 L62 43 L70 63 L30 63 Z" />
    </svg>
  );
}

// Selection button glyphs: outline plus when unpicked, tick when picked (toggled via CSS).
export function Tick() {
  return (
    <>
      <svg className="i-add" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
           strokeLinecap="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
      <svg className="i-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"
           strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7" />
      </svg>
    </>
  );
}

export function Placeholder({ code }) {
  return (
    <div className="ph">
      <Mark />
      <span>Image to follow</span>
      {code ? <em>{code}</em> : null}
    </div>
  );
}
