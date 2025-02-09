"use client";

import {  useEffect, useState } from "react";
import chekcIfModelIsOnline from "./request";
import { getData, updateDbOnlineStatus, updateDbOnlineStatusToFalse, VideoModel } from "./supaAPI/supa-api.service";


export default function Home() {
  const [onlineModels, setOnlineModels] = useState<VideoModel[]>([]);
  useEffect(() => {
    const updateOnlineStatus = async () => {
      try {
        console.log("Update online")
        const details = await getData();
        if (details) {
          await Promise.all(
            details.map(async (video:VideoModel) => {
              const isModelOnline = await chekcIfModelIsOnline(video.name)
              if(isModelOnline){
                setOnlineModels((onlineModels) => [...onlineModels, video]);
                await updateDbOnlineStatus(video.id!)
              }
            })
          );
        }
      } catch (error) {
        console.error("Error updating online status:", error);
      }
    };

    updateOnlineStatus();
    const intervalId = setInterval(updateOnlineStatus, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const updateOnlineStatus = async () => {
      try {
        console.log("Update offline")
        console.log(onlineModels)
          await Promise.all(
            onlineModels.map(async (video:VideoModel ) => {
              const isModelOffline = await chekcIfModelIsOnline(video.name)
              if(!isModelOffline){
                  setOnlineModels((prevModels) =>
                    prevModels.filter((model) => model.name !== video.name)
                  );
                  await updateDbOnlineStatusToFalse(video.id!)
              }
            })
          );
      } catch (error) {
        console.error("Error updating online status:", error);
      }
    };

    updateOnlineStatus();
    const intervalId = setInterval(updateOnlineStatus, 60000);
    return () => clearInterval(intervalId);
  }, []);
  
  return (
  <div> Hello</div>
  );
}
