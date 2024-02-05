import React from "react"

import { useNavigate } from "react-router-dom";

const NoResponse = () => {
    const navigate = useNavigate();

    const onNext = () => {
        //on next
        console.log("SDFSDFSDFSD")
        setTimeout(() => {
          navigate(`/`);
        }, 1000);
      };

    return (
        <div className="w-full h-full">
            <img
                src="logo.gif"
                alt="logo"
                className="w-[128px] h-[128px] mx-auto mt-[60px]"
            />
            <p className="w-[385px] text-[32px] font-bold text-center leading-normal mx-auto mt-[36px]">
                Al parecer no están contestando la otra línea. ¡Por favor, intenta otra
                vez más tarde!
            </p>
            <button className="bg-[#880D27] w-[382px] h-[61px] flex gap-2 justify-center items-center shadow-lg rounded-sm mx-auto mt-4" onClick={onNext}>
                <img
                    src="white-hangup.svg"
                    alt="hangup"
                    className="w-[31px] h-[31px]"
                />
                <span className="text-white text-2xl font-bold tracking-[11.50px]">
                    ENGANCHAR
                </span>
            </button>
            <img
                src="gentelman.svg"
                alt="gentelman"
                className="w-[333px] h-[383px] absolute -bottom-2 left-[114px] z-20"
            />
            <div className="absolute bottom-0 w-full h-[33px] homepage-footer-bg z-0 flex items-center justify-center">
            </div>
        </div>
    )
}

export default NoResponse
