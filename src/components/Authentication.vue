<template>
  <section class="secret-form">
    <div class="fingerprint"><FingerprintIcon /></div>

    <div class="secret-input-group">
      <label for="secret-input" class="secret-label">Secret:</label>

      <LockIcon />

      <input
        id="secret-input"
        class="secret-input"
        type="password"
        v-model="clientSecret"
      />

      <p :class="[{ 'secret-error': error }, 'secret-location']">
        {{ error || "Settings > Integration > Clickup API > Client Secret" }}
      </p>
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
import { defineComponent, reactive, toRefs, onMounted, watch } from "vue";
import FingerprintIcon from "@/assets/icons/Fingerprint.vue";
import LockIcon from "@/assets/icons/Lock.vue";
import API from "@/services/api";
import Session from "@/services/session";
import { CLICKUP_SECRET, CLICKUP_TOKEN } from "@/config/authentication";

export default defineComponent({
  components: {
    FingerprintIcon,
    LockIcon,
  },

  setup: (_, { emit }) => {
    const state = reactive({
      clientID: "",
      clientRedirectURI: "",
      clientSecret: "",
      clientCode: "",
      error: "",
    });

    watch(
      () => state.clientSecret,
      () => {
        state.error = "";
      }
    );

    onMounted(async () => {
      state.clientID = process.env.VUE_APP_CLICKUP_CLIENT_ID;
      state.clientRedirectURI = process.env.VUE_APP_CLICKUP_REDIRECT_URI;
      state.clientSecret = Session.get(CLICKUP_SECRET);

      const query = window.location.search;
      const urlParams = new URLSearchParams(query);
      state.clientCode = urlParams.get("code") ?? "";

      if (state.clientCode && state.clientID && state.clientSecret) {
        const token = await API.authorize(
          state.clientCode,
          state.clientID,
          state.clientSecret
        );

        Session.delete(CLICKUP_SECRET);

        if (!token) {
          state.error =
            "Something went wrong. Please ensure you have entered the correct secret from Clickup Integrations.";

          return;
        }

        Session.store(CLICKUP_TOKEN, token);

        state.clientSecret = "";

        emit("login");
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

<style lang="scss" scoped>
.auth-button {
  align-items: center;
  border: 0;
  border-radius: 10px;
  box-shadow: var(--var-box-shadow-s);
  display: flex;
  font-size: 1.2rem;
  font-weight: bold;
  height: 3rem;
  justify-content: center;
  outline: 0;
  padding: 0.1rem 0.5rem;
  text-decoration: none;

  &:active {
    box-shadow: inset var(--var-box-shadow-s);
    color: inherit;
  }

  &:focus {
    border: 2px solid #cccccc;
  }
}

.fingerprint {
  border: 0;
  border-radius: 50%;
  box-shadow: var(--var-image-shadow);
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 3rem;
}

::v-deep .fingerprint-icon {
  height: 10rem;
}

.secret-form {
  display: grid;
  margin-top: 10%;
  place-content: center;
}

.secret-input-group {
  margin-bottom: 2rem;
  position: relative;
  width: 15rem;
}

.secret-label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.secret-input {
  border: 0;
  border-radius: 10px;
  box-shadow: var(--var-box-shadow-s);
  font-size: 1rem;
  height: 3rem;
  padding: 1rem 1rem 1rem 2.5rem;
  width: 100%;

  &:focus {
    box-shadow: inset var(--var-box-shadow-s);
    outline: 0;
  }
}

.secret-location {
  font-size: 0.8rem;
  margin-top: 1rem;

  &.secret-error {
    color: var(--var-error-color);
  }
}

::v-deep .lock-icon {
  top: 2.8rem;
  left: 1rem;
  position: absolute;
  width: 0.8rem;
}
</style>
