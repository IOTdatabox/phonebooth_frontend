import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useMqttState, useSubscription } from "~/@mqtt-react-hooks";
import useSocket from "~/components/useSocket";

import Input from "~/lib/Input";
import Checkbox from "~/lib/Checkbox";

import { AppContext, IVideoInfo } from "~/components/AppContext";
import { MQTT_TOPICS, ROLES, SOCKET_TOPICS } from "~/lib/constants";
import Select from "~/lib/Select";

import cheersGif from "/public/cheers.gif"


const InitiatorAcknowledge = () => {
  const navigate = useNavigate();
  const { client } = useMqttState();
  const { boothInfo, updateBoothInfo, videoInfo, updateVideoInfo } = useContext(AppContext);

  const [socket, isLoading, error, addListener, emitMessage] = useSocket();

  const { message: payload } = useSubscription([MQTT_TOPICS.CALL_ACCEPT]);

  useEffect(() => {
    onPayloadRecieved(payload);
  }, [payload]);

  const onPayloadRecieved = (payload: any) => {
    console.log("payload recieved", payload);

    if (!payload) return;

    const { topic, message } = payload;

    if (topic === MQTT_TOPICS.CALL_ACCEPT) {
      onCALL_ACCEPT(message);
    }
  };

  const onCALL_ACCEPT = (payload: any) => {
    const { sessionId, token, initiator } = payload;
    if (!videoInfo.sessionId)
      return;
    client?.publish(
      MQTT_TOPICS.CALL_CONNECTING,
      JSON.stringify({ ...videoInfo, status: videoInfo.status === "connecting" ? "connected" : "connecting" })
    );

    navigate(`/start/call`);
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


  const ageArray = Array.from({ length: 63 }, (_, i) => i + 18);

  //get role from url

  useEffect(() => {
    //console.log(videoInfo);
    if (socket && socket.connected && !videoInfo.sessionId) {
      //console.log("emitting get token");
      emitMessage("GET_TOKEN");
    }
  }, [socket, emitMessage]);

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


  return (
    <div className='w-full h-full pt-[68px]'>
      <img src='../bg-outgoing.svg' alt='outgoing-image' className='absolute w-full h-full top-0 right-0' />
      <img src='../jameson-logo.svg' alt='jameson-logo' className='w-[276px] mx-auto' />
      <p className='relative w-[496px] text-xl text-center z-10 mx-auto mt-[92px]'>ESTAMOS AMPLIANDO TU CÍRCULO, ESPERA UNOS SEGUNDOS MIENTRAS TE CONECTAMOS.</p>
      <div className='w-[772px] h-[155px] bg-[#007749] flex gap-5 items-center px-3 rounded-full mx-auto relative mt-[33px] z-10'>
        <div className='w-[138px] h-[138px] flex items-center justify-center rounded-full bg-cover bg-center' style={{ backgroundImage: `url(${cheersGif})` }}>
          <img src='../phone-icon.svg' alt='phone-icon' className='w-[94px] h-[94px]' />
        </div>
        <div className='flex -gap-1'>
          <img src='../soundwaves.gif' alt='soundwaves' className='w-[222px] h-[222px]' />
          <img src='../soundwaves.gif' alt='soundwaves' className='w-[222px] h-[222px]' />
        </div>
        <img src='../logo.gif' alt='logo' className='w-[128px] h-[128px]' />
        <p className='absolute bottom-0 text-[20px] left-[40%] font-bold'>Conectando...</p>
      </div>
      <div className='w-[328px] h-[63px] relative flex justify-center items-center mx-auto mt-5'>
        <img src='../green-rec.svg' alt='green-rec' className='w-[63px] h-[63px] absolute z-10 left-0 top-0' />
        <p className='w-[285px] py-1 text-xs text-center border border-[#007749] border-dashed rounded-full'>LEVANTA EL TELÉFONO PARA ESCUCHAR</p>
      </div>
      <button onClick={() => closeCall()}>
        <img src='../hangup.svg' alt='hangup-image' className='w-[44px] h-[44px] absolute right-5 bottom-5 z-20' />
      </button>
    </div>
  );
};

export default InitiatorAcknowledge;
