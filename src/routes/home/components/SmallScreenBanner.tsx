function SmallScreenBanner() {
  return (
    <div className="my-8 block flex flex-col items-center justify-center text-center lg:hidden">
      <div className="flex items-center gap-2 text-neutral-400">
        <span className="h-3 w-3 rounded-sm bg-blue-400" />
        <span className="text-sm font-bold">You’re on a small screen</span>
      </div>

      <p className="text-sm text-neutral-500">
        For the best learning experience, we recommend using a laptop or tablet.
      </p>
    </div>
  );
}

export default SmallScreenBanner;
