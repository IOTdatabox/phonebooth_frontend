import sup3rnovaLogo from "~/assets/logo.svg";
import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Keyboard from "react-simple-keyboard"
import "react-simple-keyboard/build/css/index.css"
import { useMqttState } from "~/@mqtt-react-hooks";

import Input from "~/lib/Input";
import Checkbox from "~/lib/Checkbox";

import { AppContext } from "~/components/AppContext";
import { MQTT_TOPICS, ROLES } from "~/lib/constants";
import Select from "~/lib/Select";

const Thankyou = () => {
  const navigate = useNavigate();
  const { client } = useMqttState();
  const { videoInfo } = useContext(AppContext);

  //get role from url
  const { search } = useLocation();
  const role = new URLSearchParams(search).get("role") || ROLES.INITIATOR;
  const ageArray = Array.from({ length: 63 }, (_, i) => i + 18);

  const [layoutName, setLayoutName] = useState("default")

  const onChange = (input: any) => {
    console.log("Input changed", input)
  }

  const onKeyPress = (button: any) => {
    console.log("Button pressed", button)
    if (button === "{shift}" || button === "{lock}") handleShift()
    if (button === "{numbers}") setLayoutName("numbers")
    if (button === "{abc}") setLayoutName("default")
  }

  const handleShift = () => {
    setLayoutName(layoutName === "default" ? "shift" : "default")
  }


  const onNext = () => {
    //on next
    setTimeout(() => {
      navigate(`/`);
    }, 1000);
  };

  return (
    // <>
    //   <div className="container min-w-[600px] h-screen flex flex-col items-start w-screen">
    //     <div className="rounded-full bg-black  flex h-26 m-4" onClick={() => navigate("/")}>
    //       <img src={sup3rnovaLogo} className="logo react" alt="logo" />
    //     </div>
    //     <div className="h-screen-minus-100 w-full">
    //       <div className="flex flex-col justify-between mx-auto mt-10 ">
    //         <h1 className="text-6xl uppercase">Thank you</h1>

    //         <h2 className="mt-10 text-2xl w-3/4 mx-auto leading-10 ">
    //           {" "}
    //           Thank you for using sup3rnova phone booth. Please leave your details below to receive your free drink
    //           voucher.
    //         </h2>
    //       </div>

    //       {/*Form to get user name, last name, email and phone and ask them to accept t&C */}
    //       <form className="flex flex-col w-3/4 mx-auto mt-10">
    //         <div className="flex flex-row ">
    //           <div className=" w-1/2">
    //             <Input
    //               name="firstname"
    //               isRequired={true}
    //               type="text"
    //               placeholder="Enter your first name"
    //               onChange={(e) => console.log(e.target.value)}
    //             />
    //           </div>
    //           <div className=" w-1/2">
    //             <Input
    //               name="lastname"
    //               isRequired={true}
    //               type="text"
    //               placeholder="Enter your last name"
    //               onChange={(e) => console.log(e.target.value)}
    //             />
    //           </div>
    //         </div>
    //         <div className="flex flex-row ">
    //           <div className=" w-1/2">
    //             <Input
    //               name="email"
    //               isRequired={true}
    //               type="email"
    //               placeholder="Enter your email"
    //               onChange={(e) => console.log(e.target.value)}
    //             />
    //           </div>
    //           <div className=" w-1/2">
    //             <Input
    //               name="phone"
    //               isRequired={true}
    //               type="tel"
    //               placeholder="Enter your phone number"
    //               onChange={(e) => console.log(e.target.value)}
    //             />
    //           </div>
    //         </div>


    //       </form>

    //       <button className="m-5 p-5 w-3/4 mx-auto" onClick={onNext}>
    //         Submit
    //       </button>
    //     </div>
    //   </div>
    // </>

    <section className='bg-[#154734]'>
      <img className='absolute left-[150px] top-[50px]' width='274' height='63'
        src="jameson-logo.svg"
        alt="jameson-logo"
        onClick={() => navigate("/")}
      />
      <div className='bg-[#007749] rounded-lg w-[460px] h-[350px] absolute bottom-[90px] left-[50px] flex items-center p-4'>
        <Keyboard
          onChange={onChange}
          onKeyPress={onKeyPress}
          layoutName={layoutName}
          layout={{
            default: ["q w e r t y u i o p", "a s d f g h j k l", "{shift} z x c v b n m {backspace}", "{numbers} {space} {ent}"],
            shift: ["Q W E R T Y U I O P", "A S D F G H J K L", "{shift} Z X C V B N M {backspace}", "{numbers} {space} {ent}"],
            numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"],
          }}
          display={{
            "{numbers}": "123",
            "{ent}": "return",
            "{escape}": "esc ⎋",
            "{tab}": "tab ⇥",
            "{backspace}": "⌫",
            "{capslock}": "caps lock ⇪",
            "{shift}": "⇧",
            "{controlleft}": "ctrl ⌃",
            "{controlright}": "ctrl ⌃",
            "{altleft}": "alt ⌥",
            "{altright}": "alt ⌥",
            "{metaleft}": "cmd ⌘",
            "{metaright}": "cmd ⌘",
            "{abc}": "ABC",
          }}
          mergeDisplay={true}
        />
      </div>
      <div className='absolute w-[380px] right-[160px] bottom-[90px] z-10'>
        <p className=' text-orange-200 text-xl'>¡Ya ves lo divertido que es ampliar tu círculo! Queremos premiarte por haber aceptado el reto, coloca tu información para recibir una sorpresa.</p>
        <form className='pt-2 flex flex-col gap-4'>
          <input className='text-neutral-500 text-lg font-light bg-white py-4 px-4 outline-none rounded-md w-full' type='text' placeholder='Nombre Completo' />
          <input className='text-neutral-500 text-lg font-light bg-white py-4 px-4 outline-none rounded-md w-full' type='text' placeholder='Nombre Completo' />
          <input className='text-neutral-500 text-lg font-light bg-white py-4 px-4 outline-none rounded-md w-full' type='text' placeholder='Nombre Completo' />
          <input className='bg-[#880D27] text-orange-200 text-2xl font-bold p-4 tracking-[11.52px] rounded-md' type='button' value='ENVIAR'     onClick={() => onNext()}/>
        </form>
      </div>
      <img className='absolute top-28 right-10 z-10 h-20' src='/logo.png' alt='' />
      <img className='absolute bottom-0 right-2 z-10' src='/bottle2.svg' alt='' />
    </section>
  );
};

export default Thankyou;
