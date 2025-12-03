import React from 'react';
import { PlantStage } from '../types';
import { Sprout, Flower, Trees, Leaf, CircleDashed } from 'lucide-react';

interface PlantProps {
  stage: PlantStage;
  xp: number;
}

export const Plant: React.FC<PlantProps> = ({ stage, xp }) => {
  const getIcon = () => {
    switch (stage) {
      case PlantStage.SEED:
        return <CircleDashed className="w-32 h-32 text-amber-700 opacity-60" strokeWidth={1} />;
      case PlantStage.SPROUT:
        return <Sprout className="w-32 h-32 text-green-400 animate-bounce-slow" strokeWidth={1.5} />;
      case PlantStage.SAPLING:
        return <Leaf className="w-40 h-40 text-green-500" strokeWidth={1.5} />;
      case PlantStage.FLOWER:
        return <Flower className="w-48 h-48 text-pink-400" strokeWidth={1.5} />;
      case PlantStage.TREE:
        return <Trees className="w-56 h-56 text-green-700" strokeWidth={1.5} />;
      default:
        return <CircleDashed className="w-32 h-32 text-gray-300" />;
    }
  };

  const getMessage = () => {
    switch (stage) {
      case PlantStage.SEED: return "아직은 씨앗이지만, 곧 자라날 거예요.";
      case PlantStage.SPROUT: return "빼꼼! 작은 새싹이 돋아났어요.";
      case PlantStage.SAPLING: return "줄기가 튼튼해지고 있어요!";
      case PlantStage.FLOWER: return "와! 아름다운 꽃이 피었어요.";
      case PlantStage.TREE: return "이제 든든한 나무가 되었네요.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 transition-all duration-700">
      <div className="relative">
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/10 blur-xl rounded-full"></div>
        <div className="transform transition-transform duration-500 hover:scale-105">
            {getIcon()}
        </div>
      </div>
      <p className="mt-6 text-lg text-stone-600 font-medium hand-font text-2xl animate-pulse">
        {getMessage()}
      </p>
      <div className="mt-4 w-48 bg-stone-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-green-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${(xp % 100)}%` }}
        ></div>
      </div>
      <p className="text-xs text-stone-400 mt-1">성장까지 {100 - (xp % 100)} 사랑 남음</p>
    </div>
  );
};