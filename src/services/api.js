import fetch from "node-fetch";

import Session from "./session";
import { CLICKUP_TOKEN } from "../config/authentication";

const API = {
  url: "https://api.clickup.com/api/v2",

  headers: {
    Authorization:
      process.env.VUE_APP_CLICKUP_TOKEN ?? Session.get(CLICKUP_TOKEN),
    "Content-Type": "application/json",
  },

  set updateHeaders({ property, value }) {
    this.headers[property] = value;
  },

  async authorize(code, id, secret) {
    try {
      const response = await fetch(
        `${this.url}/oauth/token?client_id=${id}&client_secret=${secret}&code=${code}`,
        {
          method: "POST",
          headers: this.headers,
        }
      );

      const data = await response.json();

      this.headers["Authorization"] = data.access_token;

      return data.access_token;
    } catch (e) {
      console.error(e);
    }
  },

  async folders(spaceId = "") {
    try {
      const response = await fetch(
        `${this.url}/space/${spaceId}/folder?archived=false`,
        {
          headers: this.headers,
        }
      );

      const data = await response.json();

      return data.folders;
    } catch (e) {
      console.error(e);
    }
  },

  async lists(folderId = "") {
    try {
      const response = await fetch(
        `${this.url}/folder/${folderId}/list?archived=false`,
        {
          headers: this.headers,
        }
      );

      const data = await response.json();

      return data.lists;
    } catch (e) {
      console.error(e);
    }
  },

  async spaces(teamId = "") {
    try {
      const response = await fetch(
        `${this.url}/team/${teamId}/space?archived=false`,
        {
          headers: this.headers,
        }
      );

      const data = await response.json();

      return data.spaces;
    } catch (e) {
      console.error(e);
    }
  },

  async tasks(listId = "") {
    try {
      const response = await fetch(
        `${this.url}/list/${listId}/task?include_closed=true`,
        {
          headers: this.headers,
        }
      );

      const data = await response.json();

      return data.tasks;
    } catch (e) {
      console.error(e);
    }
  },

  async teams() {
    try {
      const response = await fetch(`${this.url}/team`, {
        headers: this.headers,
      });

      const data = await response.json();

      return data.teams;
    } catch (e) {
      console.error(e);
    }
  },
};

export default API;
