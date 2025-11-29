import { useEffect } from 'react';

import { Outlet, useParams } from '@tanstack/react-router';

import { useAppDispatch, useAppSelector } from '#redux/hooks.tsx';
import { structureInit } from '#redux/thunks/structureInit.tsx';

import Header from './components/Header';
import MainCanvas from './components/MainCanvas';

function StructureLayout() {
  const { structureID } = useParams({ from: '/$structureID' });

  const frames = useAppSelector((state) => state.app.frames);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(structureInit(structureID));
  }, [dispatch, structureID]);

  return (
    <div className="flex h-screen w-screen flex-col [view-transition-name:page] lg:flex-row">
      <div className="flex h-1/2 w-full flex-col lg:h-full lg:w-3/5">
        <Header />
        <MainCanvas frames={frames} />
      </div>
      <Outlet />
    </div>
  );
}

export default StructureLayout;
