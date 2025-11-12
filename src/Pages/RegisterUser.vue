<template>
  <transition name="fade" mode="out-in">
    <div class="loading" v-if="isLoading">
      <LogoBanner />
    </div>
    <div class="register-user" v-else>
      <LogoBanner />
      <h2>Opret bruger til Pant Afhentning</h2>
      <div class="input-fields">
        <v-form v-model="valid">
          <v-stepper
            v-model="step"
            prev-text="Tilbage"
            next-text="Næste"
            :items="['Personlig Info', 'Adresse', 'Sikkerhed']"
            alt-labels
          >
            <template #[`item.1`]>
              <v-text-field
                v-model="firstname"
                :rules="nameRules"
                label="Fornavn"
                variant="outlined"
                required
              ></v-text-field>
              <v-text-field
                v-model="lastname"
                :rules="nameRules"
                label="Efternavn"
                variant="outlined"
                required
              ></v-text-field>
              <v-text-field
                v-model="birthdate"
                :rules="[]"
                label="Fødselsdato"
                variant="outlined"
                required
                type="date"
              ></v-text-field>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                required
                type="email"
                variant="outlined"
              ></v-text-field>
            </template>

            <template #[`item.2`]>
              <v-text-field
                v-model="city"
                :rules="cityRules"
                label="By"
                variant="outlined"
                required
              ></v-text-field>
              <v-text-field
                v-model="zip"
                :rules="zipRules"
                label="Postnummer"
                variant="outlined"
                required
                type="number"
              ></v-text-field>
              <v-text-field
                v-model="street"
                :rules="streetRules"
                label="Vejnavn og husnummer"
                variant="outlined"
                required
              ></v-text-field>
            </template>

            <template #[`item.3`]>
              <v-text-field
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                v-model="password"
                id="password"
                label="Adgangskode"
                variant="outlined"
                @click:append-inner="visible = !visible"
                :rules="passwordRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                id="confirmPassword"
                type="password"
                label="Bekræft Adgangskode"
                variant="outlined"
                :rules="confirmPasswordRules"
                required
              ></v-text-field>
            </template>
          </v-stepper>
        </v-form>
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
  export default {
    components: {
      LogoBanner,
    },
    name: "RegisterUser",
    data() {
      return {
        isLoading: true,
        step: 1,
        valid: false,
        visible: false,
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
        nameRules: [
          (value) => {
            if (value) return true;

            return "Navn er påkrævet.";
          },
          (value) => {
            if (value?.length <= 10) return true;

            return "Navn skal være mindre end 10 tegn.";
          },
        ],
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
          (value) => {
            if (value?.length >= 6) return true;

            return "Adgangskode skal være mindst 6 tegn.";
          },
          (value) => {
            if (/[A-Z]/.test(value)) return true;

            return "Adgangskode skal indeholde mindst ét stort bogstav.";
          },
        ],
        confirmPasswordRules: [
          (value) => {
            if (value) return true;
            return "Bekræftelse af adgangskode er påkrævet.";
          },
          (value) => {
            if (value === this.password) return true;
            return "Adgangskoderne skal være ens.";
          },
        ],
        cityRules: [
          (value) => {
            if (value) return true;

            return "By er påkrævet.";
          },
        ],
        zipRules: [
          (value) => {
            if (value) return true;

            return "Postnummer er påkrævet.";
          },
          (value) => {
            if (/^\d{4}$/.test(value)) return true;

            return "Postnummer skal være 4 cifre.";
          },
        ],
        streetRules: [
          (value) => {
            if (value) return true;

            return "Vejnavn og nummer er påkrævet.";
          },

          (value) => {
            if (/\D+\s\d+/.test(value)) return true;

            return "Vejnavn skal indeholde både navn og nummer.";
          },
        ],
        birthdateRules: [
          (value) => {
            if (value) return true;

            return "Fødselsdato er påkrævet.";
          },
        ],
      };
    },
    computed: {
      buttonStyle() {
        if (this.isFormComplete) {
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
        // Handle user creation logic
        const userData = {
          username: this.username,
          email: this.email,
          password: this.password,
        };
        console.log("User Data:", userData);
        this.creatingUser = true;
        // Simulate user creation delay
        setTimeout(() => {
          this.creatingUser = false;
          this.$router.push("/login");
        }, 2000);
      },
    },
    mounted() {
      // Simulate loading delay
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

  /*
    ::v-deep .v-stepper-header {
      box-shadow: none !important;
    }
  */
  :deep(.v-stepper-header) {
    box-shadow: none !important;
    width: 100% !important;
  }

  :deep(.v-stepper--alt-labels) .v-stepper-item {
    flex-basis: 0;
  }

  :deep(.v-window__container) {
    margin-top: 5px !important;
  }

  .input-fields :deep(.v-text-field) {
    margin-bottom: 0.5rem;
  }

  .input-fields {
    margin-top: 2%;
    width: 90%;
  }

  :deep(.v-stepper-window) {
    margin-bottom: 0px !important;
    margin-top: 0px !important;
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
