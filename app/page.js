"use client";

import { useEffect, useRef, useState } from "react";
import { db } from "../lib/firebase";
import { ROOMS } from "../lib/rooms";
import {
  ref, onValue, set, update, push, get, onDisconnect,
} from "firebase/database";

const GAME_REF = "escape_room_v1";
const AVATARS  = ["🦊","🐼","🦁","👾","🐙","🦋","🐯","🦄","🐺","🦝"];

function genId() { return Math.random().toString(36).slice(2, 9); }

// ── Elapsed timer display ─────────────────────────────────────────────────────
function useElapsed(startedAt) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startedAt) return;
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ── Join Screen ───────────────────────────────────────────────────────────────
function JoinScreen({ onJoin }) {
  const [name, setName] = useState("");
  const [err, setErr]   = useState("");

  function submit() {
    const t = name.trim();
    if (!t)        return setErr("Please enter your name.");
    if (t.length > 20) return setErr("Name too long (max 20 chars).");
    onJoin(t);
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 p-4">
        {/* Ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-amber-900/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative w-full max-w-lg">
          {/* Logo area */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-4 drop-shadow-xl" aria-hidden="true">🔐</div>
            <h1 className="text-5xl font-black tracking-tight text-amber-100">
              Escape the Study
            </h1>
            <p className="text-stone-400 mt-3 text-base">
              A collaborative puzzle experience · any number of players
            </p>
          </div>

          <div className="bg-stone-900 border border-stone-700 rounded-3xl p-10 shadow-2xl">
            <p className="text-stone-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Your Name
            </p>
            <input
              autoFocus
              value={name}
              maxLength={20}
              onChange={e => { setName(e.target.value); setErr(""); }}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="e.g. Alex, Mert…"
              className="w-full bg-stone-800 border-2 border-stone-700 focus:border-amber-500 outline-none rounded-xl px-5 py-4 text-white text-xl placeholder:text-stone-600 transition"
            />
            {err && <p className="text-red-400 text-base mt-3">{err}</p>}
            <button
              onClick={submit}
              className="mt-6 w-full bg-amber-600 hover:bg-amber-500 active:scale-95 transition text-white font-black py-4 rounded-xl text-xl shadow-lg"
            >
              Enter the Study →
            </button>
            <p className="text-stone-600 text-sm text-center mt-6">
              Share this URL — everyone joins the same room
            </p>
          </div>
        </div>
      </div>
  );
}

// ── Lobby ─────────────────────────────────────────────────────────────────────
function Lobby({ players, myId, isHost, onStart, onClear }) {
  const list = Object.values(players || {}).sort((a, b) => a.joinedAt - b.joinedAt);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-900/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🕯️</div>
          <h2 className="text-3xl font-black text-amber-100">Gathering in the hallway…</h2>
          <p className="text-stone-400 mt-1 text-sm">
            Everyone must be here before the Professor's door will open.
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 mb-5 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-stone-400 text-sm font-semibold">
              Players in room ({list.length})
            </span>
            {list.length >= 2 && (
              <span className="text-emerald-400 text-xs bg-emerald-900/40 px-3 py-1 rounded-full font-semibold">
                Ready to start!
              </span>
            )}
          </div>

          <div className="space-y-2">
            {list.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 bg-stone-800 rounded-xl px-4 py-2.5">
                <span className="text-xl">{AVATARS[i % AVATARS.length]}</span>
                <span className="text-white font-semibold flex-1">{p.name}</span>
                {p.id === myId && <span className="text-stone-500 text-xs">you</span>}
                {i === 0 && <span className="text-amber-400 text-xs font-bold">👑 host</span>}
              </div>
            ))}
            {list.length === 0 && (
              <p className="text-stone-600 text-sm text-center py-4">No one here yet…</p>
            )}
          </div>
        </div>

        {isHost ? (
          <div className="space-y-3">
            <button
              onClick={onStart}
              disabled={list.length < 1}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition text-white font-black py-4 rounded-xl text-xl shadow-xl"
            >
              🔦 Begin Escape ({ROOMS.length} rooms)
            </button>
            <button onClick={onClear} className="w-full text-stone-500 hover:text-stone-300 text-sm py-2 transition">
              Clear room
            </button>
          </div>
        ) : (
          <div className="text-center bg-stone-900/60 border border-stone-800 rounded-xl p-4">
            <p className="text-stone-400 text-sm animate-pulse">
              ⏳ Waiting for <span className="text-amber-300">{list[0]?.name || "host"}</span> to start…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Puzzle Room ───────────────────────────────────────────────────────────────
function PuzzleRoom({ room, roomIndex, players, attempts, myId, myName, onSubmit, onNext, isHost, gameState }) {
  const [input, setInput]     = useState("");
  const [shaking, setShaking] = useState(false);
  const [myResult, setMyResult] = useState(null); // 'correct' | 'wrong'
  const inputRef = useRef(null);
  const elapsed  = useElapsed(gameState.startedAt);

  const playerList = Object.values(players || {}).sort((a, b) => a.joinedAt - b.joinedAt);
  const recentAttempts = (attempts || []).slice(-8).reverse();
  const solved = gameState.phase === "solved";

  function handleSubmit() {
    const t = input.trim();
    if (!t) return;
    const correct = t.toLowerCase() === room.answer.toLowerCase();
    setMyResult(correct ? "correct" : "wrong");
    onSubmit(t, correct);
    if (correct) {
      setInput("");
    } else {
      setShaking(true);
      setTimeout(() => { setShaking(false); setMyResult(null); }, 800);
    }
  }

  useEffect(() => {
    setInput("");
    setMyResult(null);
    inputRef.current?.focus();
  }, [roomIndex]);

  const totalRooms = ROOMS.length;

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800 bg-stone-900/80">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{room.emoji}</span>
          <div>
            <p className="text-amber-100 font-bold text-sm leading-tight">{room.title}</p>
            <p className="text-stone-500 text-xs">Room {roomIndex + 1} of {totalRooms}</p>
          </div>
        </div>
        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {ROOMS.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i < roomIndex      ? "w-3 h-3 bg-emerald-500"
                : i === roomIndex  ? "w-4 h-4 bg-amber-400 ring-2 ring-amber-300/40"
                : "w-3 h-3 bg-stone-700"
              }`}
            />
          ))}
        </div>
        <div className="text-stone-400 font-mono text-sm">⏱ {elapsed}</div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-5xl mx-auto w-full gap-0 lg:gap-6 p-4">
        {/* Left: puzzle */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Flavor text */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 text-stone-400 text-sm italic leading-relaxed">
            {room.flavor}
          </div>

          {/* Puzzle text */}
          <div className="bg-stone-900 border border-amber-900/40 rounded-xl p-5 flex-1">
            {room.image && (
                <img
                  key={room.image} /* Forces React to unmount the old image instantly */
                  src={room.image}
                  alt={room.title}
                  className="w-full max-h-64 object-cover rounded-lg mb-4 border border-stone-700 bg-stone-800"
                />
              )}
            <pre className="text-amber-100 text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {room.puzzle}
            </pre>
          </div>

          {/* Hint */}
          <details className="group">
            <summary className="cursor-pointer text-stone-500 hover:text-amber-400 text-xs transition select-none list-none flex items-center gap-1">
              <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
              Need a hint?
            </summary>
            <p className="mt-2 text-amber-400/80 text-sm bg-amber-950/30 border border-amber-900/30 rounded-lg px-4 py-3">
              💡 {room.hint}
            </p>
          </details>
        </div>

        {/* Right: answer + activity */}
        <div className="lg:w-72 flex flex-col gap-4 mt-4 lg:mt-0">

          {/* Who's here */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
            <p className="text-stone-500 text-xs font-semibold uppercase tracking-widest mb-3">
              Team ({playerList.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {playerList.map((p, i) => (
                <div key={p.id} className="flex items-center gap-1.5 bg-stone-800 rounded-lg px-2 py-1">
                  <span className="text-sm">{AVATARS[i % AVATARS.length]}</span>
                  <span className="text-stone-300 text-xs font-medium">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Answer input / success state */}
          {solved ? (
            <div className="bg-emerald-950/50 border border-emerald-700/50 rounded-xl p-5 text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-emerald-300 font-bold text-sm">{room.successMsg}</p>
            </div>
          ) : (
            <div className={`bg-stone-900 border border-stone-800 rounded-xl p-4 transition ${shaking ? "animate-bounce" : ""}`}>
              <p className="text-stone-400 text-xs font-semibold uppercase tracking-widest mb-3">
                Your Answer
              </p>
              <input
                ref={inputRef}
                value={input}
                onChange={e => { setInput(e.target.value); setMyResult(null); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="Type your answer…"
                className={`w-full bg-stone-800 border-2 outline-none rounded-xl px-4 py-3 text-white font-mono transition ${
                  myResult === "correct" ? "border-emerald-500"
                  : myResult === "wrong"  ? "border-red-500"
                  : "border-stone-700 focus:border-amber-500"
                }`}
              />
              {myResult === "wrong" && (
                <p className="text-red-400 text-xs mt-1.5">❌ Not quite — keep discussing!</p>
              )}
              <button
                onClick={handleSubmit}
                className="mt-3 w-full bg-amber-700 hover:bg-amber-600 active:scale-95 transition text-white font-bold py-2.5 rounded-xl text-sm"
              >
                Submit Answer
              </button>
              <p className="text-stone-600 text-xs text-center mt-2">
                Anyone can submit — discuss first!
              </p>
            </div>
          )}

          {/* Live attempt feed */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex-1">
            <p className="text-stone-500 text-xs font-semibold uppercase tracking-widest mb-3">
              Attempts
            </p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {recentAttempts.length === 0 && (
                <p className="text-stone-700 text-xs text-center py-4">No attempts yet…</p>
              )}
              {recentAttempts.map((a, i) => (
                <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${
                  a.correct ? "bg-emerald-950/60 border border-emerald-800/40"
                            : "bg-stone-800/50"
                }`}>
                  <span>{a.correct ? "✅" : "❌"}</span>
                  <span className="text-stone-400 font-medium truncate">{a.playerName}</span>
                  <span className={`font-mono ml-auto truncate max-w-20 ${a.correct ? "text-emerald-300" : "text-stone-500"}`}>
                    "{a.answer}"
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next room button (host only, shown after solved) */}
          {solved && isHost && (
            <button
              onClick={onNext}
              className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-95 transition text-white font-black py-3 rounded-xl shadow-lg"
            >
              {roomIndex + 1 >= ROOMS.length ? "🏆 See Results!" : "Next Room →"}
            </button>
          )}
          {solved && !isHost && (
            <p className="text-center text-stone-500 text-sm animate-pulse">
              Waiting for host to continue…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Escaped! Screen ───────────────────────────────────────────────────────────
function EscapedScreen({ players, finishTime, isHost, onPlayAgain }) {
  const list = Object.values(players || {}).sort((a, b) => a.joinedAt - b.joinedAt);
  const secs = Math.floor(finishTime / 1000);
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Celebration glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md text-center">
        <div className="text-8xl mb-4">🎉</div>
        <h1 className="text-5xl font-black text-amber-100 mb-2">You Escaped!</h1>
        <p className="text-stone-400 mb-8">The Professor's Study has been conquered.</p>

        <div className="bg-stone-900 border border-amber-800/40 rounded-2xl p-6 mb-6 shadow-2xl">
          <p className="text-stone-500 text-xs uppercase tracking-widest font-semibold mb-1">Escape Time</p>
          <p className="text-amber-300 font-mono font-black text-5xl">{m}:{s}</p>
        </div>

        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 mb-6 text-left">
          <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-3">
            Team ({list.length} players)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {list.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2 bg-stone-800 rounded-xl px-3 py-2">
                <span>{AVATARS[i % AVATARS.length]}</span>
                <span className="text-white text-sm font-semibold truncate">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {isHost && (
          <button
            onClick={onPlayAgain}
            className="w-full bg-amber-700 hover:bg-amber-600 active:scale-95 transition text-white font-black py-4 rounded-xl text-lg shadow-xl"
          >
            🔄 Play Again
          </button>
        )}
        {!isHost && (
          <p className="text-stone-500 text-sm">Great teamwork, everyone! 🙌</p>
        )}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function EscapeRoom() {
  const [myId]   = useState(genId);
  const [myName, setMyName] = useState(null);
  const [game, setGame]     = useState(null);


  const audioRef = useRef(null);
const [muted, setMuted] = useState(true);

function toggleMute() {
  const next = !muted;
  setMuted(next);
  if (audioRef.current) {
    audioRef.current.muted = next;
    if (!next) audioRef.current.play().catch(() => {});
  }
}
  // Subscribe
  useEffect(() => {
    const unsub = onValue(ref(db, GAME_REF), snap => setGame(snap.val()));
    return () => unsub();
  }, []);

  // Remove player on disconnect
  useEffect(() => {
    if (!myName) return;
    onDisconnect(ref(db, `${GAME_REF}/players/${myId}`)).remove();
  }, [myId, myName]);

  // Derived
  const playerList  = Object.values(game?.players || {}).sort((a, b) => a.joinedAt - b.joinedAt);
  const isHost      = playerList[0]?.id === myId;
  const currentRoom = ROOMS[game?.currentRoom ?? 0];
  const attempts    = game?.attempts ? Object.values(game.attempts) : [];

  // ── Actions ────────────────────────────────────────────────────────────────
  async function handleJoin(name) {
    const snap = await get(ref(db, GAME_REF));
    const existing = snap.val();

    if (existing?.phase && existing.phase !== "lobby") {
      alert("A game is running! Ask the host to reset after it finishes.");
      return;
    }

    const me = { id: myId, name, joinedAt: Date.now() };

    if (!existing) {
      await set(ref(db, GAME_REF), {
        phase: "lobby",
        currentRoom: 0,
        startedAt: null,
        finishTime: null,
        players: { [myId]: me },
        attempts: {},
      });
    } else {
      await update(ref(db, `${GAME_REF}/players`), { [myId]: me });
    }
    setMyName(name);
  }

  async function handleStart() {
    await update(ref(db, GAME_REF), {
      phase: "playing",
      currentRoom: 0,
      startedAt: Date.now(),
      finishTime: null,
      attempts: {},
    });
  }

  async function handleClear() {
    await set(ref(db, GAME_REF), {
      phase: "lobby",
      currentRoom: 0,
      startedAt: null,
      finishTime: null,
      players: { [myId]: { id: myId, name: myName, joinedAt: Date.now() } },
      attempts: {},
    });
  }

  async function handleSubmit(answer, correct) {
    // Log attempt
    const attemptRef = push(ref(db, `${GAME_REF}/attempts`));
    await set(attemptRef, {
      playerId: myId,
      playerName: myName,
      answer,
      correct,
      room: game.currentRoom,
      ts: Date.now(),
    });

    if (correct) {
      await update(ref(db, GAME_REF), { phase: "solved" });
    }
  }

  async function handleNext() {
    const nextRoom = (game.currentRoom ?? 0) + 1;
    if (nextRoom >= ROOMS.length) {
      const finishTime = Date.now() - (game.startedAt || Date.now());
      await update(ref(db, GAME_REF), {
        phase: "escaped",
        finishTime,
        attempts: {},
      });
    } else {
      await update(ref(db, GAME_REF), {
        phase: "playing",
        currentRoom: nextRoom,
        attempts: {},
      });
    }
  }

  async function handlePlayAgain() {
    await update(ref(db, GAME_REF), {
      phase: "lobby",
      currentRoom: 0,
      startedAt: null,
      finishTime: null,
      attempts: {},
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────
let screen = null;

  if (!myName) screen = <JoinScreen onJoin={handleJoin} />;
  else if (!game) screen = (
    <div className="min-h-screen flex items-center justify-center bg-stone-950">
      <p className="text-stone-500 animate-pulse">Connecting…</p>
    </div>
  );
  else if (game.phase === "lobby") screen = (
    <Lobby
      players={game.players}
      myId={myId}
      isHost={isHost}
      onStart={handleStart}
      onClear={handleClear}
    />
  );
  else if (game.phase === "playing" || game.phase === "solved") {
    // Filter attempts for current room only
    const roomAttempts = attempts.filter(a => a.room === game.currentRoom);
    screen = (
      <PuzzleRoom
        room={currentRoom}
        roomIndex={game.currentRoom}
        players={game.players}
        attempts={roomAttempts}
        myId={myId}
        myName={myName}
        onSubmit={handleSubmit}
        onNext={handleNext}
        isHost={isHost}
        gameState={game}
      />
    );
  }
  else if (game.phase === "escaped") screen = (
    <EscapedScreen
      players={game.players}
      finishTime={game.finishTime}
      isHost={isHost}
      onPlayAgain={handlePlayAgain}
    />
  );

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop autoPlay muted={muted} />
      <button
        onClick={toggleMute}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-stone-800 hover:bg-stone-700 border border-stone-600 text-xl flex items-center justify-center shadow-lg transition active:scale-95"
        title={muted ? "Unmute music" : "Mute music"}
      >
        {muted ? "🔇" : "🔊"}
      </button>
      {screen}
    </>
  );
}