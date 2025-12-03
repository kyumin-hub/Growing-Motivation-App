import React from 'react';
import { FileText, Heart, User, Star } from 'lucide-react';

export const ProjectPlan: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 p-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
        <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" />
          앱 기획안: 작은 새싹 (Little Sprout)
        </h2>
        <p className="text-stone-600 mb-4">
          요청하신 내용을 바탕으로 작성된 기획안입니다. 이 앱은 현재 이 기획안의 <strong>프로토타입</strong>으로 동작하고 있습니다.
        </p>

        <div className="space-y-6">
          <section>
            <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
              1. 앱 이름과 컨셉
            </h3>
            <ul className="list-disc list-inside space-y-2 text-stone-700 text-sm pl-2">
              <li>
                <strong>작은 새싹 (Little Sprout):</strong> 
                <span className="block pl-5 text-stone-500">아무리 작은 행동이라도 생명력이 있다는 뜻. 나의 작은 움직임이 새싹을 틔웁니다.</span>
              </li>
              <li>
                <strong>온기 (Warmth):</strong> 
                <span className="block pl-5 text-stone-500">서로의 체온을 나누듯, 부담 없이 따뜻한 마음만 주고받는 방.</span>
              </li>
              <li>
                <strong>오늘의 1센치 (1cm Today):</strong> 
                <span className="block pl-5 text-stone-500">거창한 목표 대신, 오늘 딱 1cm만 나아가도 충분하다는 의미.</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4" />
              2. 핵심 기능
            </h3>
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-xl">
                <p className="font-medium text-green-900">🌱 마이크로 미션 (Micro-Missions)</p>
                <p className="text-xs text-green-800 mt-1">
                  "물 마시기", "이불 개기" 등 1분 안에 끝나는 아주 쉬운 미션을 제공합니다. 성공 시 즉각적인 시각적 보상(꽃가루, 경험치)을 주어 성취감을 느낄 수 있습니다.
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <p className="font-medium text-green-900">🪴 반려 식물 키우기 (Gamification)</p>
                <p className="text-xs text-green-800 mt-1">
                  나의 활동 에너지로 가상의 식물이 자랍니다. 씨앗에서 나무까지 성장하는 과정을 보며 '나도 자라고 있다'는 감각을 시각화합니다.
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <p className="font-medium text-green-900">💌 무해한 응원 (Warm AI)</p>
                <p className="text-xs text-green-800 mt-1">
                  "왜 안 했어?"라는 핀잔 대신, AI가 사용자의 기분에 맞춰 "오늘은 쉬어도 괜찮아요", "정말 대단해요!" 같은 따뜻한 말을 건넵니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              3. 사용자 시나리오 (30일의 변화)
            </h3>
            <div className="text-sm text-stone-700 space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <p><strong>D+1:</strong> 무기력하게 누워있던 A씨. '물 한 잔 마시기' 미션을 체크하자 화면 속 씨앗이 꿈틀거립니다. "잘했어요!"라는 문구에 희미한 미소를 짓습니다.</p>
              <p><strong>D+7:</strong> 매일 작은 미션을 하다 보니 어느새 씨앗이 떡잎이 되었습니다. "내 방에도 식물을 키워볼까?" 하는 생각이 듭니다.</p>
              <p><strong>D+15:</strong> 익명 게시판에 "오늘 처음 산책 나갔어"라고 썼더니, 모르는 사람들이 하트를 보내줍니다. 혼자가 아니라는 느낌을 받습니다.</p>
              <p><strong>D+30:</strong> 앱 속의 나무가 꽃을 피웠습니다. A씨는 이제 앱 없이도 스스로 이불을 개고, 도서관에 갈 준비를 합니다. 작은 성취가 모여 일상을 움직이는 힘이 되었습니다.</p>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              4. 차별점
            </h3>
            <ul className="text-sm text-stone-700 space-y-2">
              <li>
                <span className="text-red-500 font-bold">X 기존 앱:</span> 경쟁 유도, 랭킹 시스템, 실패 시 패널티, "더 열심히 해!"라는 압박.
              </li>
              <li>
                <span className="text-green-600 font-bold">O 작은 새싹:</span> 경쟁 없음, 실패 없음, 오직 칭찬과 위로. 하지 않아도 괜찮다고 말해주는 여유.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};