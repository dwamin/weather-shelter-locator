"use client";

import { useState } from "react";

// 1. PTY 변수 타입 정의 (0: 화창, 1: 비, 2: 눈, 3: 흐림)
type PTYType = 0 | 1 | 2 | 3;

export default function WeatherShelterPage() {
  const [temp, setTemp] = useState(9); // 현재 기온 예시 (쌀쌀함 구간)
  const [pty, setPty] = useState<PTYType>(0); // 2. 현재 PTY 상태 관리 (기본값: 화창함)
  const [showDetail, setShowDetail] = useState(false);

  // 온도별 배경색 설정
  const getBgColor = (t: number) => {
    if (t >= 33) return "from-red-600 to-red-800";
    if (t >= 25) return "from-orange-400 to-red-500";
    if (t >= 15) return "from-green-600 to-emerald-700";
    if (t >= 0)  return "from-cyan-400 to-blue-500";
    return "from-blue-700 to-indigo-900";
  };

  // 3. [업데이트] PTY와 온도를 조합하여 상세 데이터 반환
  const getStatusData = (t: number, p: PTYType) => {
    // PTY에 따른 아이콘 및 타이틀 설정
    const ptyData = {
      0: { title: "화창함", icon: "https://cdn-icons-png.flaticon.com/128/869/869869.png" }, // 태양
      1: { title: "비", icon: "https://cdn-icons-png.flaticon.com/128/3313/3313888.png" },     // 비구름
      2: { title: "눈", icon: "https://cdn-icons-png.flaticon.com/128/2315/2315302.png" },     // 눈사람
      3: { title: "흐림", icon: "https://cdn-icons-png.flaticon.com/128/1146/1146869.png" },     // 구름
    };

    // 온도에 따른 기본 메시지 설정
    let desc = "";
    if (t >= 33) desc = "극심한 폭염입니다! 야외 활동을 중단하세요.";
    else if (t >= 25) desc = "무더운 날씨입니다. 수분을 충분히 섭취하세요.";
    else if (t >= 15) desc = "활동하기 딱 좋은 날씨입니다.";
    else if (t >= 0)  desc = "쌀쌀한 날씨입니다. 옷차림에 신경 쓰세요.";
    else desc = "강력한 한파입니다! 체온 유지에 유의하세요.";

    return {
      title: ptyData[p].title,
      iconUrl: ptyData[p].icon,
      desc: desc
    };
  };

  const status = getStatusData(temp, pty);

  return (
    <div className="max-w-md mx-auto bg-emerald-50 min-h-screen pb-24 font-sans text-gray-900 shadow-2xl relative">
      
      {/* 상단 헤더 */}
      <header className="flex justify-between items-center p-4 bg-white/95 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">O</div>
          <h1 className="font-bold text-lg">쉴라잡이</h1>
        </div>
        <button className="text-gray-500 p-2 hover:bg-emerald-100 rounded-full transition">⚙️</button>
      </header>

      {/* 메인 날씨 카드 */}
      <section className={`m-4 p-6 rounded-3xl text-white shadow-lg transition-all duration-700 bg-gradient-to-br ${getBgColor(temp)}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {/* 4. 상태 타이틀 및 테스트 버튼 배치 조정 */}
            <div>
              <h2 className="text-xl font-bold">{status.title}</h2>
              <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Live</span>
            </div>
          </div>
          
          {/* 테스트 버튼 영역 (온도 및 PTY 조절) */}
          <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-1">
              <button onClick={() => setTemp(temp - 5)} className="bg-white/20 px-2 py-1 rounded text-xs active:scale-95 transition">-5°</button>
              <button onClick={() => setTemp(temp + 5)} className="bg-white/20 px-2 py-1 rounded text-xs active:scale-95 transition">+5°</button>
            </div>
            {/* PTY 변경 테스트 버튼 */}
            <select 
              value={pty} 
              onChange={(e) => setPty(Number(e.target.value) as PTYType)}
              className="bg-white/20 text-xs px-2 py-1 rounded text-white border-none outline-none appearance-none cursor-pointer"
            >
              <option value={0} className="text-gray-900">화창</option>
              <option value={1} className="text-gray-900">비</option>
              <option value={2} className="text-gray-900">눈</option>
              <option value={3} className="text-gray-900">흐림</option>
            </select>
          </div>
        </div>

        {/* 5. [핵심 수정] 기온 바로 옆에 PTY 이미지 배치 */}
        <div className="mt-8 text-center flex items-center justify-center gap-4">
          <h3 className="text-7xl font-light tracking-tighter">
            {temp}<span className="text-4xl ml-1">°C</span>
          </h3>
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm p-3">
            <img 
              src={status.iconUrl} 
              alt={status.title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <p className="mt-6 text-center text-white/90 text-sm leading-relaxed h-10">{status.desc}</p>

        {/* 기상 상세 정보 그리드 */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <WeatherInfoItem label="습도" value={pty === 1 ? "90%" : "45%"} icon="💧" />
          <WeatherInfoItem label="풍속" value={pty === 2 ? "6.5m/s" : "2.1m/s"} icon="🚩" />
          <WeatherInfoItem label="미세먼지" value="보통" icon="💨" />
          <button 
            onClick={() => setShowDetail(true)}
            className="bg-white/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/30 transition flex flex-col items-start"
          >
            <div className="flex items-center gap-1.5 text-[11px] text-white/70 mb-1">
              <span>🔍</span> 상세보기
            </div>
            <div className="text-sm font-bold tracking-tight">내일 날씨 보기</div>
          </button>
        </div>

        {/* 일일 기온 변화 그래프 */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-[11px] font-bold text-white/80 mb-4">일일 기온 변화</p>
          <div className="flex justify-between items-end h-16 px-1">
            {[temp-2, temp, temp+4, temp+6, temp+2, temp].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div 
                  className="w-1.5 bg-white/60 rounded-full transition-all duration-1000" 
                  style={{ height: `${((h + 10) / 50) * 100}%` }} // 온도 범위에 맞춰 그래프 높이 조절
                ></div>
                <span className="text-[9px] text-white/60">{6 + i * 3}시</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 쉼터 리스트 섹션 */}
      <section className="px-4 mt-8">
        <h3 className="text-sm font-bold text-gray-600 mb-3 px-1">가까운 대피 시설</h3>
        <div className="space-y-3">
          <ShelterItem name={temp >= 25 ? "무더위 쉼터" : "한파 쉼터"} address="테헤란로 123" distance="0.3km" />
          <ShelterItem name="구민 체육 센터" address="대치동 234" distance="1.2km" />
        </div>
      </section>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-emerald-100 flex justify-around py-3">
        <NavItem label="지도" icon="🗺️" active={false} />
        <NavItem label="홈" icon="🏠" active={true} />
        <NavItem label="로그인" icon="👤" active={false} />
      </nav>

      {/* 내일 날씨 상세보기 모달 */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl scale-in-center transition-all">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">📅 내일 날씨 예보</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-500">오전</span>
                <span className="font-bold text-blue-500 text-lg">10°C 💧</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-500">오후</span>
                <span className="font-bold text-orange-500 text-lg">18°C ☁️</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">내일은 오전에 비가 예상되며 오후에는 흐린 날씨가 이어지겠습니다.</p>
            </div>
            <button 
              onClick={() => setShowDetail(false)}
              className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-bold"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 하위 컴포넌트들 (변경 없음) ---
function WeatherInfoItem({ label, value, icon }: { label: string, value: string, icon: string }) {
  return (
    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-[11px] text-white/70 mb-1">
        <span>{icon}</span> {label}
      </div>
      <div className="text-xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

function ShelterItem({ name, address, distance }: { name: string, address: string, distance: string }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white/80 rounded-2xl shadow-sm border border-emerald-100/50">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100">📍</div>
        <div>
          <h4 className="font-bold text-[13px]">{name}</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">{address}</p>
        </div>
      </div>
      <span className="text-[10px] text-green-600 font-extrabold bg-green-50 px-2 py-0.5 rounded-full">{distance}</span>
    </div>
  );
}

function NavItem({ label, icon, active }: { label: string, icon: string, active: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 flex-1 ${active ? 'text-green-700' : 'text-gray-400'}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}
