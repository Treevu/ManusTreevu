import { useState, useEffect, useCallback } from 'react';

interface TypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  loop?: boolean;
  loopDelay?: number;
}

interface TypewriterState {
  displayText: string;
  isTyping: boolean;
  isComplete: boolean;
  cursorVisible: boolean;
}

export function useTypewriter({
  text,
  speed = 100,
  delay = 0,
  onComplete,
  loop = false,
  loopDelay = 2000,
}: TypewriterOptions): TypewriterState {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  const startTyping = useCallback(() => {
    setDisplayText('');
    setIsTyping(true);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // Initial delay before starting
    timeout = setTimeout(() => {
      startTyping();
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, startTyping]);

  useEffect(() => {
    if (!isTyping) return;

    if (displayText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      setIsComplete(true);
      onComplete?.();

      if (loop) {
        const loopTimeout = setTimeout(() => {
          startTyping();
        }, loopDelay);

        return () => clearTimeout(loopTimeout);
      }
    }
  }, [displayText, text, speed, isTyping, onComplete, loop, loopDelay, startTyping]);

  return {
    displayText,
    isTyping,
    isComplete,
    cursorVisible,
  };
}

// Multi-line typewriter for sequential typing
interface MultiLineTypewriterOptions {
  lines: string[];
  speed?: number;
  lineDelay?: number;
  initialDelay?: number;
}

interface MultiLineTypewriterState {
  displayLines: string[];
  currentLineIndex: number;
  isTyping: boolean;
  isComplete: boolean;
  cursorVisible: boolean;
}

export function useMultiLineTypewriter({
  lines,
  speed = 80,
  lineDelay = 500,
  initialDelay = 0,
}: MultiLineTypewriterOptions): MultiLineTypewriterState {
  const [displayLines, setDisplayLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [started, setStarted] = useState(false);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  // Initial delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      setStarted(true);
      setIsTyping(true);
      setDisplayLines(['']);
    }, initialDelay);

    return () => clearTimeout(timeout);
  }, [initialDelay]);

  // Typing effect
  useEffect(() => {
    if (!started || !isTyping || isComplete) return;

    const currentLine = lines[currentLineIndex];

    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayLines((prev) => {
          const newLines = [...prev];
          newLines[currentLineIndex] = currentLine.slice(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentLineIndex < lines.length - 1) {
      // Move to next line after delay
      const timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
        setDisplayLines((prev) => [...prev, '']);
      }, lineDelay);

      return () => clearTimeout(timeout);
    } else {
      // All lines complete
      setIsTyping(false);
      setIsComplete(true);
    }
  }, [started, isTyping, isComplete, currentLineIndex, currentCharIndex, lines, speed, lineDelay]);

  return {
    displayLines,
    currentLineIndex,
    isTyping,
    isComplete,
    cursorVisible,
  };
}

export default useTypewriter;
