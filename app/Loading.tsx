import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, TextInput, ActivityIndicator } from 'react-native';
import { Box, Grid2, Typography } from '@mui/material'; // Asegúrate de que este import sea correcto
import { Link, useRouter } from 'expo-router';
import Save, { GetValueFor } from '@/components/utils/Store';
import * as Progress from 'react-native-progress';



export default function Loading() {
  const [selectedCounter, setSelectedCounter] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [anaquel, setanaquel] = useState('');
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const historyData = [
    { id: '1', date: { month: "Oct", day: "9", hour: "2pm" }, counter: 'Mostrador A', address: 'Calle 123, Ciudad', percentage: 40 },
    { id: '2', date: { month: "Oct", day: "9", hour: "2pm" }, counter: 'Mostrador B', address: 'Avenida 456, Pueblo', percentage: 90 },
    { id: '3', date: { month: "Oct", day: "9", hour: "2pm" }, counter: 'Mostrador C', address: 'Plaza 789, Villa', percentage: 60 },
  ];


  const getprocessresult = async (url: string) => {
    let resultadoexitoso = false;
    const maxAttempts = 20; // Número máximo de intentos
    const delay = 15000; // Tiempo de espera entre intentos en milisegundos
    let attempt = 0;
  
    console.log("Querying");
  
    // while (!resultadoexitoso && attempt < maxAttempts) {
    //   attempt++;
  
    //   try {
    //     const myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
  
    //     const raw = JSON.stringify({ url: url });
  
    //     const requestOptions = {
    //       method: "POST",
    //       headers: myHeaders,
    //       body: raw,
    //     };
  
    //     const response = await fetch("https://func-anaqueles-inteligentes-back.azurewebsites.net/api/Status", requestOptions);
    //     const result = await response.json();
    //     resultadoexitoso = true;
    //     router.push("/HomeScreen");
    //     // if (result.runtimeStatus === "Completed") {
    //     //   if (result.output.resultado === "Exitoso") {
    //     //     if (result.output.output_imagenes[0].ruta_img_original !== "Error") {
    //     //       resultadoexitoso = true;
    //     //       const responseString = JSON.stringify(result.output);
    //     //       console.log("String:", responseString);
  
    //     //       await Save("resultados", responseString);
    //     //       router.push("/Resultados");
    //     //       return; // Termina la función
    //     //     } else {
    //     //       alert("Error al procesar la información");
    //     //       router.push("/SubirFotos");
    //     //       return; // Termina la función si hay error en el procesamiento
    //     //     }
    //     //   }
    //     // }
    //   } catch (error) {
    //     console.error("Error en la solicitud:", error);
    //   }
  
    //   // Espera entre intentos
    //   if (!resultadoexitoso) {
    //     await new Promise((resolve) => setTimeout(resolve, delay));
    //   }
    // }
  
    // if (!resultadoexitoso) {
    //   console.warn("Se alcanzó el número máximo de intentos sin éxito");
    //   alert("No se pudo obtener el resultado en el tiempo esperado.");
    //   router.push("/SubirFotos");
    // }

    await new Promise((resolve) => setTimeout(resolve, delay));
    router.push("/HomeScreen");

  };
  


  const getprocessed = async () => {
    const imagesupload = await GetValueFor("images") ?? [];
    const mostrador = await GetValueFor("mostrador") ?? "";
    let parsedImages: any[] = [];
    if (typeof imagesupload === 'string') {
      try {
        parsedImages = JSON.parse(imagesupload); // Convierte el string a un array
      } catch (error) {
        console.error("Error al parsear imagesupload:", error);
      }
    } else if (Array.isArray(imagesupload)) {
      parsedImages = imagesupload; // Si ya es un array, lo usamos directamente
    }
  
    const rutas = parsedImages.map((image: any) => image.path);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const user = await GetValueFor("user");
    const raw = JSON.stringify({
      "rutas": rutas,
      "mostrador_id": mostrador,
      "user_id":user
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };

    fetch("https://func-anaqueles-inteligentes-back.azurewebsites.net/api/Model", requestOptions)
      .then((response) =>  router.push("/HomeScreen"))
      .catch((error) => {

        alert("Error al procesar la información");
        router.push("/SubirFotos");
      });

  };


  useEffect( ()  => {
    

    getprocessed();
    
  },[]) 

  useEffect(() => {
    const checklogin = async () => {
      const user = await GetValueFor("user");
      if(user == null){
        router.push("/");
      }

    };
    
   
    checklogin();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + (0.95 / (15 * 60));
        if (nextProgress >= 0.95) {
          clearInterval(interval);
          return 0.95; // Mantener en 95%
        }
        return nextProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  return (
  <View style={{ flex: 1,backgroundColor:"white" }}>
    <Box height={"100%"} width={"100%"} flexDirection={"column"} alignContent={"center"} justifyItems={"center"}>
       
          <Typography style={styles.title}>Esto puede tardar un momento.</Typography>
          <Typography style={styles.subtitle}>Espera estamos enviando tu solicitud.</Typography>
        <Image
              source={require('@/assets/images/loading.png')}
              style={styles.image}
            />
            <ActivityIndicator style={{marginTop:20}} size="large" color={"rgba(37, 139, 169, 1)"} />

          <Box width={"80%"}>
            <Progress.Bar 
            progress={progress} 
            width={null} 
            color={"green"} 
            unfilledColor="lightgray" 
            borderWidth={0} 
            style={{ marginTop: 20}} 
             />
         </Box>


    </Box>
    
    <View style={styles.fixedButtons}>
      <Grid2 container columns={2} spacing={2}>
        <Grid2 size={2}>
          <Link href={"/HomeScreen"} style={{ width: "100%" }}>
            <TouchableOpacity style={{width:"100%",alignItems:"center"}}>
              <Text style={{color:"green",textDecorationLine:"underline"}}>Cancelar</Text>
            </TouchableOpacity>
          </Link>
        </Grid2>
      </Grid2>
    </View>
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:10
  },
  imageContainer: {
    paddingBottom: 80, // Espacio adicional para el área del scroll
    backgroundColor:"white"
  },
  navbar: {
    padding: 16,
    backgroundColor: '#fff',
  },
  navbarText: {
    fontSize: 14,
    fontWeight: '400',
  },
  fixedButtons: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal:10
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 5,
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: 'center',
    width:"100%"
  },
  button2: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: "center",
    width:"100%"
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  image: {
    width: '50%',
    height: 'auto', // Permite que la altura sea automática
    aspectRatio: 1,    // Puedes ajustar este valor si conoces la proporción de la imagen
    resizeMode:"contain",
    alignSelf: 'center',
    left:-20
   
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom:20
  }
});
