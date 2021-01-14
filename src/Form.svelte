<script>
    let distanca = "";
    let potrosnja = "";
    let osoba = "";
    let cenaGoriva = "";
    let ukupno = "";
    let poOsobi = "";
    let litara = "";
    let error = "";
    let dizel = 143;
    let benzin = 135;

    function izracunaj(){
        if(distanca, potrosnja, osoba, cenaGoriva !== 0){
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
<div id="form">
    <div>
        <input name="distanca" type="text" class="column input-field" placeholder="DISTANCA" bind:value={distanca}>
        <label for="distanca">DISTANCA</label>
    </div>
    <div>
        <input name="potrosnja" type="text" class="column input-field" placeholder="POTROŠNJA" bind:value={potrosnja}>
        <label for="potrosnja">POTROŠNJA</label>
    </div>
    <div>
    <input name="osoba" type="text" class="column input-field" placeholder="BROJ OSOBA" bind:value={osoba}>
    <label for="osoba">BROJ OSOBA</label>
    </div>
    <div>
    <input name="gorivo" type="text" class="column input-field" placeholder="CENA GORIVA" bind:value={cenaGoriva}>
    <label for="gorivo">CENA GORIVA</label>
    <button id="dizel" on:click={dodeliDizel}>DIZEL</button>
    <button id="benzin" on:click={dodeliBenzin}>BENZIN</button>
    </div>
    <button on:click="{izracunaj}" id="izracunaj" class="column">Izračunaj</button>
</div>

<div id="resoult">
    <p id="error">{error}</p>
<p class="odgovor">Ukupno za ovo putovanje će ti trebati <strong>{ukupno} din</strong></p>
<p class="odgovor">Svako od vas <strong>{osoba}</strong> treba da izdvoji <strong>{poOsobi} din</strong></p>
<p class="odgovor">Potrošićeš <strong>{litara} l </strong>goriva</p>
</div>

<style>

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