import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useMqttState } from "~/@mqtt-react-hooks";
import useSocket from "~/components/useSocket";


import { AppContext, IVideoInfo } from "~/components/AppContext";
import { MQTT_TOPICS, ROLES, SOCKET_TOPICS } from "~/lib/constants";
import { motion } from "framer-motion";

import markBox from "/public/ck-mark-box.svg";
import Terms from "~/components/Terms";


const InitiatorAcknowledge = () => {
  const [showTerms, setShowTerms] = useState(false);

  const navigate = useNavigate();
  const { client } = useMqttState();
  const { boothInfo, updateBoothInfo, videoInfo, updateVideoInfo } = useContext(AppContext);

  const [socket, isLoading, error, addListener, emitMessage] = useSocket();

  const ageArray = Array.from({ length: 63 }, (_, i) => i + 18);

  //get role from url

  useEffect(() => {
    //console.log(videoInfo);
    if (socket && socket.connected && !videoInfo.sessionId) {
      //console.log("emitting get token");
      emitMessage("GET_TOKEN");
    }
  }, [socket, emitMessage]);

  const history = useNavigate();

  useEffect(() => {
    prepareForCall();
  }, []);

  useEffect(() => {
    if (socket) {
      const _onTokenRcvd = addListener(SOCKET_TOPICS.__TOKEN, onTokenReceived);

      return () => {
        _onTokenRcvd();
      };
    }
  }, [socket, addListener]);

  const onTokenReceived = (sessionToken: { session_id: string; token: string }) => {
    //console.log("token recieved", sessionToken);
    const { session_id: sessionId, token } = sessionToken;

    const videoInfo: IVideoInfo = {
      sessionId,
      token,
      incomming_sessionId: sessionId,
      incomming_token: token,
      status: "ringing",
      initiator: boothInfo?.mac,
      receiver: "",
    };
    //update video info context
    updateVideoInfo(videoInfo);

    //publish video info to mqtt
    const payload = {
      ...videoInfo,
    };



    console.log("updating booth info to publisher");
    updateBoothInfo({ ...boothInfo, role: "publisher" });

    client?.publish(MQTT_TOPICS.CALL_RING, JSON.stringify(payload));
  };

  const prepareForCall = () => {
    if (!videoInfo.sessionId) return;

    const payload = {
      ...videoInfo,
    };

    client?.publish(MQTT_TOPICS.CALL_RING, JSON.stringify(payload));
  };

  const onNext = () => {
    client?.publish(
      MQTT_TOPICS.CALL_CONNECTING,
      JSON.stringify({ ...videoInfo, status: videoInfo.status === "connecting" ? "connected" : "connecting" })
    );

    navigate(`/start/call`);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <motion.img
        initial={{ x: -15 }}
        animate={{ x: [0, -15, 0] }}
        transition={{ yoyo: true, ease: "linear", duration: 3, repeat: Infinity }}
        src="bottle.svg"
        alt="bottle-image"
        className="h-[90vh] absolute left-2 bottom-0 z-10"
      />
      <motion.img initial={{ scale: 0.5 }} animate={{ scale: [1, 0.5, 1] }} transition={{ yoyo: true, ease: "linear", duration: 1, repeat: Infinity }} src="logo.png" alt="logo-image" className="w-[212px] mt-16" />
      <p className="w-[290px] text-xs text-center mt-9">
        OPRIME EL BOTÓN PARA INICIAR LLAMADA A OTRO TELÉFONO DE JAMESON.
      </p>
      <button
        className="text-[64px] font-bold bg-[#007749] px-14 py-0 rounded-[31px] mt-3"
        onClick={onNext}
        disabled={!videoInfo.sessionId}
      >
        ¡LLAMAR!
      </button>
      <div className="flex items-center gap-2 mt-10">
        <span
          className="w-[33px] h-[33px] bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${markBox})` }}
        >
          <img src="ck-mark.svg" alt="tick-image" className="w-[18px]" />
        </span>
        <p className="w-[266px] text-xs">
          Confirmo que soy mayor de 18 años de edad, y acepto los términos y
          condiciones.
        </p>
      </div>
      <button
        onClick={() => setShowTerms(true)}
        className="bg-[#57262d] w-[248px] py-1 text-xs font-bold text-center rounded-full mt-3"
      >
        LEER TÉRMINOS Y CONDICIONES*
      </button>
      <div className="absolute w-[202px] py-4 right-0 top-[33%] bg-[#892427] z-10">
        <p className="w-full text-center text-[15px] font-bold uppercase">
          Amplía tu círculo,
        </p>
        <p className="w-full text-center text-[14px] font-light uppercase">
          conecta con nuevas amistades y
        </p>
        <p className="w-full text-center text-[14px] font-bold uppercase">
          gana premios.*
        </p>
      </div>
      <div className="absolute bottom-0 w-full h-[33px] homepage-footer-bg z-20 flex items-center justify-center">
        <p className="text-center text-xs text-yellow-700">
          Consuma Responsablemente. Jameson Irish Whiskey 40% Alc. Vol.
          Distribuye B. Fernánadez & Hnos.
        </p>
      </div>
      <motion.img
        src="hand.svg"
        alt="hand-image"
        className="h-[85vh] absolute -right-4 -bottom-3 z-10"
        initial={{ y: 0 }}
        animate={{ y: [0, -50, 0] }}
        transition={{ yoyo: true, ease: "linear", duration: 5, repeat: Infinity }}
      />
      {showTerms && <Terms close={() => setShowTerms(false)} />}
    </div>
  );
};

export default InitiatorAcknowledge;
