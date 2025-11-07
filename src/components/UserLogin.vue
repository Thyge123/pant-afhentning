<template>
  <div class="login-user">
    <div class="image-container">
      <div class="image">
        <img :src="imageURL" alt="Dansk Retursystem Logo" />
      </div>
    </div>

    <div class="input-fields">
      <v-form v-model="valid">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          id="password"
          type="password"
          label="Adgangskode"
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
  export default {
    name: "UserLogin",
    data() {
      return {
        valid: false,

        email: "",
        password: "",

        imageURL:
          "https://www.greatplacetowork.dk/images/Arbejdspladsprofiler/Dansk-Retursystem/Dansk-Retursystem-logo-profil.webp",

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
        console.log("User Data:", userData);
        this.$router.push("/dashboard");
      },
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

  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    background-color: #d9d9d9;
    width: 100%;
    padding: 10px;
    height: 200px;
  }

  .image img {
    width: 300px;
    object-fit: contain;
    height: auto;
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
