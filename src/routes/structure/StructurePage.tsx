import Aside from './components/Aside';
import Header from './components/Header';
import MainCanvas from './components/MainCanvas';

function StructurePage() {
  return (
    <div className="flex h-screen w-screen flex-col [view-transition-name:page] lg:flex-row">
      <div className="flex h-1/2 w-full flex-col lg:h-full lg:w-3/5">
        <Header />
        <MainCanvas frames={[]} />
      </div>
      <Aside />
    </div>
  );
}

export default StructurePage;
