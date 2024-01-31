import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useMqttState } from "~/@mqtt-react-hooks";

import { MQTT_TOPICS } from "~/lib/constants";
import { AppContext, IVideoInfo } from "~/components/AppContext";

import markBox from "/public/ck-mark-box.svg";



function NewCall() {
  const navigate = useNavigate();
  const { boothInfo, updateBoothInfo, videoInfo, updateVideoInfo } = useContext(AppContext);

  const { client } = useMqttState();

  const onNext = () => {
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

    navigate(`/start/receiver-ack`);
  };

  return (
    <div className="w-full h-full">
      <img
        src="../jameson-logo.svg"
        alt="jameson-logo"
        className="w-[268px] h-[63px] mx-auto mt-[68px]"
      />
      <p className="w-[728px] relative text-4xl font-light tracking-[5.76px] text-center mx-auto mt-[64px] z-10">
        LLAMADA ENTRANDO
      </p>
      <div
        className="w-[993px] h-[155px] relative bg-[#880D27] flex items-center rounded-full px-4 ml-[166px] mt-10 z-10"
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
      <div className="flex justify-center mt-[31px] relative z-10">
        <div className="flex items-center gap-4 mt-10">
          <p className="w-[191px] text-xs text-center">
            OPRIME EL BOTÓN PARA INICIAR LLAMADA A OTRO TELÉFONO DE JAMESON.
          </p>
          <button className="w-[540px] h-[110px] bg-[#007749] text-white text-[64px] font-bold flex items-center justify-center rounded-3xl shadow-md"
          onClick={onNext}>
            ¡ACEPTAR!
          </button>
        </div>
      </div>

      <div className="relative flex justify-center w-full">
        <div className="absolute left-0 ml-20 mt-[10px]">
          <div className="w-[400px] h-[75px] relative flex justify-center items-center">
            <img
              src="../green-rec.svg"
              alt="green-rec"
              className="w-[63px] h-[63px] absolute z-10 left-0 top-0"
            />
            <p className="w-[320px] py-1 text-[16px] text-center border border-[#007749] border-dashed rounded-full">
              LEVANTA EL TELÉFONO PARA ESCUCHAR
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mt-[24px]">
            <span
              className="w-[36px] h-[36px] bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url(${markBox})` }}
            >
              <img src="../ck-mark.svg" alt="tick-image" className="w-[18px]" />
            </span>
            <p className="w-[266px] text-[14px]">
              Confirmo que soy mayor de 18 años de edad, y acepto los términos y condiciones.
            </p>
          </div>
          <p className="bg-[#880D27] w-[320px] h-[40px] text-[18px]] font-bold flex items-center justify-center rounded-full mt-5">LEER TÉRMINOS Y CONDICIONES*</p>
        </div>
      </div>

      <p className="w-[311px] text-xs absolute bottom-5 right-6 z-10">Consuma Responsablemente. Jameson Irish Whiskey 40% Alc. Vol. Distribuye B. Fernánadez & Hnos.</p>
    </div>
  );
}

export default NewCall;
