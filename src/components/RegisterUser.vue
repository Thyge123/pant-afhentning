<template>
  <div class="register-user">
    <div class="image-container">
      <div class="image">
        <img :src="imageURL" alt="Dansk Retursystem Logo" />
      </div>
    </div>
    <div>
      <h2>Opret Bruger Til Pant Afhentning</h2>
    </div>
    <div class="input-fields">
      <v-form v-model="valid">
        <v-stepper
          v-model="step"
          :items="['Personlig Info', 'Adresse', 'Sikkerhed']"
          alt-labels
        >
          <template #[`item.1`]>
            <v-text-field
              v-model="firstname"
              :rules="nameRules"
              label="Fornavn"
              required
            ></v-text-field>
            <v-text-field
              v-model="lastname"
              :rules="nameRules"
              label="Efternavn"
              required
            ></v-text-field>
            <v-text-field
              v-model="birthdate"
              :rules="[]"
              label="Fødselsdato"
              required
              type="date"
            ></v-text-field>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="Email"
              required
              type="email"
            ></v-text-field>
          </template>

          <template #[`item.2`]>
            <v-text-field
              v-model="street"
              :rules="streetRules"
              label="Vejnavn og husnummer"
              required
            ></v-text-field>
            <v-text-field
              v-model="city"
              :rules="cityRules"
              label="By"
              required
            ></v-text-field>
            <v-text-field
              v-model="zip"
              :rules="zipRules"
              label="Postnummer"
              required
              type="number"
            ></v-text-field>
          </template>

          <template #[`item.3`]>
            <v-text-field
              v-model="password"
              id="password"
              type="password"
              label="Adgangskode"
              :rules="passwordRules"
              required
            ></v-text-field>
            <v-text-field
              v-model="confirmPassword"
              id="confirmPassword"
              type="password"
              label="Bekræft Adgangskode"
              :rules="confirmPasswordRules"
              required
            ></v-text-field>
          </template>
        </v-stepper>
      </v-form>
    </div>
    <v-btn :disabled="!valid" type="submit" :style="buttonStyle"
      >Opret bruger</v-btn
    >
    <p class="login-link">
      <router-link to="/login" style="color: #009fe4">
        Har du allerede en bruger?</router-link
      >
    </p>
  </div>
</template>

<script>
  export default {
    name: "RegisterUser",
    data() {
      return {
        step: 1,
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
        imageURL:
          "https://www.greatplacetowork.dk/images/Arbejdspladsprofiler/Dansk-Retursystem/Dansk-Retursystem-logo-profil.webp",
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
      CreateUser() {
        // Handle user creation logic

        const userData = {
          username: this.username,
          email: this.email,
          password: this.password,
        };
        console.log("User Data:", userData);
      },
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

  ::v-deep .v-stepper-header {
    box-shadow: none !important;
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
</style>
