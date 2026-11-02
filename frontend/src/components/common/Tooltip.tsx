import React, { useState, useRef, useLayoutEffect, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';

let dismissActiveTooltip: (() => void) | null = null;

export interface TooltipProps {
  content?: string | null;
  children: React.ReactElement<Record<string, unknown>>;
  position?: 'top' | 'bottom';
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const triggerElRef = useRef<HTMLElement | null>(null);
  const tooltipElRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const tooltipId = useId();

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    clearOpenTimer();
    setVisible(false);
    if (dismissActiveTooltip === hide) {
      dismissActiveTooltip = null;
    }
  }, [clearOpenTimer]);

  const show = useCallback(
    (target: HTMLElement) => {
      if (disabled || !content || !content.trim()) return;
      clearOpenTimer();
      triggerElRef.current = target;
      openTimerRef.current = window.setTimeout(() => {
        if (dismissActiveTooltip && dismissActiveTooltip !== hide) {
          dismissActiveTooltip();
        }
        dismissActiveTooltip = hide;
        setVisible(true);
      }, 90);
    },
    [content, disabled, clearOpenTimer, hide]
  );

  useEffect(() => {
    if (disabled || !content) {
      hide();
    }
  }, [disabled, content, hide]);

  useEffect(() => {
    return () => {
      clearOpenTimer();
      if (dismissActiveTooltip === hide) {
        dismissActiveTooltip = null;
      }
    };
  }, [clearOpenTimer, hide]);

  const updatePosition = useCallback(() => {
    const triggerEl = triggerElRef.current;
    const tooltipEl = tooltipElRef.current;
    if (!triggerEl || !tooltipEl) return;

    if (!triggerEl.isConnected) {
      hide();
      return;
    }

    const triggerRect = triggerEl.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const gap = 8;
    const viewportPadding = 8;

    let top =
      position === 'bottom'
        ? triggerRect.bottom + gap
        : triggerRect.top - tooltipRect.height - gap;

    if (position === 'top' && top < viewportPadding) {
      top = triggerRect.bottom + gap;
    } else if (
      position === 'bottom' &&
      top + tooltipRect.height > window.innerHeight - viewportPadding
    ) {
      top = Math.max(viewportPadding, triggerRect.top - tooltipRect.height - gap);
    }

    let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
    left = Math.max(
      viewportPadding,
      Math.min(left, window.innerWidth - tooltipRect.width - viewportPadding)
    );

    tooltipEl.style.setProperty('--jb-tooltip-left', `${Math.round(left)}px`);
    tooltipEl.style.setProperty('--jb-tooltip-top', `${Math.round(top)}px`);
  }, [position, hide]);

  useLayoutEffect(() => {
    if (!visible) return;
    updatePosition();
  }, [visible, content, updatePosition]);

  useEffect(() => {
    if (!visible) return;

    const handleScrollOrResize = () => {
      hide();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hide();
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, hide]);

  if (!React.isValidElement(children)) {
    return children;
  }

  const childProps = children.props as Record<string, unknown>;
  const existingMouseEnter = childProps.onMouseEnter as
    | ((e: React.MouseEvent<HTMLElement>) => void)
    | undefined;
  const existingMouseLeave = childProps.onMouseLeave as
    | ((e: React.MouseEvent<HTMLElement>) => void)
    | undefined;
  const existingFocus = childProps.onFocus as
    | ((e: React.FocusEvent<HTMLElement>) => void)
    | undefined;
  const existingBlur = childProps.onBlur as
    | ((e: React.FocusEvent<HTMLElement>) => void)
    | undefined;
  const existingMouseDown = childProps.onMouseDown as
    | ((e: React.MouseEvent<HTMLElement>) => void)
    | undefined;

  const trimmedContent = content?.trim() || '';
  const ariaLabel =
    (typeof childProps['aria-label'] === 'string' && childProps['aria-label'].trim()
      ? childProps['aria-label']
      : trimmedContent) || undefined;

  const clonedChild = React.cloneElement(children, {
    ...childProps,
    title: undefined,
    'aria-label': ariaLabel,
    'aria-describedby': visible && trimmedContent ? tooltipId : undefined,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      existingMouseEnter?.(e);
      show(e.currentTarget);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      existingMouseLeave?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      existingFocus?.(e);
      if (e.currentTarget.matches(':focus-visible')) {
        show(e.currentTarget);
      }
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      existingBlur?.(e);
      hide();
    },
    onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
      existingMouseDown?.(e);
      hide();
    },
  });

  return (
    <>
      {clonedChild}
      {visible &&
        !disabled &&
        trimmedContent &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipElRef}
            id={tooltipId}
            role="tooltip"
            className="jb-floating-tooltip pointer-events-none select-none rounded-lg border border-purple-400/25 bg-[#25243A] px-2.5 py-1.5 text-[11px] font-medium leading-tight text-white shadow-lg shadow-[#25243A]/20 whitespace-nowrap"
          >
            {trimmedContent}
          </div>,
          document.body
        )}
    </>
  );
};
