<template>
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
          v-model="localFirstname"
          :rules="nameRules"
          label="Fornavn"
          variant="outlined"
          required
        ></v-text-field>
        <v-text-field
          v-model="localLastname"
          :rules="nameRules"
          label="Efternavn"
          variant="outlined"
          required
        ></v-text-field>
        <v-text-field
          v-model="localBirthdate"
          :rules="birthdateRules"
          label="Fødselsdato"
          variant="outlined"
          required
          type="date"
        ></v-text-field>
        <v-text-field
          v-model="localEmail"
          :rules="emailRules"
          label="Email"
          required
          type="email"
          variant="outlined"
        ></v-text-field>
      </template>

      <template #[`item.2`]>
        <v-text-field
          v-model="localCity"
          :rules="cityRules"
          label="By"
          variant="outlined"
          required
        ></v-text-field>
        <v-text-field
          v-model="localZip"
          :rules="zipRules"
          label="Postnummer"
          variant="outlined"
          required
          type="number"
        ></v-text-field>
        <v-text-field
          v-model="localStreet"
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
          v-model="localPassword"
          id="password"
          label="Adgangskode"
          variant="outlined"
          @click:append-inner="visible = !visible"
          :rules="passwordRules"
          required
        ></v-text-field>
        <v-text-field
          v-model="localConfirmPassword"
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
</template>

<script>
  export default {
    name: "RegisterStepper",
    props: {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      confirmPassword: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
      street: { type: String, required: true },
      birthdate: { type: String, required: true },
    },
    data() {
      return {
        step: 1,
        valid: false,
        visible: false,
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
            if (value === this.localPassword) return true;
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
      localFirstname: {
        get() {
          return this.firstname;
        },
        set(value) {
          this.$emit("update:firstname", value);
        },
      },
      localLastname: {
        get() {
          return this.lastname;
        },
        set(value) {
          this.$emit("update:lastname", value);
        },
      },
      localEmail: {
        get() {
          return this.email;
        },
        set(value) {
          this.$emit("update:email", value);
        },
      },
      localPassword: {
        get() {
          return this.password;
        },
        set(value) {
          this.$emit("update:password", value);
        },
      },
      localConfirmPassword: {
        get() {
          return this.confirmPassword;
        },
        set(value) {
          this.$emit("update:confirmPassword", value);
        },
      },
      localCity: {
        get() {
          return this.city;
        },
        set(value) {
          this.$emit("update:city", value);
        },
      },
      localZip: {
        get() {
          return this.zip;
        },
        set(value) {
          this.$emit("update:zip", value);
        },
      },
      localStreet: {
        get() {
          return this.street;
        },
        set(value) {
          this.$emit("update:street", value);
        },
      },
      localBirthdate: {
        get() {
          return this.birthdate;
        },
        set(value) {
          this.$emit("update:birthdate", value);
        },
      },
    },
    watch: {
      valid(newVal) {
        this.$emit("update:valid", newVal);
      },
    },
  };
</script>

<style scoped>
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

  :deep(.v-text-field) {
    margin-bottom: 0.5rem;
  }

  :deep(.v-stepper-window) {
    margin-bottom: 0px !important;
    margin-top: 0px !important;
  }
</style>
