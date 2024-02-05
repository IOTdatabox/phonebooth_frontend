import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useMqttState, useSubscription } from "~/@mqtt-react-hooks";

import { MQTT_TOPICS, ROLES } from "~/lib/constants";
import { AppContext, IVideoInfo } from "~/components/AppContext";

import markBox from "/public/ck-mark-box.svg";
import { toast } from "react-toastify";



function NewCall() {
  const navigate = useNavigate();
  const { boothInfo, updateBoothInfo, videoInfo, updateVideoInfo } = useContext(AppContext);

  const { client } = useMqttState();
  const { search } = useLocation();

  const role = new URLSearchParams(search).get("role") || ROLES.INITIATOR;
  const { message: payload } = useSubscription([MQTT_TOPICS.CALL_END]);


  useEffect(() => {
    onPayloadRecieved(payload);
  }, [payload]);

  const onPayloadRecieved = (payload: any) => {
    console.log("payload recieved", payload);

    if (!payload) return;

    const { topic, message } = payload;

    if (topic === MQTT_TOPICS.CALL_END) {
      onCALL_END(message);
    }
  };

  const onCALL_END = (message: IVideoInfo) => {
    console.log("onCALL_END", message);

    console.log({ message })
    console.log({ videoInfo })


    if (message.status === "ended" && message.incomming_sessionId === videoInfo.incomming_sessionId && videoInfo.endedBy !== boothInfo?.mac) {
      closeCall(true);
    }
  }

  const closeCall = (forceEnd = false) => {

    console.log("onCloseCall", forceEnd)

    if (!forceEnd) {
      console.log("onCloseCall", videoInfo, boothInfo?.mac)
      client?.publish(MQTT_TOPICS.CALL_END, JSON.stringify({ ...videoInfo, status: "ended", endedBy: boothInfo?.mac }));
    }

    // if (sessionRef.current) {
    //   const session = sessionRef.current;
    //   console.log("onCloseCall session", session.capabilities)
    //   session.disconnect();
    // }

    setTimeout(() => {
      navigate("/");
    }, 2000);
  }



  const onNext = () => {
    if (isImageVisible) {
      console.log("updating booth info to subscriber");
      updateBoothInfo({ ...boothInfo, role: "subscriber" });

      const _videoInfo: IVideoInfo = {
        ...videoInfo,
        status: "waiting",
        receiver: boothInfo?.mac,
      };

      updateVideoInfo(_videoInfo);

      const payload = { ..._videoInfo };

      client?.publish(MQTT_TOPICS.CALL_ACCEPT, JSON.stringify(payload));

      client?.publish(
        MQTT_TOPICS.CALL_CONNECTING,
        JSON.stringify({ ...videoInfo, status: videoInfo.status === "connecting" ? "connected" : "connecting" })
      );

      navigate(`/start/call?role=${role}`);
    }
    else {
      console.log("SDFDSFfsdfsd")
      toast('Debe aceptar los Términos de uso para utilizar el servicio.', { type: 'error' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
    }, 5000)

    const timeout = setTimeout(() => {
      navigate("/noresponse")
    }, 60000)

    return () => {
      clearInterval(interval)

      clearTimeout(timeout)
    }
  },)

  const [isImageVisible, setImageVisibility] = useState(true);

  const toggleImage = () => {
    console.log("FSDFSD")
    setImageVisibility(!isImageVisible);
  };



  return (
    <div className="w-full h-full">
      <img
        src="../jameson-logo.svg"
        alt="jameson-logo"
        className="w-[268px] h-[63px] mx-auto mt-[68px]"
      />
      <p className="w-[728px] relative text-4xl font-light tracking-[5.76px] text-center mx-auto mt-8 z-10">
        LLAMADA ENTRANDO
      </p>
      <div
        className="w-[993px] h-[155px] relative bg-[#880D27] flex items-center rounded-full px-4 ml-[166px] mt-4 z-10"
        style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset" }}
      >
        <img src="../logo.png" alt="logo" className="w-[128px] h-[128px]" />
        <div className="flex items-center ml-[22px]">
          <img
            src="../soundwaves.gif"
            alt="soundwaves"
            className="w-[231px] h-[232px]"
          />
          <img
            src="../soundwaves.gif"
            alt="soundwaves"
            className="w-[231px] h-[232px]"
          />
        </div>
        <div className="w-[202px] ml-[82px]">
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
      </div>
      <img
        src="../hand.svg"
        alt="hand-image"
        className="absolute bottom-0 right-0 z-10"
      />

      <div className="flex items-center gap-4 ml-[128px] mt-[31px] relative z-10">
        <p className="w-[191px] text-xs text-center">
          OPRIME EL BOTÓN PARA INICIAR LLAMADA A OTRO TELÉFONO DE JAMESON.
        </p>
        <button className="w-[422px] h-[86px] bg-[#007749] text-[64px] font-bold flex items-center justify-center rounded-3xl shadow-md"
          onClick={onNext}>
          ¡ACEPTAR!
        </button>
      </div>

      <div className="flex">
        <div className="w-[328px] h-[63px] relative flex justify-center items-center ml-8 mt-[10px]">
          <img
            src="../green-rec.svg"
            alt="green-rec"
            className="w-[63px] h-[63px] absolute z-10 left-0 top-0"
          />
          <p className="w-[285px] py-1 text-xs text-center border border-[#007749] border-dashed rounded-full">
            LEVANTA EL TELÉFONO PARA ESCUCHAR
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mt-[24px]  z-50" onClick={toggleImage}>
            <span
              className="w-[33px] h-[33px] bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url(${markBox})` }}
            >
              {isImageVisible && (
                <img src="../ck-mark.svg" alt="tick-image" className="w-[18px]" />
              )}
            </span>
            <p className="w-[266px] text-xs">
              Confirmo que soy mayor de 18 años de edad, y acepto los términos y
              condiciones.
            </p>
          </div>
          <p className="bg-[#880D27] w-[248px] h-[33px] text-xs font-bold flex items-center justify-center rounded-full mt-[11px]">LEER TÉRMINOS Y CONDICIONES*</p>
        </div>
      </div>
      <p className="w-[311px] text-xs absolute bottom-5 right-6 z-10">Consuma Responsablemente. Jameson Irish Whiskey 40% Alc. Vol. Distribuye B. Fernánadez & Hnos.</p>

    </div>
  );
}

export default NewCall;
