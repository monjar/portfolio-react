/* Gallery lightbox on a native <dialog>: focus trap, Escape and an inert
   backdrop for free. Arrow keys and swipes move between items. */
import { useEffect, useRef } from "react";
import type { MediaItem } from "../../data/projects";
import Media from "../Media/Media";
import { ArrowGlyph } from "../icons";
import "./Lightbox.css";

interface Props {
  items: MediaItem[];
  index: number | null;
  onIndex: (i: number | null) => void;
}

export default function Lightbox({ items, index, onIndex }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const item = open ? items[index] : null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const go = (delta: number) => {
    if (index === null) return;
    onIndex((index + delta + items.length) % items.length);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const touch = useRef<number | null>(null);

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="Gallery"
      onClose={() => onIndex(null)}
      onClick={(e) => e.target === ref.current && onIndex(null)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      {item && (
        <figure className="lightbox__fig">
          <div className="lightbox__stage">
            <Media key={index} item={{ ...item, aspect: undefined }} fit="contain" eager play="visible" className="lightbox__media" />
          </div>
          <figcaption>
            <span className="lightbox__count">
              {index! + 1} / {items.length}
            </span>
            {item.caption ?? item.alt}
          </figcaption>
        </figure>
      )}
      <button className="lightbox__btn lightbox__prev" onClick={() => go(-1)} aria-label="Previous">
        <ArrowGlyph />
      </button>
      <button className="lightbox__btn lightbox__next" onClick={() => go(1)} aria-label="Next">
        <ArrowGlyph />
      </button>
      <button className="lightbox__close" onClick={() => onIndex(null)} aria-label="Close gallery">
        ✕
      </button>
    </dialog>
  );
}
