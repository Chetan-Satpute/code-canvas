import { Link } from '@tanstack/react-router';

import Icon from '#components/Icon.tsx';
import algorithms from '#constants/algorithms.ts';
import cn from '#utils/cn.ts';

import { useMediaQuery } from '../hooks/useMediaQuery.ts';
import HeroPreview from './HeroPreview.tsx';

// The hero demonstrates one algorithm end to end, so the illustration and the
// call to action beside it have to name the same one. Curated rather than
// derived from the catalog: the illustration is drawn around this algorithm.
const featured = algorithms['array-linear-search'];

const ctaClasses =
  'font-en inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border px-6 text-base font-semibold sm:w-auto transition duration-150 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px active:scale-[0.98]';

const primaryCtaClasses =
  'border-transparent bg-primary text-primary-foreground hover:bg-primary-hover';

const secondaryCtaClasses =
  'border-border text-foreground hover:border-muted-foreground hover:bg-surface-2';

function HeroSection() {
  // The canvas draws at fixed pixel sizes rather than scaling to its box, so
  // on a phone the array is cut off at the right edge instead of fitting. The
  // preview is therefore left out below md entirely — not mounted and hidden,
  // which would keep an invisible run stepping and repainting a canvas.
  const showPreview = useMediaQuery('(min-width: 48rem)');

  return (
    <section className="relative overflow-hidden">
      {/* Glows behind the headline, so the lit canvas panel on the right is not
          the only thing on the page carrying light. The canvas draws a dot
          grid of its own, which is why nothing else here lays one down. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 size-[32rem] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]"
      />

      <div
        aria-hidden
        className="bg-sapphire-500/10 pointer-events-none absolute top-20 -right-40 size-[28rem] rounded-full blur-[130px]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-28">
        <div>
          <span className="border-border bg-surface-1 text-muted-foreground font-en inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <span className="bg-accent size-1.5 rounded-full" />
            Interactive algorithm visualizer
          </span>

          <h1 className="font-en-display text-foreground mt-6 text-3xl leading-tight font-bold sm:text-5xl lg:text-6xl">
            Watch algorithms run, one line at a time.
          </h1>

          <p className="font-en text-muted-foreground mt-5 max-w-xl text-base leading-relaxed sm:mt-6 sm:text-lg">
            Code Canvas steps through a data structure algorithm the way a
            debugger would. The highlighted line, the call stack, and the
            structure on the canvas all move together — so a loop stops being
            something you trace in your head.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <Link
              to="/$algorithmId"
              params={{ algorithmId: featured.id }}
              className={cn(ctaClasses, primaryCtaClasses)}
            >
              <Icon name="play" />
              Play {featured.title}
            </Link>

            <a href="#catalog" className={cn(ctaClasses, secondaryCtaClasses)}>
              Browse algorithms
              <Icon name="arrow-right" />
            </a>
          </div>

          <p className="font-en text-muted-foreground mt-6 text-sm">
            Free and open source. Nothing to install, nothing to sign up for.
          </p>

          {/* The canvas, code, and call stack share one screen, which a phone
              cannot give all three at once. */}
          <p className="border-border/60 text-muted-foreground font-en mt-6 border-l-2 pl-4 text-sm leading-relaxed lg:hidden">
            You are on a small screen. Everything here works, but the visualizer
            has a lot to show at once — a laptop gives it the room it wants.
          </p>
        </div>

        {showPreview && <HeroPreview listing={featured.listing} />}
      </div>
    </section>
  );
}

export default HeroSection;
