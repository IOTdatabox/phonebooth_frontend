import sup3rnovaLogo from "~/assets/logo.svg";
import { SetStateAction, useContext, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Keyboard from "react-simple-keyboard"
import "react-simple-keyboard/build/css/index.css"
import { useMqttState } from "~/@mqtt-react-hooks";

import Input from "~/lib/Input";
import Checkbox from "~/lib/Checkbox";

import { AppContext } from "~/components/AppContext";
import { MQTT_TOPICS, ROLES } from "~/lib/constants";
import Select from "~/lib/Select";


interface Inputs {
  [inputName: string]: string;
}

const Thankyou = () => {
  const navigate = useNavigate();
  const { client } = useMqttState();
  const { videoInfo } = useContext(AppContext);

  //get role from url
  const { search } = useLocation();
  const role = new URLSearchParams(search).get("role") || ROLES.INITIATOR;
  const ageArray = Array.from({ length: 63 }, (_, i) => i + 18);

  const [layoutName, setLayoutName] = useState("default")

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

  const [inputs, setInputs] = useState<Inputs>({});
  const [inputName, setInputName] = useState<string>("name");
  const keyboard = useRef<any>(null);

  const onChangeAll = (inputs: any) => {
    /**
     * Here we spread the inputs into a new object
     * If we modify the same object, react will not trigger a re-render
     */
    setInputs({ ...inputs });
    console.log("Inputs changed", inputs);
  };

  const onChangeInput = (event: { target: { value: any; }; }) => {
    const inputVal = event.target.value;

    setInputs({
      ...inputs,
      [inputName]: inputVal
    });

    keyboard.current.setInput(inputVal);
  };

  const getInputValue = (inputName: string | number) => {
    return inputs[inputName] || "";
  };



  return (

    <section className='bg-[#154734]'>
      <img className='absolute left-[135px] top-[50px]' width='274' height='63'
        src="jameson-logo.svg"
        alt="jameson-logo"
        onClick={() => navigate("/")}
      />
      <div className='bg-[#007749] rounded-lg w-[440px] h-[350px] absolute bottom-[90px] left-[40px] flex items-center p-4'>
        <Keyboard
          keyboardRef={r => (keyboard.current = r)}
          inputName={inputName}
          onChangeAll={onChangeAll}
          onKeyPress={onKeyPress}
          layoutName={layoutName}
          // layout={{
          //   default: ["q w e r t y u i o p", "a s d f g h j k l", "{shift} z x c v b n m {backspace}", "{numbers} {space} {ent}"],
          //   shift: ["Q W E R T Y U I O P", "A S D F G H J K L", "{shift} Z X C V B N M {backspace}", "{numbers} {space} {ent}"],
          //   numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"],
          // }}
          // display={{
          //   "{numbers}": "123",
          //   "{ent}": "return",
          //   "{escape}": "esc ⎋",
          //   "{tab}": "tab ⇥",
          //   "{backspace}": "⌫",
          //   "{capslock}": "caps lock ⇪",
          //   "{shift}": "⇧",
          //   "{controlleft}": "ctrl ⌃",
          //   "{controlright}": "ctrl ⌃",
          //   "{altleft}": "alt ⌥",
          //   "{altright}": "alt ⌥",
          //   "{metaleft}": "cmd ⌘",
          //   "{metaright}": "cmd ⌘",
          //   "{abc}": "ABC",
          // }}

          mergeDisplay={true}
        />
      </div>
      <div className='absolute w-[360px] right-[160px] bottom-[90px] z-10'>
        <p className=' text-orange-200 text-xl'>¡Ya ves lo divertido que es ampliar tu círculo! Queremos premiarte por haber aceptado el reto, coloca tu información para recibir una sorpresa.</p>
        <form className='pt-2 flex flex-col gap-4'>
          <input className='text-neutral-500 text-lg font-light bg-white py-4 px-4 outline-none rounded-md w-full'
            type='text' placeholder='Nombre Completo'
            value={getInputValue("name")}
            onFocus={() => setInputName("name")}
            onChange={onChangeInput}
          />
          <input className='text-neutral-500 text-lg font-light bg-white py-4 px-4 outline-none rounded-md w-full'
            type='text' placeholder='Teléfono'
            value={getInputValue("phone")}
            onFocus={() => setInputName("phone")}
            onChange={onChangeInput}
          />
          <input className='text-neutral-500 text-lg font-light bg-white py-4 px-4 outline-none rounded-md w-full'
            type='text' placeholder='e-mail'
            value={getInputValue("email")}
            onFocus={() => setInputName("email")}
            onChange={onChangeInput}
          />
          <input className='bg-[#880D27] text-orange-200 text-2xl font-bold p-4 tracking-[11.52px] rounded-md'
            type='button' value='ENVIAR' onClick={() => onNext()} />
        </form>
      </div>
      <img className='absolute top-28 right-10 z-10 h-20' src='/logo.png' alt='' />
      <img className='absolute bottom-0 right-2 z-10' src='/bottle2.svg' alt='' />
    </section>
  );
};

export default Thankyou;
