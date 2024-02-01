import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { AppContext, IBoothInfo, IVideoInfo } from "./components/AppContext";
import Settings from "./components/Settings";


const App = () => {
  const [_boothInfo, _updateBoothInfo] = useState<IBoothInfo>();
  const [_videoInfo, _updateVideoInfo] = useState<IVideoInfo>({
    sessionId: "",
    token: "",
    incomming_sessionId: "",
    incomming_token: "",
    status: "idle",
    initiator: "",
    receiver: "",
  });


  useEffect(() => {
    const boothInfo: IBoothInfo = {
      id: randomString(18),
      name: randomString(7),
      mac: "",
      role: "subscriber",
    };

    _updateBoothInfo(boothInfo);
  }, []);

  return (
    <main className='w-full h-screen overflow-hidden relative'>
      <img src='../curved-bg.svg' alt='curved-background' className='h-screen absolute right-0 top-0 z-10' />
      <Settings />

      <AppContext.Provider
        value={{
          boothInfo: _boothInfo as IBoothInfo,
          updateBoothInfo: _updateBoothInfo,
          videoInfo: _videoInfo as IVideoInfo,
          updateVideoInfo: _updateVideoInfo,
        }}
      >

        <RouterProvider router={router} />
      </AppContext.Provider>
    </main>
  );
};

export default App;

//generate random string ending with numeric val
const randomString = (length: number) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result + Math.floor(Math.random() * 10);
}