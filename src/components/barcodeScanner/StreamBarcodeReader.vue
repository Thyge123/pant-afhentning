<template>
  <div class="scanner-container">
    <div v-show="!isLoading">
      <video poster="data:image/gif,AAAA" ref="scanner"></video>
      <div class="overlay-element" :class="{ 'scan-success': showSuccess }"></div>
      <div class="laser"></div>
    </div>
  </div>
</template>

<script>
import { BrowserMultiFormatReader, Exception } from "@zxing/library";

export default {
  name: "stream-barcode-reader",

  data() {
    return {
      isLoading: true,
      showSuccess: false,
      codeReader: new BrowserMultiFormatReader(),
      isScanning: false,
      isMediaStreamAPISupported: navigator && navigator.mediaDevices && "enumerateDevices" in navigator.mediaDevices,
    };
  },

  mounted() {
    if (!this.isMediaStreamAPISupported) {
      throw new Exception("Media Stream API is not supported");
    }

    this.start();
    this.$refs.scanner.oncanplay = () => {
      this.isLoading = false;
      this.$emit("loaded");
    };
  },

  beforeUnmount() {
    this.stop();
  },

  methods: {
    start() {
      if (this.isScanning) return;
      this.isScanning = true;
      
      this.codeReader.decodeFromVideoDevice(undefined, this.$refs.scanner, (result) => {
        if (result && this.isScanning) {
          console.log('StreamBarcodeReader: Barcode detected!', result.text);
          this.showSuccessAnimation();
          this.$emit("decode", result.text);
          this.$emit("result", result);
        }
      });
    },
    stop() {
      this.isScanning = false;
      this.codeReader.reset();
    },
    showSuccessAnimation() {
      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
      }, 800);
    },
  },
};
</script>

<style scoped>
video {
  max-width: 100%;
  max-height: 100%;
}
.scanner-container {
  position: relative;
}

.overlay-element {
  position: absolute;
  top: 0;
  width: 100%;
  height: 97%;
  background: rgba(30, 30, 30, 0.5);
  transition: background-color 0.5s ease-out;

  -webkit-clip-path: polygon(0% 0%, 0% 100%, 20% 100%, 20% 20%, 80% 20%, 80% 80%, 20% 80%, 20% 100%, 100% 100%, 100% 0%);
  clip-path: polygon(0% 0%, 0% 100%, 20% 100%, 20% 20%, 80% 20%, 80% 80%, 20% 80%, 20% 100%, 100% 100%, 100% 0%);
}

.overlay-element.scan-success {
  background: rgba(var(--v-theme-secondary), 0.5);
  animation: success-pulse 0.8s ease-out;
}

.laser {
  width: 60%;
  margin-left: 20%;
  background-color: tomato;
  height: 1px;
  position: absolute;
  top: 20%;
  z-index: 2;
  box-shadow: 0 0 4px red;
  -webkit-animation: scanning 4s infinite;
  animation: scanning 4s infinite;    
}
@-webkit-keyframes scanning {
  50% {
    -webkit-transform: translateY(158px);
    transform: translateY(158px);
  }
}
@keyframes scanning {
  50% {
    -webkit-transform: translateY(158px);
    transform: translateY(158px);
  }
}

@keyframes success-pulse {
  0% {
    background: rgba(30, 30, 30, 0.5);
  }
  30% {
    background: rgba(var(--v-theme-secondary), 0.5);
  }
  70% {
    background: rgba(var(--v-theme-secondary), 0.5);
  }
  100% {
    background: rgba(30, 30, 30, 0.5);
  }
}
</style>