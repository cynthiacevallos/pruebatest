<template>
  <div class="loader" v-show="spinner">

    <v-progress-circular class="spinner" :size="100" :width="7" color="green" indeterminate>
    <span>Cargando</span>

    </v-progress-circular>
  </div>
  <div>

    <v-dialog v-model="dialog" max-width="800">
      <v-card>
        <v-card-title class="text-center">Añadir Incidencia</v-card-title>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col md="12">
                <v-autocomplete label="Paciente" :items="pacientes" :item-title="(item) => getNombreCompleto(item)"
                  variant="outlined"></v-autocomplete>
                <!-- <v-text-field color="primary" label="Paciente" variant="outlined"></v-text-field> -->
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6">
                <v-autocomplete label="Sala" :items="['SALA 1','SALA 2','SALA 3','SALA 4']" variant="outlined"></v-autocomplete>
              </v-col>
              <v-col md="6">
                <v-autocomplete label="Personal" variant="outlined" :items="personal" :item-title="(item)=>getNombrePersonal(item)"></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6">
                <v-autocomplete label="Unidad de Atencion" variant="outlined" :items="unidades" item-title="UnidadAtencion"></v-autocomplete>
              </v-col>
              <v-col md="6">
                <v-text-field label="Turno" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <v-textarea label="Descripcion" variant="outlined"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6">
                <v-text-field label="Procedimiento" variant="outlined"></v-text-field>
              </v-col>
              <v-col md="6">
                <v-text-field label="Detalle de Procedimiento" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <v-text-field label="Procedimientos Registrados" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-col class="d-flex justify-end">
            <v-btn color="red" @click="dialog = false">CANCELAR</v-btn>
            <v-btn color="green" @click="guardar">GUARDAR</v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <NavBar :descrip-cas="centro" :nombre="nombre" />
    <v-card class="tabla" flat>
      <v-card-title class="d-flex align-center pe-2">
        <v-icon class="mr-3" icon="mdi-label"></v-icon>Incidencias de Enfermeria
        <v-spacer></v-spacer>
        <v-text-field class="mx-4" v-model="search" prepend-inner-icon="mdi-magnify" density="compact" label="Buscar"
          single-line flat hide-details variant="solo-filled"></v-text-field>
        <v-btn color="success" @click="agregar" variant="text">AÑADIR INCIDENCIA</v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table class="my-4 mx-4" v-model:search="search" :headers="headers" :items="elementos">
        <template v-slot:[`item.acciones`]>
          <v-btn color="indigo" variant="outlined">VER DETALLES</v-btn>
        </template>
      </v-data-table>

      <!-- <v-data-table class="my-4" v-model:search="search" :items="items">
        <template v-slot:[`header.stock`]>
          <div class="text-end">Stock</div>
        </template>
        <template v-slot:[`item.image`]="{ item }">
          <v-card class="my-2" elevation="2" rounded>
            <v-img :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.image}`" height="64" cover></v-img>
          </v-card>
        </template>
        <template v-slot:[`item.rating`]="{ item }">
          <v-rating :model-value="item.rating" color="orange-darken-2" density="compact" size="small" readonly></v-rating>
        </template>
        <template v-slot:[`item.stock`]="{ item }">
          <div class="text-end">
            <v-chip :color="item.stock ? 'green' : 'red'" :text="item.stock ? 'In stock' : 'Out of stock'"
              class="text-uppercase" label size="small"></v-chip>
          </div>
        </template>
      </v-data-table> -->
    </v-card>

  </div>
</template>

<style scoped>
.spinner {
  position: absolute;
  left: 45%;
  top: 35%;
  z-index: 3;
}

.loader {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  z-index: 2;
  position: absolute;
  height: 100%;
  top: 0;
}

.text-center {
  margin: 10px 0;
  font-size: 24px;
  text-transform: uppercase;
}

.row {
  margin-top: 0;
}

.v-col-md-6,
.v-col-md-12 {
  padding: 0 10px;
}

.tabla {
  width: 70%;
  margin-right: auto !important;
  margin-left: auto !important;
  margin-top: 10px;

}
</style>

<script>
import NavBar from '@/components/NavBar.vue';
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
export const RUTA_API = process.env.VUE_APP_API;
// import router from "@/router";
import axios from "axios";
export default {
  components: { NavBar },
  data() {
    return {
      order: 1,
      nombre: sessionStorage.getItem("nombre"),
      usuario: sessionStorage.getItem("usuario"),
      centro: sessionStorage.getItem("centro"),
      search: "",
      headers: [],
      elementos: [],
      dialog: false,
      spinner: false,
      items: [
        {
          name: 'Nebula GTX 3080',
          image: '1.png',
          price: 699.99,
          rating: 5,
          stock: true,
        },
        {
          name: 'Galaxy RTX 3080',
          image: '2.png',
          price: 799.99,
          rating: 4,
          stock: false,
        },
        {
          name: 'Orion RX 6800 XT',
          image: '3.png',
          price: 649.99,
          rating: 3,
          stock: true,
        },
        {
          name: 'Vortex RTX 3090',
          image: '4.png',
          price: 1499.99,
          rating: 4,
          stock: true,
        },
        {
          name: 'Cosmos GTX 1660 Super',
          image: '5.png',
          price: 299.99,
          rating: 4,
          stock: false,
        },
      ],
      pacientes: [],
      unidades: [],
      personal: []
    }
  },
  computed:{
  
  },
  methods: {
    getNombreCompleto(item) {
      return item.ape_pat + ' ' + item.ape_mat + ' ' + item.nombres
    },
    getNombrePersonal(item){
      return item.apePatPer + ' ' + item.apeMatPer + ' ' + item.nomPer

    },
    async getPersonal(){
      let auth = await axios.post(RUTA_API + "/api/token/", {
        username: USUARIO,
        password: PASSWORD,
      })
      let res = await axios.get(RUTA_API + "/personal/", {
        headers: { Authorization: "Bearer " + auth.data.access },
      })
      this.personal = res.data.filter((e)=>e.cargoPer == "ENFERMERA")
    },
    async getUnidad(){
      let auth = await axios.post(RUTA_API + "/api/token/", {
        username: USUARIO,
        password: PASSWORD,
      })
      let res = await axios.get(RUTA_API + "/unidadAtencion/", {
        headers: { Authorization: "Bearer " + auth.data.access },
      })
      this.unidades = res.data
    },
 
    async getPacientes() {
      let auth = await axios.post(RUTA_API + "/api/token/", {
        username: USUARIO,
        password: PASSWORD,
      })
      let res = await axios.get(RUTA_API + "/paciente/", {
        headers: { Authorization: "Bearer " + auth.data.access },
      })
      this.pacientes = res.data

      // .then((response) => {
      //   this.auth = "Bearer " + response.data.access;
      //   axios.get(RUTA_API + "/paciente/", {
      //     headers: { Authorization: this.auth },
      //   }).then((res) => {
      //     this.pacientes = res.data
      //     // console.log('Resultado: ',res.data)
      //   }).catch((res) => {
      //     console.log("Error: ", res)
      //   })
      // })
    },
    guardar() {

    },
    async agregar() {
      this.spinner = true
      await this.getPacientes()
      await this.getUnidad()
      await this.getPersonal()
      this.spinner = false
      this.dialog = true
      // console.log('agregar')
    },
  },
  mounted() {
    this.headers = [
      { title: 'Paciente', key: 'paciente' },
      { title: 'Incidencia', key: 'incidencia' },
      { title: 'Personal', key: 'personal' },
      { title: 'Unidad', key: 'unidad' },
      { title: 'Turno', key: 'turno' },
      { title: 'Acciones', key: 'acciones', sortable: false },
    ]
    this.elementos = [
      {
        paciente: "ALICIA BERTHA ABAD PAZ",
        incidencia: 'Atención de Urgencias	- Sobrehidratación',
        personal: "ACOSTA SALDANA MARIA ELENA",
        unidad: "ESTERILIZACION",
        turno: "TURNO 1",
      }
    ]
    // this.getPacientes()
    axios.post(RUTA_API + "/api/token/", {
      username: USUARIO,
      password: PASSWORD,
    }).then((response) => {
      this.auth = "Bearer " + response.data.access;
      //unidadAtencion
      axios.get(RUTA_API + "/incidenciaEnfermeriaDetalle/" , {
        headers: { Authorization: this.auth },
      }).then((res)=>{
        console.log(res.data)
      }).catch((res)=>{
        console.log("Error: ",res)
      })
    })


    // this.elementos = [
    //   {
    //     paciente: "Paciente 1",
    //     sala: "Sala 1",
    //     personal: "Personal 1",
    //     unidad: "Unidad 1",
    //     turno: "Turno 1",
    //     acciones: "",
    //     descripcion: ""
    //   },
    //   {
    //     paciente: "Paciente 2",
    //     sala: "Sala 2",
    //     personal: "Personal 2",
    //     unidad: "Unidad 2",
    //     turno: "Turno 2",
    //     acciones: "",
    //     descripcion: ""

    //   },

    // ]
  }
}
</script>