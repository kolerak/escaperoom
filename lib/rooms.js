// Each puzzle is designed for group discussion — no single person
// can trivially solve it alone. Answers are case-insensitive + trimmed.

export const ROOMS = [
  {
    id: 1,
    title: "The Bookshelf",
    emoji: "📚",
    flavor: "The lights flicker on. You're inside the Professor's study. The door is locked. On the shelf, six books are arranged deliberately — their titles are a message.",
    puzzle: `The six books on the shelf, top to bottom:

  📕  "Everything Must Change"
  📗  "Secrets of the Deep"
  📘  "Cycles of Nature"
  📙  "A World Apart"
  📕  "Patience Is a Virtue"
  📗  "Echoes in the Dark"

The spine of each book has a small dot on the first letter.
What 6-letter word do those letters spell?`,
    hint: "Read just the very first letter of each book title, top to bottom.",
    answer: "escape",
    successMsg: "The bookshelf slides aside with a rumble. A narrow corridor leads forward.",
  },
  {
    id: 2,
    title: "The Coded Safe",
    emoji: "🔐",
    flavor: "The corridor opens into a cold laboratory. A steel safe is bolted to the wall. A sticky note reads: 'The code is hidden in plain sight — if you know your shapes.'",
    puzzle: `The safe has a 4-digit combination lock.
Four clues are scratched into the wall beside it:

  ① "The number of sides on a triangle"
  ② "The number of legs on a dog"
  ③ "The number of faces on a cube"
  ④ "The number of tentacles on an octopus"

What is the 4-digit code?`,
    hint: "Each clue is a simple counting fact. Write all four digits together with no spaces.",
    answer: "3468",
    successMsg: "Click. Clunk. The safe swings open, revealing a dusty journal and a key to the next room.",
  },
  {
    id: 3,
    title: "The Professor's Diary",
    emoji: "📓",
    flavor: "Inside the safe is the Professor's personal diary. Most pages are torn out — but one remaining page has four sentences, and the Professor never wrote anything without reason.",
    puzzle: `The surviving diary page reads:

  "Lions are the apex predators of the savanna.
   Owls survey the darkness with perfect vision.
   Clever adaptation is how species survive.
   Knowledge outlasts every locked door."

The Professor was known for hiding messages in the
FIRST LETTER of every sentence.

What 4-letter word is hidden here?`,
    hint: "Take only the first letter of each sentence, in order.",
    answer: "lock",
    successMsg: "A hidden drawer clicks open beneath the desk. Inside: a mirror and a note saying 'Time is not what it seems.'",
  },
  {
    id: 4,
    title: "The Mirror Room",
    emoji: "🪞",
    flavor: "The next room is lined floor-to-ceiling with mirrors. In the center hangs a clock — but it's positioned facing a mirror. You can only see its reflection.",
    puzzle: `You look in the mirror and the reflected clock shows:

              12
           11    1
         10        2
          9    ●   3
           8    4
              7
           6      5
              

The hour hand points to 3.
The minute hand points to 12.

The clock in the mirror shows 3:00.

What is the ACTUAL time on the real clock?
(Answer in H:MM format)`,
    hint: "When a clock face is reflected in a mirror, left and right are swapped. A clock showing 3:00 in a mirror actually reads... think about where 3 and 9 swap.",
    answer: "9:00",
    successMsg: "The mirrors all rotate 90 degrees, revealing a final door — the last obstacle between you and freedom.",
  },
  {
    id: 5,
    title: "The Final Riddle",
    emoji: "🚪",
    flavor: "One last door. A single keypad. No numbers — just a slot for a word. Etched above it is the Professor's final message.",
    puzzle: `"I stand before you every waking moment,
  yet you have never once seen my face.
  I can be planned, dreamed about, and feared —
  but I arrive on my own schedule regardless.
  I am given to you in every second that passes,
  and taken away just as fast.

  Philosophers debate me. Scientists measure me.
  Children cannot wait for me.
  The elderly wish they had more of me.

  What am I?"`,
    hint: "Think about what is always coming but never here — always ahead of you.",
    answer: "future",
    successMsg: "🎉 THE DOOR SWINGS OPEN. You've escaped the Professor's study!",
  },
];
