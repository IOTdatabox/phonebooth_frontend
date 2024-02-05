import { useContext, useEffect, useRef, useState } from "react";
import "@vonage/video-publisher/video-publisher.js";
import "@vonage/video-subscribers/video-subscribers.js";

import { useMqttState, useSubscription } from "~/@mqtt-react-hooks";
import { AppContext, IVideoInfo } from "~/components/AppContext";

import { MQTT_TOPICS, API_KEY } from "~/lib/constants";
import { useNavigate } from "react-router-dom";
import useTimer from "~/components/useTimer";

declare global {
  interface Window {
    OT: any;
  }
}

const Call = () => {
  const { boothInfo, videoInfo } = useContext(AppContext);
  const { client } = useMqttState();
  const navigate = useNavigate();

  const sessionRef = useRef<any>(null);

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

    if (sessionRef.current) {
      const session = sessionRef.current;
      console.log("onCloseCall session", session.capabilities)
      session.disconnect();
    }

    setTimeout(() => {
      navigate("/thankyou");
    }, 2000);
  }

  useEffect(() => {
    if (videoInfo.status === "idle") {
      navigate("/");
    }

    if (boothInfo?.role === "publisher") {
      console.log("initializing publisher", videoInfo.sessionId, videoInfo.token);

      const { sessionId, token } = videoInfo;
      initializeSession(sessionId, token);
    }

    if (boothInfo?.role === "subscriber") {
      console.log("initializing subscriber", videoInfo.incomming_sessionId, videoInfo.incomming_token);
      const { incomming_sessionId, incomming_token } = videoInfo;
      initializeSession(incomming_sessionId, incomming_token);
    }
  }, []);

  useEffect(() => {
    console.log("useEffect", videoInfo.status, boothInfo?.role);

    if (videoInfo.status !== "connected") {
      console.log("publising to topic", MQTT_TOPICS.CALL_CONNECTED);
      client?.publish(MQTT_TOPICS.CALL_CONNECTED, JSON.stringify({ ...videoInfo, status: "connected" }));
    }
  }, [videoInfo.status]);

  const handleError = (error: any) => {
    if (error) console.error(error);
  };

  const initializeSession = (sessionId: string, token: string) => {
    //console.log("initializing session", videoInfo.sessionId);
    const OT = window?.OT;

    //const { sessionId, token } = videoInfo;

    console.log("initializing session", sessionId, token);

    const session = OT.initSession(API_KEY, sessionId);
    sessionRef.current = session;

    console.log("session", session);

    // Subscribe to a newly created stream
    session.on("streamCreated", function (event: any) {
      session.subscribe(
        event.stream,
        "subscriber",
        {
          insertMode: "append",
          width: "100%",
          height: "100%",
        },
        handleError
      );
    });

    // Create a publisher
    const publisher = OT.initPublisher(
      "publisher",
      {
        insertMode: "append",
        width: "100%",
        height: "100%",
      },
      handleError
    );

    // Connect to the session
    session.connect(token, function (error: any) {
      // If the connection is successful, publish to the session
      if (error) {
        handleError(error);
      } else {
        session.publish(publisher, handleError);
      }
    });
  };

  const formatTime = (seconds: any) => {
    let minutes = Math.floor(seconds / 60)
    let remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const [seconds, setSeconds] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const text = ["En pocos segundos ampliarás tu círculo de amistades. Aprovecha este tiempo al máximoy recibirás una recompensa.", "¿Cómo te llamas?", "¿En qué barra estás?", "¿Cuál es tu spot favorito en P.R.?", "¿Jangueas en corillx o en la tuya?", "¿Cuál sería tu super poder?", "¿Cuál es tu comida favorita?", "¿Qué te apasiona?", "¿Empanadilla o Pastelillo?", "¿Amarillitos o tostones?", "¡Cuéntame algo que no sepan tus papás!"]
  const [textStyle, setTextStyle] = useState('text-xl');

  const [showFinalMessage, setShowFinalMessage] = useState(false);


  // useEffect(() => {
  //   const interval1 = setInterval(() => {
  //     if (!showFinalMessage) {
  //       setCurrentIndex((currentIndex) => (currentIndex + 1) % text.length)
  //       setTextStyle('text-3xl');
  //     }
  //   }, 5000)
  //   const interval2 = setInterval(() => {
  //     setSeconds((seconds) => seconds + 1)
  //   }, 1000)
  //   const timeout = setTimeout(() => {
  //     // navigate("/noresponse")
  //     setShowFinalMessage(true);
  //   }, 60000)

  //   return () => {
  //     clearInterval(interval1)
  //     clearInterval(interval2)
  //     clearTimeout(timeout)
  //   }
  // }, [text.length, history])

  useEffect(() => {
    const numberOfTextChangesBeforeStop = 10; // Number of times to change text before stopping
    let interval1: string | number | NodeJS.Timer | undefined;
  
    if (!showFinalMessage) {
      interval1 = setInterval(() => {
        setCurrentIndex((currentIndex) => (currentIndex + 1) % text.length);
        setTextStyle('text-3xl');
      }, 5000);
    }
  
    const interval2 = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);
  
    // Schedule the final message to show after 60 seconds,
    // but stop changing the text after 50 seconds.
    const timeoutToShowFinalMessage = setTimeout(() => {
      setShowFinalMessage(true);
    }, 60000);
  
    // Stop cycling through texts after 50 seconds
    const timeoutToStopTextChange = setTimeout(() => {
      clearInterval(interval1);
    }, 5000 * numberOfTextChangesBeforeStop);
  
    return () => {
      clearTimeout(timeoutToShowFinalMessage);
      clearTimeout(timeoutToStopTextChange);
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);
  
  // ... The rest of the component goes here ...
  

  const [showImage, setShowImage] = useState(false);


  useEffect(() => {
    const gifDuration = 15000; // Replace with the actual duration of your GIF in milliseconds.

    // Set a timeout to change the showImage state after 1 minute
    const timerToShowGif = setTimeout(() => {
      setShowImage(true);
    }, 60000); // 60,000 milliseconds for 1 minute

    const timerToHideGif = setTimeout(() => {
      setShowImage(false);
    }, 60000 + gifDuration); // Hide the GIF after it finishes playing

    // Clean up the timers if the component unmounts before time elapses
    return () => {
      clearTimeout(timerToShowGif);
      clearTimeout(timerToHideGif);
    };
  }, []);

  return (
    <div id="videos" className='w-full h-full'>
      <img src='../jameson-logo.svg' alt='logo' className='absolute w-[186px] mt-[36px] ml-[45px] z-20' />
      <p className='w-[196px] h-[88px] absolute border-[10px] border-[#007749] rounded-3xl top-20 right-10 text-5xl font-bold flex items-center justify-center z-10'>{formatTime(seconds)}</p>
      <div className='w-[237px] h-[237px] bg-[#154734] border border-[#F1E4B2] border-dashed rounded-3xl absolute top-[38%] right-4 z-10'>
        <div className='relative w-full h-full flex items-center justify-center'>
          <img src='/hand2.svg' alt='spaeaker' className='w-[77px] h-[88px] absolute -top-10 -left-6' />
          <h6 className='pb-[2px] border-b border-[#FFF0BF] absolute top-0 text-sm pt-1'>AMPLÍA TU CÍRCULO</h6>
          {/* <p className={`w-[217px] ${textStyle} font-bold text-center`}>{text[currentIndex]}</p> */}

          {!showFinalMessage ? (
            <p className={`w-[217px] ${textStyle} font-bold text-center`}>{text[currentIndex]}</p>
          ) : (
            <div className="text-center">
              <h3 className="w-[217px] text-2xl">¡FELICIDADES! Llegaron a 01:00</h3>
              <h4 className="w-[225px] text-xl">pero puedes continuar conversando. </h4>
            </div>
          )}
          {/* <p className={`w-[217px] ${textStyle} font-bold text-center`}>{displayText}</p> */}

          <img src='/signifier.svg' alt='signifier' className='w-[22px] h-[29px] absolute bottom-3 right-4' />
        </div>
        <p className='text-sm p-2 opacity-80'>Te tiramos la toalla con algunas peguntas para romper el hielo.</p>
      </div>
      <button onClick={() => closeCall()}>
        <img src='../hangup.svg' alt='hangup-image' className='w-[44px] h-[44px] absolute right-5 bottom-5 z-10' />
      </button>
      {/* <img src='../caller.svg' alt='caller' className='w-[199px] h-[138px] absolute bottom-10 left-11 z-10' /> */}
      {/* <div id="publisher" className='w-[199px] h-[138px] absolute bottom-10 left-11 z-10'></div> */}
      <div id="publisher" className='w-[199px] h-[138px] absolute bottom-10 left-11 z-10 border-2 border-solid border-gray-300 rounded-lg'></div>
      <img src='../logo.png' alt='logo' className='w-[123px] h-[122px] absolute bottom-10 right-72 z-10' />

      {/* <img src='/girl.png' alt='hangup-image' className='h-full w-full absolute top-0 left-0 z-0' /> */}
      <div id="subscriber" className='h-full w-full absolute top-0 left-0 z-0'></div>
      <div className="relative min-h-screen p-8 flex justify-center items-end">
        {showImage && (
          <img src='../giphy (1).gif' alt='reward' className='mb-0' />
        )}
      </div>
    </div>
  );
};

export default Call;
