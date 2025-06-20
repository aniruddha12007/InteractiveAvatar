"use client";

import { useEffect, useRef, useMemo, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./ScrollReveal.css";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollRevealProps {
  children: ReactNode;
  /** Optional external scroll container ref (e.g., for a custom scroll area) */
  scrollContainerRef?: React.RefObject<HTMLElement>;
  /** Apply opacity animation starting at this base value */
  baseOpacity?: number;
  /** Apply initial rotation in degrees */
  baseRotation?: number;
  /** Enable blur animation */
  enableBlur?: boolean;
  /** Blur amount in pixels when animation starts */
  blurStrength?: number;
  /** Extra classes for container */
  containerClassName?: string;
  /** Extra classes for text wrapper */
  textClassName?: string;
  /** ScrollTrigger end value for the rotation animation */
  rotationEnd?: string;
  /** ScrollTrigger end value for word/blur animation */
  wordAnimationEnd?: string;
}

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  // Split plain-string children into span.word elements so each word animates
  const splitText = useMemo(() => {
    if (typeof children !== "string") return children;
    return (children as string).split(/(\s+)/).map((word, idx) => {
      if (/^\s+$/.test(word)) return word;
      return (
        <span key={idx} className="word">
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current ?? undefined;

    // rotation/parallax effect
    gsap.fromTo(
      el,
      { transformOrigin: "0% 50%", rotate: baseRotation },
      {
        ease: "none",
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: "top bottom",
          end: rotationEnd,
          scrub: true,
        },
      }
    );

    // Target word spans if present
    const wordEls = el.querySelectorAll<HTMLElement>(".word");

    if (wordEls.length) {
      // opacity
      gsap.fromTo(
        wordEls,
        { opacity: baseOpacity, willChange: "opacity" },
        {
          ease: "none",
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom-=20%",
            end: wordAnimationEnd,
            scrub: true,
          },
        }
      );

      if (enableBlur) {
        gsap.fromTo(
          wordEls,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top bottom-=20%",
              end: wordAnimationEnd,
              scrub: true,
            },
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <span className={`scroll-reveal-text ${textClassName}`}>{splitText}</span>
    </h2>
  );
}
