const MOCK_CITIES = [
    { city_id: 'city_bogota', name: 'Bogotá D.C.' },
    { city_id: 'city_medellin', name: 'Medellín' },
    { city_id: 'city_cali', name: 'Cali' },
    { city_id: 'city_barranquilla', name: 'Barranquilla' },
    { city_id: 'city_cartagena', name: 'Cartagena' },
    { city_id: 'city_pitalito', name: 'Pitalito' }, // Agregado Pitalito por tu ubicación
];

export const getCities = async () => {
    // Simula una llamada a la API con un pequeño retraso
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Serving mock cities:", MOCK_CITIES);
            resolve(MOCK_CITIES);
        }, 500); // Retraso de 500ms para simular red
    });
};

  // Puedes añadir createCity, updateCity, deleteCity aquí en el futuro si los necesitas