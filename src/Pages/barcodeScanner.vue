<template>
  <v-container class="pa-2 scanner-page">
    <v-container class="pa-0" fluid>
      <StreamBarcodeReader
        @decode="onDecode"
        @loaded="onLoaded"
        @result="onResult"
      ></StreamBarcodeReader>
    </v-container>
    <v-container class="pb-16">
      <v-row no-gutters class="ma-1 justify-between">
        <v-col cols="8" class="d-flex-row align-center">
          <p class="text-overline font-weight-bold">Navn</p>
        </v-col>
        <v-col cols="2">
          <p class="text-overline font-weight-bold">Antal</p>
        </v-col>
        <v-col cols="2" class="d-flex align-center justify-center">
          <p class="text-overline font-weight-bold">Total</p>
        </v-col>
        <v-divider :thickness="2" />
      </v-row>
      <v-row
        v-for="(beverage, index) in sortedBeverages"
        :key="beverage.id"
        no-gutters
        class="ma-1 justify-between"
      >
        <v-col cols="8" class="d-flex align-center">
          <p class="text-caption font-weight-medium">{{ beverage.name }}</p>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <p class="text-caption">
            {{ beverage.isUnregistered ? "-" : beverage.count }}
          </p>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <p class="text-caption">
            {{
              beverage.isUnregistered
                ? "-"
                : beverageTotals[beverage.id] + " kr."
            }}
          </p>
        </v-col>
        <v-divider :thickness="index === sortedBeverages.length - 1 ? 2 : 1" />
      </v-row>
      <v-row no-gutters class="ma-1 justify-between">
        <v-col cols="10">
          <p class="text-caption font-weight-black">Total:</p>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <p class="text-caption font-weight-black">{{ totalSum }} kr.</p>
        </v-col>
        <v-divider />
      </v-row>
    </v-container>
  </v-container>
  <v-footer elevation="20" class="scanner-footer bg-white">
    <dialogTemplate
      :totalSum="totalSum"
      :beverages="beverages"
      @activity-updated="handleActivityUpdated"
    />
  </v-footer>
</template>

<script>
import StreamBarcodeReader from "../components/barcodeScanner/StreamBarcodeReader.vue";
import dialogTemplate from "@/components/scannerDialog.vue/dialogTemplate.vue";
import ProductDataService from "@/services/ProductDataService";

export default {
  components: {
    StreamBarcodeReader,
    dialogTemplate,
  },
  data() {
    return {
      // Currently scanned barcode text
      scannedBarcode: "",
      // Status message for the scanner
      scannerStatus: "Loading...",
      // Total number of scans performed
      scanCount: 0,
      // Timestamp of last successful scan
      lastScanTime: 0,
      // Cooldown period in milliseconds to prevent duplicate scans
      scanCooldown: 2000,
      // Array tracking the order of scanned items (most recent first)
      scanOrder: [],
      // Array of scanned beverages with count and details
      beverages: [],
      // Array of all available products from API
      products: [],
    };
  },
  inject: ["loggedInUser", "refreshActivities"],
  computed: {
    // Sort beverages with scanned items first (in scan order), then unscanned items
    sortedBeverages() {
      // Filter items that have been scanned
      const scannedItems = this.beverages.filter((item) =>
        this.scanOrder.includes(item.id)
      );
      // Filter items that haven't been scanned yet
      const unscannedItems = this.beverages.filter(
        (item) => !this.scanOrder.includes(item.id)
      );

      // Sort scanned items by scan order (most recent first)
      scannedItems.sort((a, b) => {
        const indexA = this.scanOrder.indexOf(a.id);
        const indexB = this.scanOrder.indexOf(b.id);
        return indexA - indexB;
      });

      // Return scanned items first, followed by unscanned items
      return [...scannedItems, ...unscannedItems];
    },
    // Calculate total price for each beverage (count * pant price)
    beverageTotals() {
      return this.beverages.reduce((totals, beverage) => {
        totals[beverage.id] = beverage.isUnregistered
          ? 0
          : beverage.count * beverage.pantPrice;
        return totals;
      }, {});
    },
    // Calculate total sum of all registered beverages
    totalSum() {
      return this.beverages
        .filter((item) => !item.isUnregistered)
        .reduce((sum, item) => sum + item.count * item.pantPrice, 0)
        .toFixed(1);
    },
  },
  methods: {
    // Fetch all products from the API
    getAllProducs() {
      ProductDataService.getAll()
        .then((response) => {
          this.products = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // Handle barcode scan event
    onDecode(text) {
      const currentTime = Date.now();

      // Prevent duplicate scans within cooldown period (2 seconds)
      if (currentTime - this.lastScanTime < this.scanCooldown) {
        return;
      }

      // Update scan tracking
      this.scannedBarcode = text;
      this.scanCount++;
      this.lastScanTime = currentTime;

      // Check if scanned barcode matches a known product
      const product = this.products.find((p) => p.barcode === text);
      console.log(this.beverages);

      if (product) {
        console.log("Product found:", product);
        // Check if product already exists in beverages array
        const existingItem = this.beverages.find((item) => item.id === text);

        if (existingItem) {
          // Increment count for existing item
          existingItem.count++;

          // Move item to top of scan order
          const index = this.scanOrder.indexOf(text);
          if (index > -1) {
            this.scanOrder.splice(index, 1);
          }
          this.scanOrder.unshift(text);
        } else {
          // Add new product to beverages array
          const newItem = {
            id: product.productId,
            barcode: text,
            name: product.name,
            count: 1,
            pantPrice: product.category.price,
            categoryName: product.category.name,
            isUnregistered: false,
          };
          this.beverages.push(newItem);
          this.scanOrder.unshift(text);
        }
        return;
      }

      // Handle unregistered product (barcode not found in database)
      const existingUnregistered = this.beverages.find(
        (item) => item.id === text
      );

      if (existingUnregistered) {
        // Move existing unregistered item to top of scan order
        const index = this.scanOrder.indexOf(text);
        if (index > -1) {
          this.scanOrder.splice(index, 1);
        }
        this.scanOrder.unshift(text);
      } else {
        // Create new unregistered item
        const newItem = {
          id: text,
          barcode: text,
          name: `Ukendt produkt: ${text}`,
          count: null,
          pantPrice: 0,
          categoryName: null,
          isUnregistered: true,
        };
        this.beverages.push(newItem);
        this.scanOrder.unshift(text);
      }
    },
    // Save current scanning session
    saveScanning() {
      alert("Scanning gemt! Total: " + this.totalSum + " kr.");
    },
    // Request pickup for scanned items
    requestPickup() {
      alert("Afhentning anmodet! Total: " + this.totalSum + " kr.");
    },
    // Handle activity update event from child component
    handleActivityUpdated(userId) {
      this.refreshActivities(userId);
    },
  },
  created() {
    // Fetch products when component is created
    this.getAllProducs();
  },
};
</script>

<style scoped>
.scanner-page {
  padding-bottom: 170px;
}

.scanner-footer {
  position: fixed;
  width: 100%;
  bottom: 70px;
  left: 0;
  right: 0;
  z-index: 999;
}
</style>
