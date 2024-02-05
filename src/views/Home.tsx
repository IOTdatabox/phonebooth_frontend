import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

import { useMqttState, useSubscription } from "~/@mqtt-react-hooks";
import useSocket from "~/components/useSocket";


import { AppContext, IVideoInfo, defaultVideoInfo } from "~/components/AppContext";
import { MQTT_TOPICS, ROLES, SOCKET_TOPICS } from "~/lib/constants";
import { motion } from "framer-motion";

import markBox from "/public/ck-mark-box.svg";
import Terms from "~/components/Terms";


const InitiatorAcknowledge = () => {
  const [showTerms, setShowTerms] = useState(false);

  const navigate = useNavigate();

  const { boothInfo, updateBoothInfo, videoInfo, updateVideoInfo } = useContext(AppContext);

  const [socket, isLoading, error, addListener, emitMessage] = useSocket();

  const { client } = useMqttState();
  const { message: payload } = useSubscription([MQTT_TOPICS.CALL_RING]);

  useEffect(() => {
    if (socket && socket.connected && !boothInfo?.mac) {
      emitMessage("GET_MAC");
    }
    if (socket && socket.connected) {
      emitMessage("HEADSET_STATUS");
    }
  }, [socket, emitMessage]);

  useEffect(() => {
    updateVideoInfo({ ...defaultVideoInfo })
  }, []);

  useEffect(() => {
    if (socket) {
      const _onHeadsetPicked = addListener("__HEADSET_STATUS", onHeadSetPicked);
      const _onMacAdd = addListener(SOCKET_TOPICS.__MAC, onMacAddressRecieved);

      return () => {
        _onHeadsetPicked();
        _onMacAdd();
      };
    }
  }, [socket, addListener]);

  const onMacAddressRecieved = (mac: string) => {
    console.log("mac recieved", mac);

    const _boothInfo = {
      ...boothInfo,
      mac: mac + "-" + Math.floor(Math.random() * 1000),
    };

    updateBoothInfo(_boothInfo);
  };

  const onHeadSetPicked = (data: any) => {
    console.log("headset picked", data);

    if (data?.picked === true) {
      IntializeCall();
    }
  };

  useEffect(() => {
    onPayloadRecieved(payload);
  }, [payload]);

  useEffect(() => {
    console.log("MQTT Connected", client?.connected);
  }, [client?.connected]);

  const onPayloadRecieved = (payload: any) => {
    console.log("payload recieved", payload);

    if (!payload) return;

    const { topic, message } = payload;

    if (topic === MQTT_TOPICS.CALL_RING) {
      onCALL_RING(message);
    }
  };

  const onCALL_RING = (payload: any) => {
    const { sessionId, token, initiator } = payload;

    //if (videoInfo?.status !== "idle") return;
    if (initiator === boothInfo?.mac) return;

    const _videoInfo: IVideoInfo = {
      ...videoInfo,
      incomming_sessionId: sessionId,
      incomming_token: token,
      status: "ringing",
      initiator: initiator,
      receiver: "",
    };

    console.log("video info", _videoInfo);

    updateVideoInfo(_videoInfo);

    if (boothInfo.mac === "") {

      updateBoothInfo({ ...boothInfo, mac: generateRandomMac() })

    }

    navigate("/start/new-call");
  };

  const IntializeCall = () => {
    if (isImageVisible) {
      navigate("/start/initiator-ack");
    }
    else {
      console.log("SDFDSFfsdfsd")
      toast('Debe aceptar los Términos de uso para utilizar el servicio.', { type: 'error' });
      console.log("ZZZZZ")
    }
  };


  const [isImageVisible, setImageVisibility] = useState(true);

  const toggleImage = () => {
    console.log("FSDFSD")
    setImageVisibility(!isImageVisible);
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
      <motion.img initial={{ scale: 0.5 }} animate={{ scale: [1, 0.5, 1] }} transition={{ yoyo: true, ease: "linear", duration: 3, repeat: Infinity }} src="logo.png" alt="logo-image" className="w-[212px] mt-16" />
      <p className="w-[290px] text-xs text-center mt-9">
        OPRIME EL BOTÓN PARA INICIAR LLAMADA A OTRO TELÉFONO DE JAMESON.
      </p>
      <button
        className="text-[64px] font-bold bg-[#007749] px-14 py-0 rounded-[31px] mt-3 z-10"
        onClick={IntializeCall}
        disabled={isLoading}      >
        ¡LLAMAR!
      </button>
      <div className="flex items-center gap-2 mt-10 z-50" onClick={(toggleImage)}>
        <div
          className="w-[33px] h-[33px] bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${markBox})` }}

        >
          {isImageVisible && (
            <img src="../ck-mark.svg" alt="tick-image" className="w-[18px]" />
          )}
        </div>
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
        <p className="text-center text-xs text-[#800000]">
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

const generateRandomMac = () => {
  const mac = "00:00:00:00:00:00".replace(/0/g, () => {
    return (~~(Math.random() * 16)).toString(16);
  });

  return mac;
}


