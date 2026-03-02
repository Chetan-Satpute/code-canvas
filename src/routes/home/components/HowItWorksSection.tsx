function HowItWorksSection() {
  return (
    <section className="bg-neutral-900 px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-16 text-center text-2xl lg:text-3xl font-semibold tracking-tight">
          How Code Canvas Works
        </h2>

        <div className="space-y-20">
          {/* STEP 1 */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="font-semibold tracking-wide text-blue-500">
                01
              </span>
              <h3 className="mt-3 text-2xl font-semibold">
                Choose a Data Structure
              </h3>
              <p className="mt-4 leading-relaxed text-neutral-400">
                Start by selecting a structure you want to explore. Each
                structure contains operations you can execute step-by-step.
              </p>
            </div>

            <div className="">
              <div className="relative flex h-full w-full flex-col justify-between rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-900 p-6 text-left opacity-90 shadow-sm ring-2 ring-blue-400/40">
                <div className="flex-1">
                  <h2 className="mb-2 text-xl font-bold">Array</h2>
                  <p className="text-base text-neutral-300">
                    An array is a fixed-size collection of elements stored in
                    order, where each element can be accessed directly by its
                    index.
                  </p>
                </div>

                <div className="mt-4 flex items-center text-blue-400 opacity-80">
                  <span className="mr-1 text-sm font-medium">Explore</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M13 6l6 6-6 6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="font-semibold tracking-wide text-blue-500">
                02
              </span>
              <h3 className="mt-3 text-2xl font-semibold">
                Provide Input & Choose Execution Mode
              </h3>

              <p className="mt-4 leading-relaxed text-neutral-400">
                Enter values for the operation.
                <span className="font-medium text-white"> Run </span>
                executes instantly without animation.
                <span className="font-medium text-white"> Play </span>
                animates the algorithm step-by-step.
              </p>
            </div>

            <div className="">
              <div className="rounded-xl border border-neutral-700/40 bg-neutral-800/70 p-4 opacity-95 backdrop-blur-md">
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-medium tracking-wide text-neutral-100">
                    Insert Value
                  </h3>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-neutral-300">index</label>
                      <input
                        disabled
                        value="2"
                        className="rounded-lg border border-neutral-600 bg-neutral-700/60 px-2 py-1 text-sm text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-neutral-300">value</label>
                      <input
                        disabled
                        value="10"
                        className="rounded-lg border border-neutral-600 bg-neutral-700/60 px-2 py-1 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex justify-end gap-2">
                    {/* Run Button */}
                    <div className="flex flex-1 items-center justify-center gap-3 rounded-lg border border-white/10 bg-gradient-to-b from-white/10 to-white/5 px-3 py-2 text-sm font-medium text-neutral-200 opacity-90">
                      <span>Run</span>
                    </div>

                    {/* Play Button */}
                    <div className="flex flex-1 items-center justify-center gap-3 rounded-lg border border-blue-500/20 bg-gradient-to-b from-blue-600/30 to-blue-500/20 px-3 py-2 text-sm font-medium text-white">
                      <span>Play</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="font-semibold tracking-wide text-blue-500">
                03
              </span>
              <h3 className="mt-3 text-2xl font-semibold">
                Execute One Line at a Time
              </h3>

              <p className="mt-4 leading-relaxed text-neutral-400">
                Press <span className="font-medium text-white">Next Step</span>{' '}
                to execute the next line of code. The active line is highlighted
                so you can clearly follow the algorithm’s logic.
              </p>
            </div>

            <div className="max-w-xl">
              <aside className="flex flex-col overflow-hidden rounded-lg bg-neutral-800 ring-1 ring-white/5">
                {/* Controls */}
                <div className="flex">
                  <div className="flex flex-1 items-center justify-center gap-2 rounded-r-none border border-neutral-600/40 bg-neutral-700/40 px-3 py-1.5 text-sm font-medium text-neutral-200">
                    Close
                  </div>

                  <div className="flex flex-1 items-center justify-center gap-2 rounded-l-none border border-neutral-600/40 bg-neutral-700/40 px-3 py-1.5 text-sm font-medium text-neutral-200">
                    <span className="relative flex size-3 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex size-2 rounded-full bg-blue-500"></span>
                    </span>
                    Next Step
                  </div>
                </div>

                {/* Code Block */}
                <pre className="overflow-auto py-3 text-xs">
                  <code className="size-min min-w-full">
                    <div className="size-min min-w-full px-2 py-px">
                      <span style={{ color: 'rgb(199, 146, 234)' }}>
                        function
                      </span>
                      <span style={{ color: 'rgb(238, 255, 255)' }}> </span>
                      <span style={{ color: 'rgb(130, 170, 255)' }}>
                        mergeSort
                      </span>
                      <span style={{ color: 'rgb(137, 221, 255)' }}>(</span>
                      <span style={{ color: 'rgb(137, 221, 255)' }}>)</span>
                      <span style={{ color: 'rgb(238, 255, 255)' }}> </span>
                      <span style={{ color: 'rgb(137, 221, 255)' }}>{'{'}</span>
                    </div>

                    <div className="size-min min-w-full px-2 py-px">
                      <span style={{ color: 'rgb(137, 221, 255)' }}> </span>
                      <span style={{ color: 'rgb(84, 84, 84)' }}>
                        // code ...
                      </span>
                    </div>

                    {/* Highlighted execution line */}
                    <div className="size-min min-w-full bg-gradient-to-r from-white/20 to-transparent px-2 py-px">
                      <span style={{ color: 'rgb(240, 113, 120)' }}> </span>
                      <span style={{ color: 'rgb(199, 146, 234)' }}>const</span>
                      <span style={{ color: 'rgb(240, 113, 120)' }}> </span>
                      <span style={{ color: 'rgb(238, 255, 255)' }}>right</span>
                      <span style={{ color: 'rgb(240, 113, 120)' }}> </span>
                      <span style={{ color: 'rgb(137, 221, 255)' }}>=</span>
                      <span style={{ color: 'rgb(240, 113, 120)' }}> </span>
                      <span style={{ color: 'rgb(238, 255, 255)' }}>array</span>
                      <span style={{ color: 'rgb(137, 221, 255)' }}>.</span>
                      <span style={{ color: 'rgb(130, 170, 255)' }}>slice</span>
                      <span style={{ color: 'rgb(240, 113, 120)' }}>(</span>
                      <span style={{ color: 'rgb(238, 255, 255)' }}>mid</span>
                      <span style={{ color: 'rgb(240, 113, 120)' }}>)</span>
                      <span style={{ color: 'rgb(137, 221, 255)' }}>;</span>
                    </div>

                    <div className="size-min min-w-full px-2 py-px">
                      <span style={{ color: 'rgb(137, 221, 255)' }}> </span>
                      <span style={{ color: 'rgb(84, 84, 84)' }}>
                        // code ...
                      </span>
                    </div>

                    <div className="size-min min-w-full px-2 py-px">
                      <span style={{ color: 'rgb(137, 221, 255)' }}>{'}'}</span>
                    </div>
                  </code>
                </pre>
              </aside>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="font-semibold text-blue-500">04</span>
              <h3 className="mt-2 text-2xl font-medium">See Execution</h3>
              <p className="mt-4 text-neutral-400">
                Watch how data structures evolve as each line executes.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-700/40 bg-neutral-800/70 p-6 backdrop-blur-md">
              <div className="flex gap-4 justify-around">
                <div className="h-10 w-10 rounded bg-blue-500/30"></div>
                <div className="h-10 w-10 rounded bg-blue-500/50"></div>
                <div className="h-10 w-10 rounded bg-blue-500/70"></div>
                <div className="h-10 w-10 rounded bg-blue-500/30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
