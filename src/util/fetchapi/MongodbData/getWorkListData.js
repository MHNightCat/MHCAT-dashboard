import {MHCATAPIURL} from '../../Data'
//import { guilds } from "./schemas";
//import mongoose from "mongoose";
//import connect from './connectMongodb'

export async function GetWorkListData(userId, guildId, accessToken) {
    const requestBody = {
      'userid': userId,
      'GuildId': guildId,
      'UserAccessToken': accessToken,
    };
    const response = await fetch(MHCATAPIURL + "/api/mongodbdata/getworklistdata", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }
  