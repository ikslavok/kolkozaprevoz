<script>
    import * as myjson from './cene.json'
    let dizel = myjson.dizel * 117.5;
    let benzin = myjson.benzin * 117.5;
    dizel = dizel.toFixed(2);
    benzin = benzin.toFixed(2);
    let distanca = "";
    let potrosnja = "";
    let osoba = 1;
    let cenaGoriva = dizel;
    let ukupno = "";
    let poOsobi = "";
    let litara = "";
    let error = "";
    

    function izracunaj(){
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

    function dodeliDizel(){
        
        cenaGoriva = dizel;
    }
    function dodeliBenzin(){
        cenaGoriva = benzin;
    }
</script>
<form id="form" action="javascript:void(0);">
    <div>
        <input on:focus={(evt) => evt.target.select()} step="any" name="distanca" type="number" class="column input-field" placeholder="DISTANCA" bind:value={distanca}>
        <label for="distanca">DISTANCA</label>
    </div>
    <div>
        <input on:focus={(evt) => evt.target.select()} step="any" name="potrosnja" type="number" class="column input-field" placeholder="POTROŠNJA" bind:value={potrosnja}>
        <label for="potrosnja">POTROŠNJA</label>
    </div>
    <div>
    <input on:focus={(evt) => evt.target.select()} step="any" name="osoba" type="number" class="column input-field" placeholder="BROJ OSOBA" bind:value={osoba}>
    <label for="osoba">BROJ OSOBA</label>
    </div>
    <div>
    <input on:focus={(evt) => evt.target.select()} step="any" name="gorivo" type="number" class="column input-field" placeholder="CENA GORIVA" bind:value={cenaGoriva}>
    <label for="gorivo">CENA GORIVA</label>
    <button id="dizel" on:click={dodeliDizel}>DIZEL</button>
    <button id="benzin" on:click={dodeliBenzin}>BENZIN</button>
    </div>
    <button on:click="{izracunaj}" id="izracunaj" class="column">Izračunaj</button>
</form>
{#if distanca && potrosnja && osoba}
<div id="resoult">
    <p id="error">{error}</p>
<p class="odgovor">Ukupno za ovo putovanje će ti trebati <strong>{parseFloat(ukupno).toFixed(0)} din</strong> ili <strong>{parseFloat(ukupno / 117.5).toFixed(2)} eur</strong></p>
{#if osoba > 1}
<p class="odgovor">Svako od vas <strong>{osoba}</strong> treba da izdvoji <strong>{parseInt(poOsobi)} din</strong> ili <strong>{parseFloat(poOsobi / 117.5).toFixed(2)} eur</strong></p>
{/if}
<p class="odgovor">Potrošićeš <strong>{parseFloat(litara).toFixed(2)} l </strong>goriva</p>
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
#izracunaj{
    font-size: 1em;
    border: 3px solid black;
    font-family: 'Quicksand', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    width: fit-content;
    cursor: pointer;
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
@media (min-width: 760px){
.input-field{
    border: 3px solid black;
    font-family: 'Quicksand', sans-serif;
    width: 40vw;

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
</style>