<template>
  <v-container fluid>
    <v-sheet>
      <v-data-table :headers="headers" :items="categories" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Pant Kategori Administration</v-toolbar-title>
            <v-btn
              class="me-2"
              prepend-icon="mdi-plus"
              rounded="lg"
              text="Tilføj en Pant Kategori"
              border
              @click="
                dialog = true;
                isEditing = false;
              "
            ></v-btn>
          </v-toolbar>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="EditCategory(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="DeleteCategory(item.id)"> mdi-delete </v-icon>
        </template>

        <template #[`item.name`]="{ item }">
          <v-chip :color="getCategoryColor(item.name)" label small>
            {{ item.name }}
          </v-chip>
        </template>
        <template v-slot:no-data>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Ingen pant kategorier fundet. Tilføj venligst en ny pant
              kategori."
            border
            @click="
              dialog = true;
              isEditing = false;
            "
          ></v-btn>
        </template>
      </v-data-table>
    </v-sheet>
    <v-btn color="red" class="deleteAllCategories" v-if="categories.length > 0"
      >Delete All Categories</v-btn
    >
    <v-dialog v-model="dialog" max-width="1000">
      <v-card
        :subtitle="`${isEditing ? 'Opdater' : 'Opret'} en Pant Kategori`"
        :title="`${isEditing ? 'Rediger' : 'Tilføj'} en Pant Kategori`"
      >
        <template #[`text`]>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Pant Navn"
                v-model="name"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Pant Værdi"
                v-model="price"
                variant="outlined"
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <template #[`actions`]>
          <v-btn text @click="dialog = false">Annuller</v-btn>
          <v-btn
            color="primary"
            @click="isEditing ? UpdateCategory() : CreateCategory()"
          >
            {{ isEditing ? "Opdater" : "Opret" }}
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import CategoryDataService from "@/services/CategoryDataService";
export default {
  name: "PantCategoryAdmin",
  data() {
    return {
      dialog: false,
      isEditing: false,
      categoryId: null,
      name: "",
      price: "",
      categories: [],
      headers: [
        { title: "Kategori ID", key: "categoryId" },
        { title: "Pant", key: "name" },
        { title: "Værdi", key: "price" },
        { title: "", key: "actions", sortable: false, align: "end" },
      ],
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    getCategories() {
      CategoryDataService.getAll()
        .then((response) => {
          this.categories = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    CreateCategory() {
      const category = {
        name: this.name,
        price: this.price,
      };
      CategoryDataService.create(category)
        .then(() => {
          this.getCategories();
          this.dialog = false;
          this.name = "";
          this.price = "";
        })
        .catch((e) => {
          console.log(e);
        });
    },
    EditCategory(category) {
      this.categoryId = category.categoryId;
      this.name = category.name;
      this.price = category.price;
      this.dialog = true;
      this.isEditing = true;
    },
    UpdateCategory() {
      const category = {
        categoryId: this.categoryId,
        name: this.name,
        price: this.price,
      };

      CategoryDataService.update(this.categoryId, category)
        .then(() => {
          this.getCategories();
          this.dialog = false;
          this.name = "";
          this.price = "";
          this.isEditing = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    DeleteCategory(categoryId) {
      if (confirm("Er du sikker på, at du vil slette denne pant kategori?")) {
        CategoryDataService.delete(categoryId)
          .then(() => {
            this.getCategories();
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        // User canceled the deletion
        return;
      }
    },
  },
};
</script>

<style scoped>
.deleteAllCategories {
  margin-top: 16px;
  float: right;
}
</style>
