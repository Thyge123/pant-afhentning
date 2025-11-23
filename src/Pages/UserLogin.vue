<template>
  <div class="login-user">
    <LogoBanner />
    <div>
      <h2>Login til Pant Afhentning</h2>
    </div>
    <div class="input-fields">
      <v-form v-model="valid">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required
          variant="outlined"
        ></v-text-field>

        <v-text-field
          v-model="password"
          id="password"
          type="password"
          label="Adgangskode"
          variant="outlined"
          :rules="passwordRules"
          required
        ></v-text-field>
      </v-form>
    </div>
    <v-btn
      :disabled="!valid"
      type="submit"
      @click="loginUser"
      :style="buttonStyle"
      >Log ind</v-btn
    >
    <p class="login-link">
      <router-link to="/register" style="color: #009fe4">
        Har du ikke en bruger?</router-link
      >
    </p>
  </div>
</template>

<script>
import LogoBanner from "@/components/LogoBanner.vue";
import UserDataService from "@/services/UserDataService";
export default {
  name: "UserLogin",
  components: {
    LogoBanner,
  },
  data() {
    return {
      valid: false,
      loggedInUser: null,
      email: "",
      password: "",

      emailRules: [
        (value) => {
          if (value) return true;

          return "E-mail er påkrævet.";
        },
        (value) => {
          if (/.+@.+\..+/.test(value)) return true;

          return "E-mail skal være gyldig.";
        },
      ],
      passwordRules: [
        (value) => {
          if (value) return true;

          return "Adgangskode er påkrævet.";
        },
      ],
    };
  },
  computed: {
    buttonStyle() {
      if (this.valid) {
        return {
          backgroundColor: "#93c14e", // Green color for valid state
          color: "white",
        };
      } else {
        return {
          backgroundColor: "#cccccc", // Grey color for invalid state
          color: "#666666",
        };
      }
    },
  },
  methods: {
    loginUser() {
      // Handle user login logic
      const userData = {
        email: this.email,
        password: this.password,
      };
      UserDataService.login(userData)
        .then((response) => {
          if (response.data.message === "Login successful") {
            this.loggedInUser = response.data.user;
            this.$router.push("/");
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert("Login failed: " + error.response.data.message);
          } else {
            alert("An error occurred during login. Please try again.");
            console.error(error);
          }
        });
    },
  },
  provide() {
    return {
      getLoggedInUser: () => this.loggedInUser,
    };
  },
};
</script>

<style scoped>
.login-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.input-fields {
  margin-top: 10%;
  width: 80%;
}

form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

button {
  background-color: #93c14e;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  width: 50%;
  margin: 20px auto 0 auto;
  border-radius: 5px;
}

.login-link {
  margin: 1rem auto;
}
</style>
