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
            {{ beverage.isUnregistered ? "-" : (beverageTotals[beverage.id] + " kr.") }}
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
    <dialogTemplate :totalSum="totalSum"/>
  </v-footer>
</template>

<script>
  import StreamBarcodeReader from "../components/barcodeScanner/StreamBarcodeReader.vue";
  import dialogTemplate from "@/components/scannerDialog.vue/dialogTemplate.vue";

  export default {
    components: {
      StreamBarcodeReader,
      dialogTemplate,
    },
    data() {
      return {
        scannedBarcode: "",
        scannerStatus: "Loading...",
        scanCount: 0,
        lastScanTime: 0,
        scanCooldown: 2000,
        scanOrder: [],
        beverages: [
          {
            id: "5000112545326",
            name: "Coca-Cola 0,33L",
            count: 15,
            pant: "a",
           

          },
          {
            id: "5741000109151",
            name: "Faxe Kondi 0,33L",
            count: 8,
            pant: "a",
          },
          {
            id: "5741000129401",
            name: "Faxe Kondi 1,5L",
            count: 5,
            pant: "c",

          },
          {
            id: "5740700030567",
            name: "Tuborg Grøn 0,33L",
            count: 12,
            pant: "a",

          },
          {
            id: "7044610874623",
            name: "Carlsberg 0,33L",
            count: 20,
            pant: "a",

          },
          {
            id: "5741000124123",
            name: "Pepsi Max 0,5L",
            count: 10,
            pant: "b",

          },
          {
            id: "5701598032002",
            name: "Harboe Pilsner 0,33L",
            count: 13,
            pant: "a",
          },
        ],
      };
    },
    computed: {
      sortedBeverages() {
        const scannedItems = this.beverages.filter((item) =>
          this.scanOrder.includes(item.id)
        );
        const unscannedItems = this.beverages.filter(
          (item) => !this.scanOrder.includes(item.id)
        );

        scannedItems.sort((a, b) => {
          const indexA = this.scanOrder.indexOf(a.id);
          const indexB = this.scanOrder.indexOf(b.id);
          return indexA - indexB;
        });

        return [...scannedItems, ...unscannedItems];
      },
      beverageTotals() {
        return this.beverages.reduce((totals, beverage) => {
          totals[beverage.id] = beverage.isUnregistered ? 0 : (beverage.count * this.getPantPrice(beverage.pant));
          return totals;
        }, {});
      },
      totalSum() {
        return this.beverages
          .filter((item) => !item.isUnregistered)
          .reduce((sum, item) => sum + (item.count * this.getPantPrice(item.pant)), 0)
          .toFixed(1);
      },
    },
    methods: {
      getPantPrice(pantType) {
        const pantPrices = {
          a: 1.0,
          b: 1.5,
          c: 3.0,
        };
        return pantPrices[pantType] || 0;
      },
      onDecode(text) {
        const currentTime = Date.now();

        if (currentTime - this.lastScanTime < this.scanCooldown) {
          return;
        }

        this.scannedBarcode = text;
        this.scanCount++;
        this.lastScanTime = currentTime;

        const existingItem = this.beverages.find((item) => item.id === text);

        if (existingItem) {
          existingItem.count++;
          existingItem.total =
            existingItem.count * this.getPantPrice(existingItem.pant);

          const index = this.scanOrder.indexOf(text);
          if (index > -1) {
            this.scanOrder.splice(index, 1);
          }
          this.scanOrder.unshift(text);
        } else {
          const newItem = {
            id: text,
            name: `Scanned Item: ${text}`,
            count: null,
            pant: null,
            pantValue: null,
            total: null,
            isUnregistered: true,
          };
          this.beverages.push(newItem);
          this.scanOrder.unshift(text);
        }
      },
      saveScanning() {
        alert("Scanning gemt! Total: " + this.totalSum + " kr.");
      },
      requestPickup() {
        alert("Afhentning anmodet! Total: " + this.totalSum + " kr.");
      },
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
