<template>
  <v-container fluid>
    <v-sheet>
      <v-data-table :headers="headers" :items="products" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Produkt Administration</v-toolbar-title>
            <v-btn
              v-if="products.length > 0"
              class="me-2"
              prepend-icon="mdi-plus"
              rounded="lg"
              text="Tilføj et Produkt"
              border
              @click="
                dialog = true;
                isEditing = false;
              "
            ></v-btn>
          </v-toolbar>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="EditProduct(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="DeleteProduct(item.id)"> mdi-delete </v-icon>
        </template>

        <template v-slot:no-data>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Tilføj et nyt produkt."
            border
            @click="
              dialog = true;
              isEditing = false;
            "
          ></v-btn>
        </template>
      </v-data-table>
    </v-sheet>
    <v-btn color="red" class="deleteAllProducts" v-if="products.length > 0"
      >Slet Alle Produkter</v-btn
    >
    <v-dialog v-model="dialog" max-width="1000">
      <v-card
        :subtitle="`${isEditing ? 'Opdater' : 'Opret'} et Produkt`"
        :title="`${isEditing ? 'Rediger' : 'Tilføj'} et Produkt`"
      >
        <template #[`text`]>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                label="Produkt Navn"
                required
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="barcode"
                label="Stregkode"
                required
                variant="outlined"
              ></v-text-field>
              <v-select
                :items="categories"
                v-model="categoryId"
                item-title="name"
                item-value="categoryId"
                label="Produkt Kategori"
                required
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
        </template>
        <v-divider></v-divider>
        <template #[`actions`]>
          <v-btn text @click="dialog = false"> Annuller </v-btn>
          <v-btn
            color="primary"
            @click="isEditing ? UpdateProduct() : CreateProduct()"
          >
            {{ isEditing ? "Opdater" : "Opret" }}
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ProductDataService from "@/services/ProductDataService";
import CategoryDataService from "@/services/CategoryDataService";

export default {
  name: "ProductsAdmin",
  data() {
    return {
      dialog: false,
      isEditing: false,
      products: [],
      headers: [
        { title: "Produkt ID", key: "productId" },
        { title: "Navn", key: "name" },
        { title: "Pant-kategori", key: "category.name" },
        { title: "", key: "actions", sortable: false, align: "end" },
      ],
      categories: [],
      id: null,
      name: "",
      categoryId: null,
      barcode: "",
    };
  },
  /*
  computed: {
    productsWithCategoryNames() {
      return this.products.map((product) => ({
        ...product,
        categoryName:
          this.categories.find((cat) => cat.categoryId === product.categoryId)
            ?.name || product.categoryId,
      }));
    },
  },
  */
  methods: {
    getProducts() {
      ProductDataService.getAll()
        .then((response) => {
          this.products = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getCategories() {
      CategoryDataService.getAll()
        .then((response) => {
          this.categories = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    CreateProduct() {
      const newProduct = {
        name: this.name,
        categoryId: this.categoryId,
        barcode: this.barcode,
      };
      ProductDataService.create(newProduct)
        .then(() => {
          this.getProducts();
          this.dialog = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    EditProduct(item) {
      this.isEditing = true;
      this.id = item.productId;
      this.name = item.name;
      this.categoryId = item.categoryId;
      this.barcode = item.barcode;
      this.dialog = true;
    },
    UpdateProduct() {
      const updatedProduct = {
        productId: this.id,
        name: this.name,
        categoryId: this.categoryId,
        barcode: this.barcode,
      };
      ProductDataService.update(this.id, updatedProduct)
        .then(() => {
          this.getProducts();
          this.dialog = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    DeleteProduct(productId) {
      if (confirm("Er du sikker på, at du vil slette dette produkt?")) {
        ProductDataService.delete(productId)
          .then(() => {
            this.getProducts();
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        return;
      }
    },
    DeleteAllProducts() {
      if (confirm("Er du sikker på, at du vil slette alle produkter?")) {
        ProductDataService.deleteAll()
          .then(() => {
            this.getProducts();
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        return;
      }
    },
  },
  created() {
    this.getProducts();
    this.getCategories();
  },
};
</script>

<style scoped>
.deleteAllProducts {
  margin-top: 16px;
  float: right;
}
</style>
