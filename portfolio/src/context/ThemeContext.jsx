import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";

const STORAGE_KEY = "darkMode";

const readStoredPreference = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // private mode / blocked storage
  }
};

// Lazy initializer: resolved before the first paint of the React tree, so
// dark-mode visitors never see a light flash. The inline script in index.html
// covers the window before React mounts at all.
const getInitialDarkMode = () => {
  if (typeof window === "undefined") return false;
  const saved = readStoredPreference();
  if (saved !== null) return saved === "true";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

// Given a default so useTheme() outside the provider degrades to light mode
// instead of throwing on destructure.
const ThemeContext = createContext({ darkMode: false, toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    const { body, documentElement: html } = document;
    body.classList.toggle("dark-mode", darkMode);
    body.classList.toggle("light-mode", !darkMode);
    // Root-level color-scheme drives UA scrollbars and form controls. The old
    // code applied it to every element via `.dark-mode *`, which is both wrong
    // and another universal-selector cost.
    html.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  // Follow the OS, but only until the visitor makes an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      if (readStoredPreference() === null) setDarkMode(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = !darkMode;
    // Persist ONLY here. Writing in the [darkMode] effect would make "the user
    // has chosen explicitly" true on mount and permanently disable the
    // OS-preference following above.
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* ignore */
    }
    // Opt in to the colour transition only around the swap -- see
    // .theme-transition in index.css.
    const html = document.documentElement;
    html.classList.add("theme-transition");
    window.setTimeout(() => html.classList.remove("theme-transition"), 350);
    setDarkMode(next);
  }, [darkMode]);

  const value = useMemo(
    () => ({ darkMode, toggleTheme }),
    [darkMode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
