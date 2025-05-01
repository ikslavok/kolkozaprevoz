<script>
    import { onMount } from 'svelte';
    export let data;
    const GOOGLE_MAPS_API_KEY = data.googleMapsApiKey;
    let dizel = data.ceneData.dizel * 117.5;
    let benzin = data.ceneData.benzin * 117.5;
    dizel = dizel.toFixed(2);
    benzin = benzin.toFixed(2);
    let distanca = "";
    let potrosnja = 7;
    let osoba = 1;
    let cenaGoriva = dizel;
    let ukupno = "";
    let poOsobi = "";
    let litara = "";
    let duration = "";
    let error = "";
    let showPocetnaLokacija = false;
    let pocetnaLokacija = "";
    let destinacija = "";
    let isDestinationEnabled = false;
    let autocompleteStart;
    let autocompleteEnd;
    let map;
    let directionsService;
    let directionsRenderer;
    

    $: {
        if(
            (distanca && potrosnja && osoba && cenaGoriva !== 0) &&
            (distanca && potrosnja && osoba && cenaGoriva !== NaN)
        ){
            litara = distanca / 100 * potrosnja;
            ukupno = litara * cenaGoriva;
            poOsobi = ukupno / osoba;
            error = "";
        } else {
            error = "Sva polja moraju biti popunjena!"
        }
    }

    function initMap() {
        if (typeof google === 'undefined') return;
        
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: { lat: 44.787197, lng: 20.457273 }, // Belgrade center
            disableDefaultUI: false,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            language: 'sr-Latn'
        });

        // Create custom navigation control
        const navigationDiv = document.createElement('div');
        const navigationControl = document.createElement('button');
        navigationControl.style.backgroundColor = '#fff';
        navigationControl.style.border = 'none';
        navigationControl.style.borderRadius = '2px';
        navigationControl.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
        navigationControl.style.cursor = 'pointer';
        navigationControl.style.margin = '10px';
        navigationControl.style.padding = '0';
        navigationControl.style.width = '40px';
        navigationControl.style.height = '40px';
        navigationControl.style.display = 'flex';
        navigationControl.style.alignItems = 'center';
        navigationControl.style.justifyContent = 'center';
        
        // Navigation icon (using Google Maps-like icon)
        navigationControl.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#666">
                <path d="M21.71 11.29l-9-9a.996.996 0 00-1.41 0l-9 9a.996.996 0 000 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 000-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.15 3.15c.2.2.2.51 0 .71L14 14.5z"/>
            </svg>
        `;
        
        navigationControl.addEventListener('click', openNavigation);
        navigationDiv.appendChild(navigationControl);
        
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(navigationDiv);

        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: false,
            hideRouteList: true,
            polylineOptions: {
                strokeColor: '#388E3C',
                strokeWeight: 4
            }
        });
    }

    async function updateRoute() {
        if (!pocetnaLokacija || !destinacija || !directionsService || !directionsRenderer) return;

        try {
            const result = await new Promise((resolve, reject) => {
                directionsService.route({
                    origin: pocetnaLokacija,
                    destination: destinacija,
                    travelMode: google.maps.TravelMode.DRIVING,
                    language: 'sr-Latn'
                }, (response, status) => {
                    if (status === 'OK') {
                        resolve(response);
                    } else {
                        reject(status);
                    }
                });
            });

            directionsRenderer.setDirections(result);
        } catch (error) {
            console.error('Error displaying route:', error);
        }
    }

    function initAutocomplete() {
        if (typeof google === 'undefined') return;

        const startInput = document.getElementById('pocetna-lokacija');
        const endInput = document.getElementById('destinacija');
        
        const autoCompleteOptions = {
            language: 'sr-latn',
            fields: ['formatted_address', 'geometry']
        };
        
        if (startInput) {
            autocompleteStart = new google.maps.places.Autocomplete(startInput, autoCompleteOptions);
            startInput.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const pacContainer = document.querySelector('.pac-container');
                    if (pacContainer && pacContainer.children.length > 0) {
                        const searchText = startInput.value;
                        await geocodeAddress(searchText, (address) => {
                            pocetnaLokacija = address;
                            isDestinationEnabled = true;
                            updateRoute();
                        });
                    }
                }
            });
            autocompleteStart.addListener('place_changed', () => {
                const place = autocompleteStart.getPlace();
                if (place && place.formatted_address) {
                    geocodeAddress(place.formatted_address, (address) => {
                        pocetnaLokacija = address;
                        isDestinationEnabled = true;
                        updateRoute();
                    });
                }
            });
        }

        if (endInput) {
            autocompleteEnd = new google.maps.places.Autocomplete(endInput, autoCompleteOptions);
            endInput.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const pacContainer = document.querySelector('.pac-container');
                    if (pacContainer && pacContainer.children.length > 0) {
                        const searchText = endInput.value;
                        await geocodeAddress(searchText, async (address) => {
                            destinacija = address;
                            if (pocetnaLokacija && destinacija) {
                                await calculateDistance();
                                updateRoute();
                            }
                        });
                    }
                }
            });
            autocompleteEnd.addListener('place_changed', async () => {
                const place = autocompleteEnd.getPlace();
                if (place && place.formatted_address) {
                    await geocodeAddress(place.formatted_address, async (address) => {
                        destinacija = address;
                        if (pocetnaLokacija && destinacija) {
                            await calculateDistance();
                            updateRoute();
                        }
                    });
                }
            });
        }
    }

    async function geocodeAddress(address, callback) {
        const geocoder = new google.maps.Geocoder();
        try {
            const result = await new Promise((resolve, reject) => {
                geocoder.geocode({
                    address: address,
                    language: 'sr-latn'
                }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        resolve(results[0]);
                    } else {
                        reject(status);
                    }
                });
            });
            
            // Force Latin script by re-geocoding the coordinates
            const latLng = result.geometry.location;
            await new Promise((resolve, reject) => {
                geocoder.geocode({
                    location: latLng,
                    language: 'sr-latn'
                }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        callback(results[0].formatted_address);
                        resolve();
                    } else {
                        reject(status);
                    }
                });
            });
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    }

    async function calculateDistance() {
        if (!google || !google.maps) return;

        const service = new google.maps.DistanceMatrixService();
        
        try {
            const response = await new Promise((resolve, reject) => {
                service.getDistanceMatrix({
                    origins: [pocetnaLokacija],
                    destinations: [destinacija],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    drivingOptions: {
                        departureTime: new Date(),
                        trafficModel: google.maps.TrafficModel.BEST_GUESS
                    },
                    language: 'sr-Latn'
                }, (response, status) => {
                    if (status === 'OK') {
                        resolve(response);
                    } else {
                        reject(new Error(`Distance Matrix failed with status: ${status}`));
                    }
                });
            });

            if (response.rows[0].elements[0].status === 'OK') {
                const distanceInKm = response.rows[0].elements[0].distance.value / 1000;
                distanca = distanceInKm.toFixed(1);
                duration = response.rows[0].elements[0].duration_in_traffic?.text || response.rows[0].elements[0].duration.text;
            }
        } catch (error) {
            console.error('Error calculating distance:', error);
        }
    }

    function dodeliDizel(){
        cenaGoriva = dizel;
    }
    function dodeliBenzin(){
        cenaGoriva = benzin;
    }
    function togglePocetnaLokacija() {
        showPocetnaLokacija = !showPocetnaLokacija;
        if (showPocetnaLokacija) {
            setTimeout(() => {
                initAutocomplete();
                initMap();
                const startInput = document.getElementById('pocetna-lokacija');
                if (startInput) {
                    startInput.focus();
                }
            }, 100);
        }
    }

    function openNavigation() {
        if (pocetnaLokacija && destinacija) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pocetnaLokacija)}&destination=${encodeURIComponent(destinacija)}&travelmode=driving`;
            window.open(url, '_blank');
        }
    }

    onMount(async () => {
        try {
            const response = await fetch('/api/fuel-prices');
            const newData = await response.json();
            if (newData) {
                dizel = (newData.dizel * 117.5).toFixed(2);
                benzin = (newData.benzin * 117.5).toFixed(2);
            }
        } catch (error) {
            console.error('Error fetching fuel prices:', error);
        }
    });

    onMount(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&loading=async&libraries=places&language=sr-Latn&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        // Wait for the map to be initialized
        const checkMap = setInterval(() => {
            if (window.map && window.directionsService && window.directionsRenderer) {
                map = window.map;
                directionsService = window.directionsService;
                directionsRenderer = window.directionsRenderer;
                clearInterval(checkMap);
            }
        }, 100);
    });
</script>

<svelte:head>
    <script>
        window.initMap = async function() {
            if (typeof google === 'undefined') return;
            
            const { Map, DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("maps");
            const { Autocomplete } = await google.maps.importLibrary("places");
            
            const mapElement = document.getElementById('map');
            if (!mapElement) return;
            
            const map = new Map(mapElement, {
                zoom: 7,
                center: { lat: 44.787197, lng: 20.457273 }, // Belgrade center
                disableDefaultUI: false, // Removes all controls
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                language: 'sr-Latn'
            });

            const directionsService = new DirectionsService();
            const directionsRenderer = new DirectionsRenderer({
                map: map,
                suppressMarkers: false,
                hideRouteList: true,
                polylineOptions: {
                    strokeColor: '#388E3C',
                    strokeWeight: 4
                }
            });

            // Store references in window object
            window.map = map;
            window.directionsService = directionsService;
            window.directionsRenderer = directionsRenderer;
            window.Autocomplete = Autocomplete;
        };
    </script>
</svelte:head>

<form id="form" action="javascript:void(0);">
    {#if showPocetnaLokacija}
    <div>
        <input 
            tabindex="0" 
            on:focus={(evt) => evt.target.select()} 
            id="pocetna-lokacija"
            name="pocetna-lokacija" 
            type="text" 
            class="column input-field lokacija" 
            placeholder="POČETNA LOKACIJA" 
            bind:value={pocetnaLokacija}>
        <label for="pocetna-lokacija" class="lokacija-label">POČETNA LOKACIJA</label>
    </div>

    <div>
        <input 
            tabindex="0" 
            on:focus={(evt) => evt.target.select()} 
            id="destinacija"
            name="destinacija" 
            type="text" 
            class="column input-field lokacija" 
            placeholder="DESTINACIJA" 
            bind:value={destinacija}
            disabled={!isDestinationEnabled}>
        <label for="destinacija" class="lokacija-label">DESTINACIJA</label>
    </div>
    {/if}

    <div>
        <input tabindex="0" on:focus={(evt) => evt.target.select()} step="any" name="distanca" type="number" class="column input-field" placeholder="DISTANCA" bind:value={distanca}>
        <label for="distanca">DISTANCA</label>
        <button tabindex="-1" id="izracunaj" on:click={togglePocetnaLokacija}>IZRAČUNAJ</button>
    </div>
    <div>
        <input tabindex="0" on:focus={(evt) => evt.target.select()} step="any" name="potrosnja" type="number" class="column input-field" placeholder="POTROŠNJA (l/100km)" bind:value={potrosnja}>
        <label for="potrosnja">POTROŠNJA (l/100km)</label>
    </div>
    <div>
        <input tabindex="0" on:focus={(evt) => evt.target.select()} step="any" name="osoba" type="number" class="column input-field" placeholder="BROJ OSOBA" bind:value={osoba}>
        <label for="osoba">BROJ OSOBA</label>
    </div>
    <div>
        <input tabindex="0" on:focus={(evt) => evt.target.select()} step="any" name="gorivo" type="number" class="column input-field" placeholder="CENA GORIVA" bind:value={cenaGoriva}>
        <label for="gorivo">CENA GORIVA</label>
        <button id="dizel" on:click={dodeliDizel}>DIZEL</button>
        <button id="benzin" on:click={dodeliBenzin}>BENZIN</button>
    </div>
</form>

{#if distanca && potrosnja && osoba}
<div id="resoult">
    <p id="error">{error}</p>
    <p class="odgovor">Ukupno za ovo putovanje će ti trebati <strong>{parseFloat(ukupno).toFixed(0)} din</strong> ili <strong>{parseFloat(ukupno / 117.5).toFixed(2)} eur</strong></p>
    {#if osoba > 1}
    <p class="odgovor">Svako od vas <strong>{osoba}</strong> treba da izdvoji <strong>{parseFloat(poOsobi).toFixed(0)} din</strong> ili <strong>{parseFloat(poOsobi / 117.5).toFixed(2)} eur</strong></p>
    {/if}
    <p class="odgovor">Potrošićeš <strong>{parseFloat(litara).toFixed(2)} l </strong> goriva {#if duration} i trajaće oko <strong>{duration}</strong>{/if}</p>
</div>
{/if}

{#if showPocetnaLokacija}
<div class="map-wrapper">
    <div id="map"></div>
</div>
{/if}

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input[type=number] {
    -moz-appearance: textfield;
}
#form{
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    justify-items: center;
}
#form div{
    position: relative;
    overflow: hidden;
}
label{
    background: black;
    color: white;
    font-size: 70%;
    padding: 1px 6px;
    z-index: 2;
    text-transform: uppercase;
    position: absolute;
    bottom: 10px;
    width: 70vw;
}
#error{
    color: red;
    text-align: center;
}
.odgovor{
    text-align: center;
    font-size: 0.9em;
}
.odgovor strong{
    font-size: 1.2em;
}
.input-field{
    border: 3px solid black;
    font-family: 'Quicksand', sans-serif;
    width: 70vw;
    margin-bottom: 1.3em;
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
}
#dizel{
    position: absolute;
    right: 1px;
    border: 1px solid black;
    bottom: 34px;
    z-index: 1;
    font-size: 0.6em;
    background-color: black;
    color: white;
    font-family: 'Quicksand', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    width: fit-content;
    cursor: pointer;
}
#benzin{
    position: absolute;
    right: 38px;
    border: 1px solid black;
    bottom: 34px;
    z-index: 1;
    font-size: 0.6em;
    background-color: black;
    color: white;
    font-family: 'Quicksand', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    width: fit-content;
    cursor: pointer;
}
#izracunaj{
    position: absolute;
    right: 1px;
    border: 1px solid black;
    bottom: 34px;
    z-index: 1;
    font-size: 0.6em;
    background-color: black;
    color: white;
    font-family: 'Quicksand', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    width: fit-content;
    cursor: pointer;
}
.lokacija{
    border: 3px solid #C8E6C9;
}
.lokacija-label{
    color: #388E3C;
    background: #C8E6C9;
}
@media (min-width: 760px){
.input-field{
    border: 3px solid black;
    font-family: 'Quicksand', sans-serif;
    width: 40vw;
}
.lokacija{
    border: 3px solid #C8E6C9;
}
label{
    background: black;
    color: white;
    font-size: 70%;
    padding: 1px 6px;
    z-index: 2;
    text-transform: uppercase;
    position: absolute;
    bottom: 10px;
    width: 40vw;
}
}
.map-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 20px 0;
}

#map {
    width: 70vw;
    height: 200px;
    border: 3px solid #C8E6C9;
}

@media (min-width: 760px) {
    #map {
        width: 40vw;
    }
}

#navigate {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #388E3C;
    color: white;
    border: none;
    border-radius: 4px;
    font-family: 'Quicksand', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
}

#navigate:hover {
    background-color: #2E7D32;
}
</style> 