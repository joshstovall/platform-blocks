/**
 * Advanced input masking utility inspired by react-imask
 * Provides flexible pattern-based input formatting with proper cursor handling
 */

export interface MaskDefinition {
  /** The mask pattern (e.g., '(000) 000-0000', '+1 000 000 0000') */
  mask: string;
  /** Placeholder character for unfilled positions */
  placeholderChar?: string;
  /** Whether to show the mask when input is empty */
  showMask?: boolean;
  /** Custom definitions for mask characters */
  definitions?: Record<string, RegExp>;
  /** Whether to allow incomplete input */
  lazy?: boolean;
}

export interface MaskResult {
  /** The masked/formatted value */
  value: string;
  /** The unmasked/raw value */
  unmaskedValue: string;
  /** Whether the mask is complete */
  isComplete: boolean;
  /** Current cursor position after formatting */
  cursorPosition: number;
}

// Default character definitions
const DEFAULT_DEFINITIONS: Record<string, RegExp> = {
  '0': /\d/,           // Any digit
  'a': /[a-zA-Z]/,     // Any letter
  '*': /[a-zA-Z0-9]/,  // Any alphanumeric
  '#': /\d/,           // Any digit (alternative)
};

/**
 * Creates a masking function for the given pattern
 */
export function createMask(definition: MaskDefinition) {
  const {
    mask,
    placeholderChar = '_',
    showMask = false,
    definitions = {},
    lazy = true
  } = definition;

  const combinedDefinitions = { ...DEFAULT_DEFINITIONS, ...definitions };
  
  // Parse the mask to identify fixed and variable characters
  const maskChars = Array.from(mask);
  const pattern: Array<{ char: string; isFixed: boolean; regex?: RegExp }> = [];
  
  for (const char of maskChars) {
    if (combinedDefinitions[char]) {
      pattern.push({ char, isFixed: false, regex: combinedDefinitions[char] });
    } else {
      pattern.push({ char, isFixed: true });
    }
  }

  /**
   * Apply mask to input value
   */
  function applyMask(
    inputValue: string,
    previousValue: string = '',
    cursorPos: number = inputValue.length
  ): MaskResult {
    const inputChars = Array.from(inputValue.replace(/[^\w\s]/g, '')); // Clean input
    let maskedValue = '';
    let unmaskedValue = '';
    let inputIndex = 0;
    let newCursorPos = 0;
    let isComplete = true;

    // Track if we're still before the original cursor position
    let beforeCursor = true;
    const originalInputLength = Array.from(previousValue.replace(/[^\w\s]/g, '')).length;

    for (let i = 0; i < pattern.length; i++) {
      const { char: maskChar, isFixed, regex } = pattern[i];

      if (isFixed) {
        // Fixed character - always include
        maskedValue += maskChar;
        if (beforeCursor && maskedValue.length <= cursorPos + (maskedValue.length - inputValue.length)) {
          newCursorPos = maskedValue.length;
        }
      } else {
        // Variable character - match with input
        if (inputIndex < inputChars.length) {
          const inputChar = inputChars[inputIndex];
          
          if (regex && regex.test(inputChar)) {
            maskedValue += inputChar;
            unmaskedValue += inputChar;
            inputIndex++;
            
            if (beforeCursor && inputIndex <= cursorPos) {
              newCursorPos = maskedValue.length;
            }
          } else {
            // Invalid character for this position
            isComplete = false;
            if (!lazy) {
              maskedValue += placeholderChar;
            }
            break;
          }
        } else {
          // No more input characters
          isComplete = false;
          if (!lazy && showMask) {
            maskedValue += placeholderChar;
          } else {
            break;
          }
        }
      }
    }

    // Handle cursor position when adding characters
    if (inputValue.length > previousValue.length && beforeCursor) {
      newCursorPos = Math.min(newCursorPos + 1, maskedValue.length);
    }

    return {
      value: maskedValue,
      unmaskedValue,
      isComplete: inputIndex >= inputChars.length && inputIndex > 0,
      cursorPosition: Math.max(0, Math.min(newCursorPos, maskedValue.length))
    };
  }

  /**
   * Get display value (with placeholder if showMask is true)
   */
  function getDisplayValue(value: string): string {
    if (!value && showMask) {
      return mask.replace(/[0a*#]/g, placeholderChar);
    }
    return applyMask(value).value;
  }

  /**
   * Process input change with proper cursor handling
   */
  function processInput(
    newValue: string,
    oldValue: string,
    selectionStart: number = newValue.length
  ): MaskResult {
    // Handle deletion
    if (newValue.length < oldValue.length) {
      const deleteCount = oldValue.length - newValue.length;
      const deletionStart = selectionStart;
      
      // Remove characters from unmasked value
      const oldUnmasked = applyMask(oldValue).unmaskedValue;
      const newUnmasked = oldUnmasked.slice(0, deletionStart) + oldUnmasked.slice(deletionStart + deleteCount);
      
      return applyMask(newUnmasked, oldValue, deletionStart);
    }
    
    // Handle insertion/typing
    return applyMask(newValue, oldValue, selectionStart);
  }

  return {
    applyMask,
    getDisplayValue,
    processInput,
    pattern,
    definition
  };
}

/**
 * Phone number specific masking presets
 */
export const PHONE_MASKS = {
  US: createMask({
    mask: '(000) 000-0000',
    placeholderChar: '0',
    lazy: true
  }),
  US_WITH_COUNTRY: createMask({
    mask: '+1 (000) 000-0000',
    placeholderChar: '0',
    lazy: true
  }),
  UK: createMask({
    mask: '+44 0000 000 0000',
    placeholderChar: '0',
    lazy: true
  }),
  INTERNATIONAL: createMask({
    mask: '+000 000 000 0000',
    placeholderChar: '0',
    lazy: true
  })
};

/**
 * Other useful mask presets
 */
export const COMMON_MASKS = {
  CREDIT_CARD: createMask({
    mask: '0000 0000 0000 0000',
    placeholderChar: '0',
    lazy: true
  }),
  DATE: createMask({
    mask: '00/00/0000',
    placeholderChar: '0',
    lazy: true
  }),
  SSN: createMask({
    mask: '000-00-0000',
    placeholderChar: '0',
    lazy: true
  }),
  ZIP_CODE: createMask({
    mask: '00000-0000',
    placeholderChar: '0',
    lazy: true
  })
};