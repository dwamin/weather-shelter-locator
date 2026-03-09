import { JSX } from "react";

interface Shelter {
  name: string;
  address: string;
  distance: string;
}

const hotShelters: Shelter[] = [
  {
    name: "중앙도서관 무더위쉼터",
    address: "서울특별시 강남구 테헤란로 123",
    distance: "0.3km",
  },
  {
    name: "구민체육센터",
    address: "서울특별시 강남구 대치동 234",
    distance: "1.2km",
  },
];
const coldShelters: Shelter[] = [
  {
    name: "시민회관 한파쉼터",
    address: "서울특별시 강남구 역삼동 456",
    distance: "0.5km",
  },
  {
    name: "구민체육센터",
    address: "서울특별시 강남구 대치동 234",
    distance: "1.2km",
  },
];

export function ShelterTable({
  activeTab,
}: {
  activeTab: "폭염" | "한파";
}): JSX.Element {
  const shelters = activeTab === "폭염" ? hotShelters : coldShelters;

  return (
    <>
      <h3 className="text-sm font-bold text-gray-600 mb-3 px-1">
        가까운 {activeTab} 쉼터
      </h3>
      <div className="space-y-3">
        {shelters.map(({ name, address, distance }) => (
          <ShelterItem
            key={name}
            name={name}
            address={address}
            distance={distance}
            onClick={() => handleRouteClick(name)}
          />
        ))}
      </div>
    </>
  );
}
function handleRouteClick(name: string) {
  return alert(`${name} 경로 안내를 시작합니다!`);
}

function ShelterItem({
  name,
  address,
  distance,
  onClick,
}: {
  name: string;
  address: string;
  distance: string;
  onClick: () => void;
}): JSX.Element {
  return (
    <div 
    onClick={()=>alert("Hi!!!!")}
    className="flex justify-between items-center p-4 bg-white/80 rounded-2xl shadow-sm border border-emerald-100/50 transition backdrop-blur-sm">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100">
          📍
        </div>
        <div>
          <h4 className="font-bold text-[13px]">{name}</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">{address}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-[10px] text-green-600 font-extrabold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
          {distance}
        </span>
        <button
          onClick={onClick}
          className="text-[10px] bg-green-800 text-white px-3 py-1.5 rounded-lg font-bold"
        >
          ↗ 경로
        </button>
      </div>
    </div>
  );
}
