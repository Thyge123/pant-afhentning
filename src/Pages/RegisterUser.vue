<template>
  <transition name="fade" mode="out-in">
    <div class="loading" v-if="isLoading">
      <LogoBanner />
    </div>
    <div class="register-user" v-else>
      <LogoBanner />
      <h2>Opret bruger til Pant Afhentning</h2>
      <div class="input-fields">
        <RegisterStepper
          v-model:firstname="firstname"
          v-model:lastname="lastname"
          v-model:email="email"
          v-model:password="password"
          v-model:confirmPassword="confirmPassword"
          v-model:city="city"
          v-model:zip="zip"
          v-model:street="street"
          v-model:birthdate="birthdate"
          v-model:valid="valid"
        />
      </div>
      <v-btn
        :disabled="!isFormComplete"
        type="submit"
        @click="CreateUser()"
        :style="buttonStyle"
        v-if="!creatingUser"
        >Opret bruger</v-btn
      >
      <v-btn v-else disabled>
        <v-progress-circular
          indeterminate
          color="white"
          size="20"
        ></v-progress-circular>
        <span class="ml-2">Opretter bruger...</span>
      </v-btn>
      <p class="login-link">
        <router-link to="/login" style="color: #009fe4">
          Har du allerede en bruger?</router-link
        >
      </p>
    </div>
  </transition>
</template>

<script>
import LogoBanner from "@/components/LogoBanner.vue";
import RegisterStepper from "@/components/RegisterStepper.vue";
//import { createUser } from "@/services/users.api.js";
import UserDataService from "@/services/UserDataService";

export default {
  components: {
    LogoBanner,
    RegisterStepper,
  },
  name: "RegisterUser",
  data() {
    return {
      isLoading: true,
      valid: false,
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      city: "",
      zip: "",
      street: "",
      birthdate: "",
      creatingUser: false,
    };
  },
  computed: {
    buttonStyle() {
      if (this.isFormComplete) {
        return {
          backgroundColor: "#93c14e",
          color: "white",
        };
      } else {
        return {
          backgroundColor: "#cccccc",
          color: "#666666",
        };
      }
    },
    isFormComplete() {
      return (
        this.firstname &&
        this.lastname &&
        this.birthdate &&
        this.email &&
        this.city &&
        this.zip &&
        this.street &&
        this.password &&
        this.confirmPassword &&
        this.password === this.confirmPassword &&
        this.valid
      );
    },
  },
  methods: {
    CreateUser() {
      const address = `${this.street}, ${this.zip} ${this.city}`;

      const userData = {
        firstName: this.firstname,
        lastName: this.lastname,
        email: this.email,
        password: this.password,
        birthDate: this.birthdate,
        address: address,
      };
      console.log("User Data:", userData);
      this.creatingUser = true;

      UserDataService.create(userData)
        .then((response) => {
          console.log("User created successfully:", response);
          setTimeout(() => {
            this.creatingUser = false;
            this.$router.push("/login");
          }, 1000);
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          this.creatingUser = false;
        });
    },
  },
  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  },
};
</script>

<style scoped>
.register-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d9d9d9;
  height: 100%;
}

.input-fields {
  margin-top: 2%;
  width: 90%;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
