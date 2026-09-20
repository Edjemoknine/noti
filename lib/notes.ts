export type Note = {
  id: string;
  title: string;
  body: string;
  excerpt: string;
  date: string;
  tag: string;
  color: "violet" | "amber" | "teal" | "blue";
  starred: boolean;
};

export const notes: Note[] = [
  {
    id: "q4-product-strategy",
    title: "Q4 product strategy",
    body: "The main opportunity is to make insights feel inevitable, not like another task.\n\nWe should help people move from capture to clarity with fewer decisions in between. The product can do more of the organizing quietly, while keeping the writer in control of the thought.",
    excerpt: "The main opportunity is to make insights feel inevitable, not like another task...",
    date: "Today, 10:42 AM",
    tag: "Product",
    color: "violet",
    starred: true,
  },
  {
    id: "new-onboarding",
    title: "Ideas for the new onboarding",
    body: "A softer first-run experience. Let people start with a thought instead of a blank page.\n\nThe first moment should feel useful before it feels instructional.",
    excerpt:
      "A softer first-run experience. Let people start with a thought instead of a blank page.",
    date: "Yesterday",
    tag: "Ideas",
    color: "amber",
    starred: false,
  },
  {
    id: "team-offsite-lisbon",
    title: "Team offsite — Lisbon",
    body: "Things to bring: analog camera, comfortable shoes, and a very open mind.\n\nLeave enough room in the schedule for the conversations that do not fit the agenda.",
    excerpt: "Things to bring: analog camera, comfortable shoes, and a very open mind.",
    date: "Sep 16",
    tag: "Personal",
    color: "teal",
    starred: false,
  },
  {
    id: "creative-act",
    title: "Reading notes: The Creative Act",
    body: "Create an environment where the next idea has somewhere to land.\n\nThe practice is not about forcing good ideas to arrive. It is about becoming available to them.",
    excerpt: "Create an environment where the next idea has somewhere to land.",
    date: "Sep 14",
    tag: "Reading",
    color: "blue",
    starred: true,
  },
];

export function getNote(id: string) {
  return notes.find((note) => note.id === id) ?? notes[0];
}
