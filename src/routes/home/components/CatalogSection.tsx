import { getCatalog } from '#utils/algorithms.ts';

import StructureSection from './StructureSection.tsx';

function CatalogSection() {
  const catalog = getCatalog();

  return (
    <section
      id="catalog"
      className="border-border/60 scroll-mt-16 border-t border-b"
    >
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20 lg:px-10 lg:py-24">
        <header className="max-w-2xl">
          <h2 className="font-en-display text-foreground text-2xl font-semibold sm:text-3xl lg:text-4xl">
            Pick a structure, then an algorithm
          </h2>

          <p className="font-en text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
            Each one opens on the same canvas, where you shape the structure
            first and then step through the code against it. The algorithms
            marked{' '}
            <span className="font-code text-muted-foreground text-sm">
              soon
            </span>{' '}
            show their code and structure while the engine catches up with them;
            every other one runs on it today.
          </p>
        </header>

        <div className="mt-10 flex flex-col gap-10 sm:mt-14 sm:gap-14">
          {catalog.map((section) => (
            <StructureSection
              key={section.structure.id}
              structure={section.structure}
              algorithms={section.algorithms}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CatalogSection;
