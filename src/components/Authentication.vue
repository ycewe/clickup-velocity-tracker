<template>
  <section class="secret-form">
    <div class="secret-input-group">
      <label for="secret-input" class="secret-label">Secret:</label>

      <svg
        class="secure-icon"
        viewBox="0 0 50 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0)" stroke="#708090" stroke-width="7">
          <path
            d="M42.492 26.016c0 .394.003.724.005 1.016.003.436.006.788-.002 1.142v.045c-.84.122-2.256.189-4.708.196-1.395.004-2.934-.008-4.734-.023-2.095-.016-4.543-.035-7.528-.035-4.153 0-7.537.051-10.243.092-1.068.017-2.03.031-2.893.04-2.5.027-3.983 0-4.889-.092v-.005c0-.289.004-.609.01-1.002v-.03c.006-.397.013-.85.013-1.344C7.523 12.841 16.016 3.5 25.008 3.5c8.99 0 17.484 9.34 17.484 22.516zm.666 2.06a.043.043 0 010 0zm-36.48.18a.092.092 0 010 0z"
          />
          <path d="M3.5 28.5h43v33h-43z" />
        </g>
        <defs>
          <clipPath id="clip0">
            <path fill="#fff" d="M0 0h50v65H0z" />
          </clipPath>
        </defs>
      </svg>

      <input
        id="secret-input"
        class="secret-input"
        type="text"
        v-model="clientSecret"
      />
    </div>

    <a
      class="auth-button"
      :href="`https://app.clickup.com/api?client_id=${clientID}&redirect_uri=${clientRedirectURI}`"
      @click="saveClientSecret"
    >
      Sign In
    </a>
  </section>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import API from "@/services/api";
import Session from "@/services/session";
import { CLICKUP_SECRET, CLICKUP_TOKEN } from "@/config/authentication";

export default defineComponent({
  setup: () => {
    const state = reactive({
      clientID: "",
      clientRedirectURI: "",
      clientSecret: "",
      clientCode: "",
    });

    onMounted(async () => {
      state.clientID = process.env.VUE_APP_CLICKUP_CLIENT_ID;
      state.clientRedirectURI = process.env.VUE_APP_CLICKUP_REDIRECT_URI;
      state.clientSecret = Session.get(CLICKUP_SECRET);
      console.log(Session.get(CLICKUP_SECRET));

      const query = window.location.search;
      const urlParams = new URLSearchParams(query);
      state.clientCode = urlParams.get("code") ?? "";

      if (state.clientCode && state.clientID && state.clientSecret) {
        const token = await API.authorize(
          state.clientCode,
          state.clientID,
          state.clientSecret
        );

        Session.store(CLICKUP_TOKEN, token);
        Session.delete(CLICKUP_SECRET);

        state.clientSecret = "";

        this.$emit("authenticated");
      }
    });

    const saveClientSecret = () => {
      Session.store(CLICKUP_SECRET, state.clientSecret);
    };

    return {
      ...toRefs(state),
      saveClientSecret,
    };
  },
});
</script>

<style scoped>
.auth-button {
  align-items: center;
  border: 0;
  border-radius: 10px;
  box-shadow: var(--var-box-shadow-s);
  display: flex;
  font-size: 1.2rem;
  height: 3rem;
  justify-content: center;
  outline: 0;
  padding: 0.1rem 0.5rem;
  text-decoration: none;
}

.auth-button:active {
  box-shadow: inset var(--var-box-shadow-s);
  color: inherit;
}

.auth-button:focus {
  border: 2px solid #cccccc;
}

.secret-form {
  display: grid;
  height: 100%;
  place-content: center;
  width: 100%;
}

.secret-input-group {
  margin-bottom: 4rem;
  position: relative;
}

.secret-label {
  display: block;
  margin-bottom: 0.5rem;
}

.secret-input {
  border: 0;
  border-radius: 10px;
  box-shadow: var(--var-box-shadow-s);
  font-size: 1rem;
  height: 3rem;
  padding: 1rem 1rem 1rem 2.5rem;
  width: 15rem;
}

.secret-input:focus {
  box-shadow: inset var(--var-box-shadow-s);
  outline: 0;
}

.secure-icon {
  bottom: 1rem;
  left: 1rem;
  position: absolute;
  width: 0.8rem;
}
</style>
