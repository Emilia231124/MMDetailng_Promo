'use client';

import { useRef, useState, useCallback } from 'react';

interface AnimatedSearchBarProps {
  placeholder?: string;
  /** Текст-лейбл слева от строки поиска */
  label?: string;
  onSearch: (query: string) => void;
  className?: string;
}

/**
 * SVG-анимированная строка поиска (адаптация с codepen, тёмная тема).
 *
 * Состояния:
 *  idle     — иконка лупы по центру
 *  active   — лупа уходит влево, появляется underline + input
 *  searching — показывается кнопка X для очистки
 *
 * stroke #fff, background transparent, тёмные hover-оверлеи.
 */
const AnimatedSearchBar = ({
  placeholder = '',
  label,
  onSearch,
  className,
}: AnimatedSearchBarProps) => {
  const [active, setActive] = useState(false);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleActivate = useCallback(() => {
    setActive(true);
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  // onMouseDown вместо onClick чтобы сработало до onBlur на input
  const handleClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
    setSearching(false);
    onSearch('');
  }, [onSearch]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearching(val.length > 0);
      onSearch(val);
    },
    [onSearch]
  );

  const handleBlur = useCallback(() => {
    if (inputRef.current && inputRef.current.value.length === 0) {
      setActive(false);
      setSearching(false);
    }
  }, []);

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
      className={className}
    >
      {label && (
        <span
          style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: '#555',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      )}

      {/* Поисковый контейнер 300px — размеры из оригинала */}
      <div style={{ position: 'relative', width: '300px' }}>
        <svg
          viewBox="0 0 700 100"
          style={{
            position: 'relative',
            display: 'block',
            transform: active ? 'translateX(-7%)' : 'translateX(40%)',
            transition: 'transform 500ms',
          }}
        >
          {/* Путь: окружность лупы + горизонтальная линия */}
          <path
            d="m 59.123035,59.123035 c -10.561361,10.56136 -27.684709,10.56136 -38.24607,0 -10.56136,-10.561361 -10.56136,-27.684709 0,-38.24607 10.561361,-10.56136 27.684709,-10.56136 38.24607,0 10.56136,10.561361 10.56136,27.684709 0,38.24607 l 28.876965,28.876965 c 6.304625,7.101523 5.754679,-0.187815 13.07143,-0.5 h 582.04101"
            style={{
              fill: 'none',
              strokeDasharray: active ? '580 808' : '210 808',
              strokeDashoffset: active ? '-224px' : '0',
              strokeLinecap: 'round',
              strokeWidth: 6,
              stroke: '#fff',
              transition: 'stroke-dasharray 500ms, stroke-dashoffset 500ms',
            }}
          />
          {/* X — левая дуга */}
          <path
            d="m 673.46803,25.714286 -37.17876,38.816532 c 0,0 -5.08857,5.60515 -5.68529,11.841734 -1.06622,11.143538 13.02902,11.127448 13.02902,11.127448"
            style={{
              fill: 'none',
              strokeDasharray: '56 92',
              strokeDashoffset: searching ? '0' : '-92px',
              strokeLinecap: 'round',
              strokeWidth: 6,
              stroke: '#fff',
              transition: 'stroke-dashoffset 500ms',
              visibility: active ? 'visible' : 'hidden',
            }}
          />
          {/* X — правая дуга */}
          <path
            d="m 635.08021,25.714286 37.17876,38.816532 c 0,0 5.08857,5.60515 5.68529,11.841734 1.06622,11.143538 -13.02902,11.127448 -13.02902,11.127448"
            style={{
              fill: 'none',
              strokeDasharray: '56 92',
              strokeDashoffset: searching ? '0' : '-92px',
              strokeLinecap: 'round',
              strokeWidth: 6,
              stroke: '#fff',
              transition: 'stroke-dashoffset 500ms',
              visibility: active ? 'visible' : 'hidden',
            }}
          />
        </svg>

        {/* Input — скрыт в idle-состоянии */}
        <input
          ref={inputRef}
          type="text"
          onChange={handleInput}
          onBlur={handleBlur}
          placeholder={placeholder}
          style={{
            border: 0,
            background: 'transparent',
            color: '#fff',
            fontSize: '1.2em',
            fontFamily: 'var(--font-body)',
            left: '20px',
            outline: 'none',
            position: 'absolute',
            top: '4px',
            width: 'calc(100% - 60px)',
            opacity: active ? 1 : 0,
            transition: 'opacity 300ms',
            pointerEvents: active ? 'auto' : 'none',
          }}
        />

        {/* Оверлей для клика по иконке лупы (idle state) */}
        {!active && (
          <div
            onClick={handleActivate}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              cursor: 'pointer',
              height: '64px',
              left: '110px',
              top: '-10px',
              width: '64px',
              transition: 'background 300ms',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          />
        )}

        {/* Оверлей для клика по X (searching state) */}
        {active && searching && (
          <div
            onMouseDown={handleClear}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              cursor: 'pointer',
              height: '38px',
              right: '0',
              top: '0',
              width: '38px',
              transition: 'background 300ms',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          />
        )}
      </div>
    </div>
  );
};

export default AnimatedSearchBar;
