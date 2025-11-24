<template>
  <v-container fluid>
    <v-sheet>
      <v-data-table :headers="headers" :items="users" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Bruger Administration</v-toolbar-title>
            <v-btn
              v-if="users.length > 0"
              class="me-2"
              prepend-icon="mdi-plus"
              rounded="lg"
              text="Tilføj en Bruger"
              border
              @click="
                dialog = true;
                isEditing = false;
              "
            ></v-btn>
          </v-toolbar>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="EditUser(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="DeleteUser(item.userId)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Tilføj en Bruger"
            border
            @click="
              dialog = true;
              isEditing = false;
            "
          ></v-btn>
        </template>
      </v-data-table>
    </v-sheet>
    <v-btn
      color="red"
      class="deleteAllUsers"
      @click="DeleteAllUsers"
      v-if="users.length > 0"
      >Slet Alle Brugere</v-btn
    >
    <v-dialog v-model="dialog" max-width="1000">
      <v-card
        :subtitle="`${isEditing ? 'Opdater' : 'Opret'} en Bruger`"
        :title="`${isEditing ? 'Rediger' : 'Tilføj'} en Bruger`"
      >
        <template #[`text`]>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="First Name"
                v-model="firstName"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Last Name"
                v-model="lastName"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Email"
                v-model="email"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Birth Date"
                v-model="birthDate"
                variant="outlined"
                type="date"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="By"
                v-model="city"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Zip Code"
                v-model="zipCode"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Street"
                v-model="street"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" v-if="!isEditing">
              <v-text-field
                label="Password"
                v-model="password"
                type="password"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <v-divider></v-divider>
        <v-card-actions class="bg-surface-light">
          <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>

          <v-spacer></v-spacer>
          <v-btn
            v-if="isEditing"
            text="Update"
            @click="UpdateUser(userId)"
          ></v-btn>
          <v-btn text="Save" v-else @click="CreateNewUser"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import UserDataService from "@/services/UserDataService";
export default {
  name: "UsersAdmin",
  data() {
    return {
      dialog: false,
      isEditing: false,
      users: [],
      headers: [
        { title: "ID", key: "userId" },
        { title: "First Name", key: "firstName" },
        { title: "Last Name", key: "lastName" },
        { title: "Birth Date", key: "birthDate" },
        { title: "Address", key: "address" },
        { title: "Email", key: "email" },
        { title: "", key: "actions", sortable: false },
      ],
      userId: null,
      firstName: "",
      lastName: "",
      birthDate: "",
      city: "",
      zipCode: "",
      street: "",
      email: "",
      password: "",
    };
  },
  methods: {
    GetUsers() {
      UserDataService.getAll()
        .then((response) => {
          this.users = response.data;
        })
        .catch((e) => {
          console.error(e);
        });
    },

    CreateNewUser() {
      const address = `${this.street}, ${this.zipCode} ${this.city}`;

      UserDataService.create({
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: this.birthDate,
        address: address,
        email: this.email,
        password: this.password,
      })
        .then((response) => {
          console.log(response.data);
          this.GetUsers();
          this.dialog = false;
        })
        .catch((e) => {
          console.error(e);
        });
    },
    EditUser(user) {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.birthDate = user.birthDate;
      this.city = user.address.split(", ")[1].split(" ")[1];
      this.zipCode = user.address.split(", ")[1].split(" ")[0];
      this.street = user.address.split(", ")[0];
      this.email = user.email;
      this.userId = user.userId; // Store the userId for updating later
      this.password = user.password;
      this.isEditing = true;

      this.dialog = true;
    },
    UpdateUser(id) {
      const index = this.users.findIndex((user) => user.userId === id);
      const address = `${this.street}, ${this.zipCode} ${this.city}`;

      this.users[index].firstName = this.firstName;
      this.users[index].lastName = this.lastName;
      this.users[index].birthDate = this.birthDate;
      this.users[index].address = address;
      this.users[index].email = this.email;
      this.users[index].password = this.password;

      UserDataService.update(id, {
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: this.birthDate,
        address: address,
        email: this.email,
        password: this.password,
      })
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.error(e);
        });

      this.dialog = false;
      this.isEditing = false;
    },

    DeleteUser(id) {
      if (confirm("Er du sikker på, at du vil slette denne bruger?")) {
        UserDataService.delete(id)
          .then((response) => {
            console.log(response.data);
            this.users = this.GetUsers();
          })
          .catch((e) => {
            console.error(e);
          });
      } else {
        // User canceled the deletion
        return;
      }
    },

    DeleteAllUsers() {
      UserDataService.deleteAllUsers()
        .then((response) => {
          console.log(response.data);
          this.users = [];
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
  created() {
    this.GetUsers();
  },
};
</script>

<style scoped>
.deleteAllUsers {
  margin-top: 16px;
  float: right;
}
</style>
