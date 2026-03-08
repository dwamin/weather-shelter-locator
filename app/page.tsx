"use client";

import { ShelterTable } from "@/components/ShelterTable";
import { useState, JSX } from "react";
const weathers = ["폭염", "한파"] as const;
type Weather = (typeof weathers)[number];

export default function WeatherShelterPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<Weather>("폭염");

  const handleSettingsClick = () => alert("설정 메뉴입니다.");
  const handleLoginClick = () => alert("로그인 페이지는 준비 중입니다.");

  return (
    <div className="max-w-md mx-auto bg-emerald-50 min-h-screen pb-24 font-sans text-gray-900 shadow-2xl relative">
      {/* 상단 헤더 */}
      <header className="flex justify-between items-center p-4 bg-white/95 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          O
        </div>
        <h1 className="font-bold text-lg">쉴라잡이</h1>
        <button
          onClick={handleSettingsClick}
          className="text-gray-500 p-2 hover:bg-emerald-100 rounded-full transition"
        >
          ⚙️
        </button>
      </header>

      {/* 메인 날씨 카드 */}
      <section
        className={`m-4 p-6 rounded-3xl text-white shadow-lg transition-all duration-500 ${
          activeTab === "폭염"
            ? "bg-gradient-to-br from-orange-500 to-red-600"
            : "bg-gradient-to-br from-blue-500 to-indigo-700"
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="text-3xl">
              {activeTab === "폭염" ? "🌡️" : "❄️"}
            </span>
            <div>
              <h2 className="text-xl font-bold">{activeTab} 주의보</h2>
              <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                Live
              </span>
            </div>
          </div>
          <button className="text-white/70">⚠️</button>
        </div>

        <div className="mt-6 text-center">
          <h3 className="text-6xl font-light tracking-tighter">
            {activeTab === "폭염" ? "36" : "-10"}
            <span className="text-3xl ml-1">°C</span>
          </h3>
          <p className="mt-2 text-white/90 text-sm leading-relaxed">
            {activeTab === "폭염"
              ? "매우 무더운 날씨입니다. 충분한 수분을 섭취하세요."
              : "매우 추운 날씨입니다. 장시간 실외 활동을 자제하세요."}
          </p>
        </div>

        {/* 기상 상세 정보 그리드 */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <WeatherInfoItem
            label="습도"
            value={activeTab === "폭염" ? "65%" : "30%"}
            icon="💧"
          />
          <WeatherInfoItem
            label="풍속"
            value={activeTab === "폭염" ? "1.2m/s" : "5.4m/s"}
            icon="🚩"
          />
          <WeatherInfoItem label="미세먼지" value="45µg/m²" icon="💨" />
          <WeatherInfoItem
            label="강수량"
            value={activeTab === "폭염" ? "0mm" : "2.5mm"}
            icon="☔"
          />
        </div>

        {/* 📈 [신규] 시간별 기온 변화 그래프 껍데기 */}
        <div className="mt-8 p-4 bg-black/10 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[11px] font-bold text-white/80">
              시간별 기온 변화
            </p>
            <p className="text-[10px] text-white/60">단위: °C</p>
          </div>

          {/* 그래프 가이드라인 및 데이터 공간 */}
          <div className="h-24 w-full flex items-end justify-between px-1 relative">
            {/* 가로 점선 가이드 (CSS로 구현) */}
            <div className="absolute inset-0 flex flex-col justify-between py-1 opacity-20 pointer-events-none">
              <div className="border-t border-white border-dashed w-full h-0"></div>
              <div className="border-t border-white border-dashed w-full h-0"></div>
              <div className="border-t border-white border-dashed w-full h-0"></div>
            </div>

            {/* 샘플 데이터 막대 (나중에 Recharts 등으로 대체) */}
            {[28, 32, 36, 35, 33, 30].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 z-10">
                <div
                  className="w-1.5 bg-white/40 rounded-full transition-all duration-1000"
                  style={{ height: `${(val / 40) * 60}px` }}
                />
                <span className="text-[8px] text-white/80">
                  {10 + idx * 2}시
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 탭 버튼 */}
      <div className="flex px-4 gap-3 mb-6">
        {weathers.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === tab
                ? "bg-green-800 text-white shadow-md scale-[1.02]"
                : "bg-white border border-gray-200 text-gray-400 hover:bg-emerald-50"
            }`}
          >
            {tab}모드
          </button>
        ))}
      </div>

      {/* 쉼터 리스트 섹션 */}
      <section className="px-4">
        <ShelterTable activeTab={activeTab} />
      </section>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-emerald-100 flex justify-around py-3">
        <NavItem
          label="지도"
          icon="🗺️"
          active={false}
          onClick={() => alert("지도 준비 중")}
        />
        <NavItem
          label="홈"
          icon="🏠"
          active={true}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <NavItem
          label="로그인"
          icon="👤"
          active={false}
          onClick={handleLoginClick}
        />
      </nav>
    </div>
  );
}

// --- 하위 컴포넌트 ---
function WeatherInfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}): JSX.Element {
  return (
    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-[11px] text-white/70 mb-1">
        <span>{icon}</span> {label}
      </div>
      <div className="text-xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

function NavItem({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 flex-1 ${active ? "text-green-700" : "text-gray-400"}`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}
