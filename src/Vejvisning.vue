<template>
  <section class="vejvisning">

    <div class="header-title">Vejvisning</div>

    <section class="topbar">
      <section class="dots">
   
      </section>
      <button class="menu-btn">☰</button>
    </section>

    <section class="panel">
      <h3>Adresse</h3>
      <section class="pill">{{address}}</section>


      <section class="map-container">
        <img :src="mapImage" alt="Kort" />
      </section>
    </section>

</section>
</template>

<script>
export default {
  data() {
    return {
      address: "66 Perry St",
      
      mapImage: "/Users/nikolailangergaard/pant-afhentning/public/images/42e8153b7524e86a596821c52acdf06fb737a93c.png" 
    }
  }
}
</script>

<style scoped>
.vejvisning {
  background: #111;
  color: #ddd;
  padding: 20px;
  font-family: Arial, sans-serif;
}


.header-title {
  text-align: left;
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 12px;
}


.topbar {
  background: #555;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
.dots span:nth-child(1){ background:#7db3e5; }
.dots span:nth-child(2){ background:#8fcf84; }
.dots span:nth-child(3){ background:#e7de6f; }
.menu-btn {
  background:#777;
  border:none;
  padding:6px 12px;
  border-radius:6px;
  color:white;
}


.panel {
  background:#ddd;
  color:#333;
  border-radius:12px;
  padding:14px;
  margin-top:16px;
}
.panel h3 {
  margin:0 0 6px;
  font-size:16px;
}


.pill {
  background:#555;
  color:white;
  padding:6px 10px;
  border-radius:6px;
  display:inline-block;
  margin-bottom:14px;
}


.map-container img {
  width: 100%;
  border-radius: 10px;
  display: block;
}
</style>
