import React, { useState, useEffect, useCallback } from 'react';

interface TypingEffectProps {
  text: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');

  const typeNextCharacter = useCallback(() => {
    setDisplayText((prev) => {
      if (prev.length < text.length) {
        return text.slice(0, prev.length + 1);
      }
      return prev;
    });
  }, [text]);

  useEffect(() => {
    if (displayText.length < text.length) {
      const typingTimeout = setTimeout(typeNextCharacter, 60);
      return () => clearTimeout(typingTimeout);
    }
  }, [displayText, text, typeNextCharacter]);

  return <span>{displayText}</span>;
};

export default TypingEffect;

