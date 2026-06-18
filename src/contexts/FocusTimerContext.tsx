"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type FocusStatus = "idle" | "running" | "paused";

interface FocusState {
  status: FocusStatus;
  elapsed: number;
  title: string;
  nucleoNome?: string;
  cor: string;
}

type FocusAction =
  | { type: "START"; title: string; nucleoNome?: string; cor: string }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "STOP" }
  | { type: "TICK" };

interface FocusTimerContextValue extends FocusState {
  start: (opts?: { title?: string; nucleoNome?: string; cor?: string }) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

// ── Reducer ───────────────────────────────────────────────────────────────────

const INITIAL: FocusState = {
  status: "idle",
  elapsed: 0,
  title: "Sessão de Foco",
  nucleoNome: undefined,
  cor: "#4D7CFF",
};

function reducer(state: FocusState, action: FocusAction): FocusState {
  switch (action.type) {
    case "START":
      return {
        status: "running",
        elapsed: 0,
        title: action.title,
        nucleoNome: action.nucleoNome,
        cor: action.cor,
      };
    case "PAUSE":
      return state.status === "running" ? { ...state, status: "paused" } : state;
    case "RESUME":
      return state.status === "paused" ? { ...state, status: "running" } : state;
    case "STOP":
      return INITIAL;
    case "TICK":
      return state.status === "running"
        ? { ...state, elapsed: state.elapsed + 1 }
        : state;
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const FocusTimerContext = createContext<FocusTimerContextValue | null>(null);

export function FocusTimerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.status === "running") {
      intervalRef.current = setInterval(() => dispatch({ type: "TICK" }), 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.status]);

  const start = ({
    title = "Sessão de Foco",
    nucleoNome,
    cor = "#4D7CFF",
  }: { title?: string; nucleoNome?: string; cor?: string } = {}) => {
    dispatch({ type: "START", title, nucleoNome, cor });
  };

  const pause = () => dispatch({ type: "PAUSE" });
  const resume = () => dispatch({ type: "RESUME" });
  const stop = () => dispatch({ type: "STOP" });

  return (
    <FocusTimerContext.Provider value={{ ...state, start, pause, resume, stop }}>
      {children}
    </FocusTimerContext.Provider>
  );
}

export function useFocusTimer() {
  const ctx = useContext(FocusTimerContext);
  if (!ctx) throw new Error("useFocusTimer must be used inside FocusTimerProvider");
  return ctx;
}
