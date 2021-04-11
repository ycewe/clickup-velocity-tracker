const Session = {
  key: "@velocity",

  store(key = "", value = "") {
    try {
      window.sessionStorage.setItem(`${this.key}_${key}`, btoa(value));
    } catch (e) {
      console.error(e);
    }
  },

  get(key = "") {
    let data = "";

    try {
      data = window.sessionStorage.getItem(`${this.key}_${key}`) ?? "";

      return atob(data);
    } catch (e) {
      console.error(e);
    }

    return data;
  },

  delete(key = "") {
    try {
      window.sessionStorage.removeItem(`${this.key}_${key}`);
    } catch (e) {
      console.error(e);
    }
  },
};

export default Session;
