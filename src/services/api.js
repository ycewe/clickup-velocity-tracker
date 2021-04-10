import fetch from "node-fetch";

const API = {
  url: "https://api.clickup.com/api/v2",

  headers: {
    Authorization: process.env.VUE_APP_CLICKUP_TOKEN,
    "Content-Type": "application/json",
  },

  async teams() {
    const response = await fetch(`${this.url}/team`, {
      headers: this.headers,
    });

    const data = await response.json();

    return data.teams;
  },

  async spaces(teamId = "") {
    const response = await fetch(
      `${this.url}/team/${teamId}/space?archived=false`,
      {
        headers: this.headers,
      }
    );

    const data = await response.json();

    return data.spaces;
  },

  async folders(spaceId = "") {
    const response = await fetch(
      `${this.url}/space/${spaceId}/folder?archived=false`,
      {
        headers: this.headers,
      }
    );

    const data = await response.json();

    return data.folders;
  },

  async lists(folderId = "") {
    const response = await fetch(
      `${this.url}/folder/${folderId}/list?archived=false`,
      {
        headers: this.headers,
      }
    );

    const data = await response.json();

    return data.lists;
  },

  async tasks(listId = "") {
    const response = await fetch(
      `${this.url}/list/${listId}/task?include_closed=true`,
      {
        headers: this.headers,
      }
    );

    const data = await response.json();

    return data.tasks;
  },
};

export default API;
