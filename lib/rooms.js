// Each puzzle is designed for group discussion — no single person
// can trivially solve it alone. Answers are case-insensitive + trimmed.

export const ROOMS = [
  {
    id: 1,
    title: "The Bookshelf",
    emoji: "📚",
    image: "/books.png",
    flavor: "The lights blink on, the room is cold, / You're in a study, dusty and old! / The door is locked, you cannot flee, / But six old books hold the magic key.",
    puzzle: `The six books on the shelf, top to bottom:

  📕  "Everything Must Change"
  📗  "Secrets of the Deep"
  📘  "Cycles of Nature"
  📙  "A World Apart"
  📕  "Patience Is a Virtue"
  📗  "Echoes in the Dark"

The spine of each book has a bright little dot,
On the very first letter, right on the spot!`,
    hint: "Let your eyes fall from the peak; only the opening breath of every volume shall speak.",
    answer: "escape",
    successMsg: "The books slide back with a magical sound, A secret hallway has just been found!.",
  },
  {
    id: 2,
    title: "The Coded Safe",
    emoji: "🔐",
    image: "/lock.png",
    flavor: "Down the hall you bravely go, / Into a room with a spooky glow. / A shiny safe is on the wall, / With a sticky note to help you recall:'",
    puzzle: `The safe has a lock with a 4-digit code.
Read these four clues to lighten your load:

  ① "The number of sides on a triangle"
  ② "The number of legs on a dog"
  ③ "The number of faces on a cube"
  ④ "The number of tentacles on an octopus"

What is the 4-digit code?`,
    hint: "Count the simple truths you face, Then write all four without a space.",
    answer: "3468",
    successMsg: "Click-clack-clunk! The safe swings wide, / A dusty old diary is waiting inside!.",
  },
  {
    id: 3,
    title: "The Professor's Diary",
    emoji: "📓",
    image: "/prof.png",
    flavor: "The diary pages are ripped and torn, / Looking quite old and a little bit worn. / But one page is left with a poem to read, / The Professor left it to help you succeed!.",
    puzzle: `The surviving diary page reads:

  "Lions are the apex predators of the savanna.
   Owls survey the darkness with perfect vision.
   Clever adaptation is how species survive.
   Knowledge outlasts every locked door."

The Professor hid a secret, it's better than gold:
Look at the FIRST letter of each sentence told!

What 4-letter word is hidden here?`,
    hint: "Look to the start where each sentence begins, String them in order and see what it spins.",
    answer: "lock",
    successMsg: "A secret drawer opens right under the book, / With a shiny glass mirror for you to go look!'",
  },
  {
    id: 4,
    title: "The Mirror Room",
    emoji: "🪞",
    image: "/mirror.png",
    flavor: "You step in a room full of mirrors so bright, / Reflecting the shadows and bouncing the light. / A clock hangs up high, but it faces the glass, / You must read the reflection to see this room pass!",
    puzzle: `You look in the mirror and the reflected clock shows:

             12
          11    1
        10        2
       9     ●     3
        8         4
          7     5
             6

The hour hand points to the number 3,
The minute hand points to 12, as you see.
The clock in the mirror says 3:00 is near,
But what is the ACTUAL time shown here?
(Answer in H:MM format)`,
    hint: "A mirror reflects both the left and the right, Where three is expected, something is in sight.",
    answer: "9:00",
    successMsg: "The mirrors all spin with a magical breeze, / Revealing the final door, open it please!.",
  },
  {
    id: 5,
    title: "The Final Riddle",
    emoji: "🚪",
    image: "/final.png",
    flavor: "One final door stands tall in the hall, / With a keypad of letters built into the wall. / The Professor left you one final rhyme, / Solve this last riddle to win it in time!",
    puzzle: `"You dream of me often, but my face is unseen,
              I hold all the magic that hasn't yet been.
              Kids want me to hurry, the old want me slow,
              But the moment I'm "now," I become "long ago"!

              Philosophers debate me. Scientists measure me.
              Children cannot wait for me.
              The elderly wish they had more of me.

  What am I?"`,
    hint: "It stays just ahead and is never quite here, A day that is coming, but cannot appear.",
    answer: "future",
    successMsg: "🎉 🎉 HOORAY! The door opens, the bright sun shines through! / You've escaped the old study, we are so proud of you!",
  },
];
