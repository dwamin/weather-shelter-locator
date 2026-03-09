'use client'
import React, { useEffect, useRef, useState } from "react";

var window:any = window || {};
const newWindow: any = window as any;

export default function MapNavigation() {
  const mapContainer = useRef<any>(null);
  const mapInstance = useRef<any>(null);
  const [subtitle, setSubtitle] = useState<any>("주변 쉼터를 찾는 중...");
  const [fontSize, setFontSize] = useState<any>(20);
  const [showWelcome, setShowWelcome] = useState<any>(true);
  const [isOffline, setIsOffline] = useState<any>(false);

  const state = useRef<any>({
    myMarker: null,
    polyline: null,
    routeSteps: [],
    lastSpokenStep: -1,
    watchId: null,
    isArrived: false,
    isRerouting: false,
    currentEndLat: 0,
    currentEndLng: 0,
    currentShelterName: "",
    openedInfowindows: [],
    selectedVoice: null as any,
  });

  const arrowImage =
    "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24'><path fill='%233301fc' d='M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z'/></svg>";

  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    state.current.selectedVoice =
      voices.find((v: any) => v.name.includes("Google") && v.lang === "ko-KR") ||
      voices.find((v: any) => v.name.includes("Yuna") && v.lang === "ko-KR") ||
      voices.find((v: any) => v.lang === "ko-KR" || v.lang.includes("ko"));
  };

  const speak = (text: string) => {
    const formattedText = text.replace(/\. /g, ".<br>");
    setSubtitle(formattedText);
    if (typeof SpeechSynthesisUtterance === "undefined") return;
    window.speechSynthesis.cancel();
    const smoothText = text
      .replace(/미터/g, " 미터, ")
      .replace(/후/g, "후,    ")
      .replace(/세요./g, "세요.    ")
      .replace(/니다./g, "니다.    ");
    const msg = new SpeechSynthesisUtterance(smoothText);
    if (!state.current.selectedVoice) loadVoices();
    if (state.current.selectedVoice) msg.voice = state.current.selectedVoice;
    msg.lang = "ko-KR";
    msg.rate = 0.8;
    window.speechSynthesis.speak(msg);
  };

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) * 1000;
  };

  const startApp = () => {
    setShowWelcome(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const locPos = newWindow.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        mapInstance.current.setCenter(locPos);
        if (!state.current.myMarker) {
          state.current.myMarker = new newWindow.kakao.maps.Marker({
            position: locPos, map: mapInstance.current,
            image: new newWindow.kakao.maps.MarkerImage("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", new newWindow.kakao.maps.Size(35, 35))
          });
        }
        speak("내 위치를 확인했습니다. 가고 싶은 쉼터를 눌러보세요.");
      });
    }
  };

  const startTracking = () => {
    if (state.current.watchId) navigator.geolocation.clearWatch(state.current.watchId);
    state.current.watchId = navigator.geolocation.watchPosition((pos) => {
      const { latitude: curLat, longitude: curLng, heading } = pos.coords;
      const locPos = newWindow.kakao.maps.LatLng(curLat, curLng);

      if (state.current.myMarker) {
        state.current.myMarker.setPosition(locPos);
      } else {
        state.current.myMarker = new newWindow.kakao.maps.Marker({
          position: locPos, map: mapInstance.current,
          image: new newWindow.kakao.maps.MarkerImage(arrowImage, new newWindow.kakao.maps.Size(40, 40), { offset: new newWindow.kakao.maps.Point(20, 20) }),
        });
      }

      const distToFinal = getDistance(curLat, curLng, state.current.currentEndLat, state.current.currentEndLng);
      if (distToFinal < 20 && !state.current.isArrived) {
        state.current.isArrived = true;
        speak(`${state.current.currentShelterName}에 잘 도착하셨습니다. 안내를 종료합니다.`);
        if (newWindow.confetti) newWindow.confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: 10001 });
        navigator.geolocation.clearWatch(state.current.watchId);
        return;
      }

      if (state.current.polyline && !state.current.isRerouting) {
        const path = state.current.polyline.getPath();
        let minDistance = Infinity;
        path.forEach((p: any) => {
          const d = getDistance(curLat, curLng, p.getLat(), p.getLng());
          if (d < minDistance) minDistance = d;
        });
        if (minDistance > 50) {
          state.current.isRerouting = true;
          speak("경로를 벗어났습니다. 현재 위치에서 다시 길을 찾습니다.");
          findRoute(state.current.currentEndLat, state.current.currentEndLng, state.current.currentShelterName);
          return;
        }
      }

      for (let i = 0; i < state.current.routeSteps.length; i++) {
        if (i <= state.current.lastSpokenStep) continue;
        const step = state.current.routeSteps[i];
        if (getDistance(curLat, curLng, step.lat, step.lng) < 40) {
          state.current.lastSpokenStep = i;
          const nextStep = state.current.routeSteps[i + 1] ? ` 그 다음은 ${state.current.routeSteps[i + 1].instruction}` : "";
          speak(`이제 ${step.instruction}${nextStep}`);
          break;
        }
      }
    }, null, { enableHighAccuracy: true });
  };

  const findRoute = (endLat: number, endLng: number, shelterName: string) => {
    state.current.openedInfowindows.forEach((iw: any) => iw.close());
    state.current.openedInfowindows = [];
    if (state.current.watchId !== null) {
      navigator.geolocation.clearWatch(state.current.watchId);
      state.current.watchId = null;
    }
    if (state.current.polyline) {
      state.current.polyline.setMap(null);
      state.current.polyline = null;
    }
    state.current.lastSpokenStep = -1;
    state.current.routeSteps = [];
    state.current.isArrived = false;
    state.current.currentEndLat = endLat;
    state.current.currentEndLng = endLng;
    state.current.currentShelterName = shelterName;

    setSubtitle("새로운 경로를 계산 중입니다...");

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: startLat, longitude: startLng } = pos.coords;
      const url = `https://router.project-osrm.org/route/v1/foot/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true&continue_straight=true`;
      fetch(url).then((res) => res.json()).then((data) => {
        if (data.code === "Ok") {
          const route = data.routes[0];
          const linePath = route.geometry.coordinates.map((c: any) => new newWindow.kakao.maps.LatLng(c[1], c[0]));
          state.current.polyline = new newWindow.kakao.maps.Polyline({ path: linePath, strokeWeight: 8, strokeColor: "#3301fc", strokeOpacity: 0.8 });
          state.current.polyline.setMap(mapInstance.current);
          route.legs[0].steps.forEach((step: any) => {
            const m = step.maneuver;
            if (m.modifier && (m.modifier.includes("u-turn") || m.modifier.includes("sharp"))) return;
            const dist = Math.round(step.distance);
            let stepText = m.type === "depart" ? "안내를 시작합니다. " : m.type === "arrive" ? "목적지 근처에 도착했습니다. " : `${dist > 10 ? dist + "미터 직진 후 " : ""}${m.modifier === "left" ? "왼쪽으로 꺾으세요" : m.modifier === "right" ? "오른쪽으로 꺾으세요" : "앞으로 이동하세요"}`;
            state.current.routeSteps.push({ lat: m.location[1], lng: m.location[0], instruction: stepText });
          });
          const bounds = new newWindow.kakao.maps.LatLngBounds();
          linePath.forEach((p: any) => bounds.extend(p));
          mapInstance.current.setBounds(bounds);
          if (!state.current.isRerouting) {
            const duration = Math.ceil(route.distance / 50);
            speak(`${shelterName}까지 안내를 시작합니다. 약 ${duration}분 정도 걸립니다.`);
          }
          state.current.isRerouting = false;
          startTracking();
        }
      });
    });
  };

  useEffect(() => {
    const handleOffline = () => { setIsOffline(true); speak("인터넷 연결이 끊어졌습니다."); };
    const handleOnline = () => { setIsOffline(false); speak("인터넷이 다시 연결되었습니다."); };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    if (window.speechSynthesis.onvoiceschanged !== undefined) window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=53573d8bf722b4bc75ea45fd95a4ed3c&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => {
      newWindow.kakao.maps.load(() => {
        mapInstance.current = new newWindow.kakao.maps.Map(mapContainer.current, { center: new newWindow.kakao.maps.LatLng(37.5665, 126.978), level: 4 });
        fetch("http://localhost:8000/api/shelters").then((res) => res.json()).then((data) => initMarkers(data));
      });
    };
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const initMarkers = (data: any[]) => {
    data.forEach((s: any) => {
      const marker = new newWindow.kakao.maps.Marker({ position: new newWindow.kakao.maps.LatLng(s.lat, s.lng), map: mapInstance.current });
      const content = document.createElement("div");
      content.style.cssText = "padding:10px; font-size:14px; color:black; min-width:150px; background:white; border-radius:8px;";
      content.innerHTML = `<strong>${s.name}</strong><br><button id="nav-btn-${s.name.replace(/\s/g, "")}" style="margin-top:10px; cursor:pointer; width:100%; height:35px; background:#4CAF50; color:white; border:none; border-radius:5px; font-weight:bold;">🚶 길안내 시작</button>`;
      const infowindow = new newWindow.kakao.maps.InfoWindow({ content: content, removable: true });
      newWindow.kakao.maps.event.addListener(marker, "click", () => {
        if (!state.current.openedInfowindows.includes(infowindow)) {
          if (state.current.openedInfowindows.length >= 3) state.current.openedInfowindows.shift().close();
          infowindow.open(mapInstance.current, marker);
          state.current.openedInfowindows.push(infowindow);
          setTimeout(() => {
            const btn = document.getElementById(`nav-btn-${s.name.replace(/\s/g, "")}`);
            if (btn) btn.onclick = () => findRoute(s.lat, s.lng, s.name);
          }, 100);
        }
      });
    });
  };

  const isPlusDisabled = fontSize >= 36;
  const isMinusDisabled = fontSize <= 16;

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {showWelcome && (
        <div style={(welcomeLayerStyle as any)}>
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>🔊</div>
          <h1 style={{ fontSize: "30px" }}>반갑습니다!</h1>
          <p style={{ fontSize: "22px" }}>안내를 위해 <b>소리를 크게</b> 키워주세요.</p>
          <button onClick={startApp} style={confirmButtonStyle}>확인했습니다</button>
        </div>
      )}
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <div style={(uiWrapperStyle as any)}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => speak(subtitle.replace(/<br>/g, ""))} style={buttonStyle}>🔄 다시듣기</button>
          <div style={{ display: "flex", gap: "5px" }}>
            <button onClick={() => setFontSize((f: number) => Math.min(36, f + 4))} disabled={isPlusDisabled} style={{ ...subButtonStyle, backgroundColor: isPlusDisabled ? "#e0e0e0" : "white" }}>글자 +</button>
            <button onClick={() => setFontSize((f: number) => Math.max(16, f - 4))} disabled={isMinusDisabled} style={{ ...subButtonStyle, backgroundColor: isMinusDisabled ? "#e0e0e0" : "white" }}>글자 -</button>
          </div>
        </div>
        <div style={{ ...subtitleBoxStyle, fontSize: `${fontSize}px`, backgroundColor: isOffline ? 
        "rgba(200, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.85)" } as any}>
          <span dangerouslySetInnerHTML={{ __html: `🔊 ${subtitle}` }} />
        </div>
      </div>
    </div>
  );
};

// --- 스타일 정의 (지민님 코드에서 빠졌던 부분들 추가) ---
const welcomeLayerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "white",
  zIndex: 10000,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  textAlign: "center",
};

const confirmButtonStyle = {
  marginTop: "30px",
  padding: "20px 50px",
  fontSize: "24px",
  background: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "15px",
  fontWeight: "bold",
  cursor: "pointer",
};

const uiWrapperStyle = {
  position: "absolute",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "90%",
  zIndex: 999,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const buttonStyle = {
  padding: "12px",
  background: "#FF9800",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
};

const subButtonStyle = {
  padding: "12px 18px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
};

const subtitleBoxStyle = {
  color: "white",
  padding: "20px",
  borderRadius: "15px",
  textAlign: "center",
  minHeight: "80px",
  transition: "background 0.3s ease",
};
